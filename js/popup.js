var jira_url; var prefix;
var username; var password; var jql;

storage.get('jira_url', function(items){
  // console.log(items);
  jira_url = items.jira_url;
});
storage.get('project', function(items){
  // console.log(items);
  prefix = items.project;
});
storage.get('username', function(items){
  username = items.username;
});
storage.get('password', function(items){
  password = items.password;
});
storage.get('jql', function(items){
  jql = items.jql;
});
var refresh_cache_button = $('<span class="glyphicon glyphicon-refresh refresh-data" data-toggle="tooltip" data-placement="right" title="click to refresh data!"></span>');

// customfield_12551 => dev duedate
// customfield_11150 => sprint
function fetch_data_and_render(){
  var queryJson = {
    'jql': jql,
    "startAt": 0,
    "maxResults": 50,
    "fields":["id","key", "duedate", "summary",
              "progress","timespent", "status", "customfield_12551",
              // "subtasks", "fixVersions",
              "assignee", "customfield_11150", "issuetype"]
  }
  var lstorage = chrome.storage.local;
  var md5_key = md5(JSON.stringify(queryJson));
  var cache_data = undefined;
  // console.log('======== query key : '+md5_key);

  lstorage.get(md5_key, function(items){
    if(items[md5_key] && items[md5_key]._expiretime && items[md5_key]._expiretime >= (new Date().getTime())){
        console.log('fetch data from cache');
        cache_data = items[md5_key]._data;
        render_tickets(cache_data);
    }
    else{
      console.log('cache data is undefined or expired, refresh!');
      cache_data = refresh_cache(jql);
      render_tickets(cache_data);
    }
  });


}

function reload_issue_list() {
    $("#jira-list").empty();
    var spinner = new Spinner(spin_opts).spin();
    $(".alert").html("<strong>Loading jira tickets..</strong>").show().append(spinner.el);
    var cache_data = refresh_cache(jql);
    console.log('fetch data ok');
    setTimeout(function(){render_tickets(cache_data);}, 543)
}

function refresh_cache(jql){
  var queryJson = {
    'jql': jql,
    "startAt": 0,
    "maxResults": 50,
    "fields":["id","key", "duedate", "summary",
              "progress","timespent", "status", "customfield_12551",
              // "subtasks", "fixVersions",
              "assignee", "customfield_11150", "issuetype"]
  }
  jira_tool_box = new JTB(jira_url, username, password);
  cache_data = jira_tool_box.query(queryJson);
  // console.log(cache_data);
  var md5_key = md5(JSON.stringify(queryJson));
  var data_to_cache = {};
  var lstorage = chrome.storage.local;
  data_to_cache[md5_key] = {_data: cache_data, _expiretime: new Date().getTime() + expiretime}
  console.log('save data to cache');
  lstorage.set(data_to_cache);
  return cache_data;
}

function render_tickets(data){
  // jira_tool_box = new JTB(jira_url, username, password);
  // jira_tool_box.auth();
  // result = jira_tool_box.query({
  //   'jql': jql,
  //   "startAt": 0,
  //   "maxResults": 50,
  //   "fields":["id","key", "duedate", "summary",
  //             "progress","timespent", "status", "customfield_12551",
  //             // "subtasks",
  //             "assignee", "fixVersions", "issuetype"]
  // });
  console.log("render Tickets");
  for (var i = 1; i <= 50; i++) {
    dataIsReady(i);
    if(data != null && data.issues.length > 0){
      $(".alert").hide();
      $(".myTabContent").removeClass('hidden');
      var title_bar = $('<h3>Tickets&nbsp;</h3>').append(refresh_cache_button);
      $("#jira-list").html(title_bar);
      $('.refresh-data').tooltip();
      append_tickets(data.issues);
      break;
    }
  }
}

function dataIsReady(i) {
  setTimeout(function(){
    console.log("try "+i+" times.");
  }, 100);
}

function append_tickets(tickets){
  var tickets_html = [];
  for (var i = 0; i < tickets.length; i++) {
    tickets_html.push(create_ticket(tickets[i]));
  }
  $("#jira-list").append(tickets_html);
}

function create_ticket(ticket){
  var ticket_html = $(document.createElement('li'))
  .attr({
    "data-id": ticket.id,
    "data-key": ticket.key
  })
  .addClass('list-group-item jira-ticket');
  ticket_html.append('<div class="issuetype" title="'+ticket.fields.issuetype.name+'">'+
                      '<img src="'+ticket.fields.issuetype.iconUrl+'"></div>');
  ticket_html.append('<h5 data-jira-key="' + ticket.key + '"><a href="'+jira_url+'/browse/'+ticket.key+'"><b>[' + ticket.key + ']</b>' +ticket.fields.summary + '</a></h5>');
  ticket_html.append('<p class="assignee text-muted"><span class="glyphicon glyphicon-user" aria-hidden="true" title="Assignee"></span><em>'
                      + ticket.fields.assignee.displayName +
                      '</em>' + duedate_span(ticket.fields.customfield_12551) + '</p>');
  ticket_html.prepend(status_label(ticket.fields.status));
  ticket_html.prepend(sprint_span(sprint_name(ticket.fields.customfield_11150)));
  // console.log(ticket_html);
  return ticket_html;
}

function sprint_name(sprint_string){
  var result = '';
  if(sprint_string && sprint_string.length > 0) {
    result = sprint_string[0].match(/,name=([^,]*),/)[1];
  }
  return result;
}

function issuetype_icon(issuetype){
  var result = '';
  if(issuetype) {
    result = issuetype.iconUrl;
  }
}

function sprint_span(sprint) {
  var result = '<span class="label fix-version label-default">Back log</span>';
  if (sprint != '') {
    result = '<span class="label fix-version label-default">' + sprint + '</span>';
  }
  return result;
}
function duedate_span(duedate) {
  var result = '';
  if (duedate) {
    result = '&nbsp;|&nbsp;<span class="glyphicon glyphicon-time" aria-hidden="true" title="Dev Duedate"></span><em>'
              + duedate +'</em>';
  }
  return result;
}
function status_label(status) {
  var cls = 'label-info';
  switch (status.name) {
    case 'Open':
    case 'In Progress':
      cls = 'label-info';
      break;
    case 'Coding':
      cls = 'label-success';
      break;
    case 'Test':
      cls = 'label-warning';
      break;
    case 'Closed':
      cls = 'label-default';
      break;
    case 'Review':
      cls = 'label-primary';
      break;
  }
  var status_html = $('<span class="label status">'+status.name+'</span>').addClass(cls);
  return status_html;
}
function time_convert(seconds) {
  var days = 0;
  var hours = Math.floor( seconds / (60*60) );
  if(hours > 8){
    days = Math.floor(hours/8);
    hours_left = hours - days*8;
    result = days + 'd' + hours_left + 'h';
  }
  else if(hours == 8){
    result = '1d';
  }
  else{
    result = hours + 'h';
  }
  return result;
}
function get_time_remaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function open_jira_ticket(jira_key){
  chrome.tabs.create({url: jira_url+'/browse/' + jira_key, active: false});
  $("input#jira_number").val('');
}
$(function() {
  console.profile('performace analysing');
  if(jira_url == undefined || jira_url.length < 1
      || prefix == undefined ||  prefix.length < 1){
    $('.container').html('<div class="alert alert-dismissible alert-success">'+
        '<strong>Hello!</strong> You can configure from <a href="#" class="alert-link option-page-link">options!</a>.'+
      '</div>');
  }
  else{
    var spinner = new Spinner(spin_opts).spin();
    $.when(
      $(".alert").html("<strong>Loading jira tickets..</strong>").append(spinner.el)
    ).then(function(){
      fetch_data_and_render();
      }
    );

  }

  $("div.container").on('click', 'a.option-page-link', function(event) {
    if (chrome.runtime.openOptionsPage) {
      // New way to open options pages, if supported (Chrome 42+).
      chrome.runtime.openOptionsPage();
    } else {
      // Reasonable fallback.
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
  // open new tab on background, without losing focus on popup
  $("ul.list-group").on('click', 'a', function(e){
    chrome.tabs.create({url:this.href, active: false});
  });
  $('#prefix').html(prefix + ' - ');
  $('form#jira').submit(function(event) {
    var jira_number = $("#jira_number").val();
    open_jira_ticket(prefix+'-'+jira_number);
    return false;
  });
  $("#jira-list").on('click', 'span', function(e){
    console.log('manual refreshing the data.');
    reload_issue_list();
  });
  console.profileEnd();
});