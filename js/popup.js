var jira_url; var prefix;
var username; var password; var jql;
var close_button = '<div id="close-button" class="btn btn-primary btn-xs close-button">&times;</div>';

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

function render_tickets(){
  jira_tool_box = new JTB(jira_url, username, password);
  // jira_tool_box.auth();
  result = jira_tool_box.query({
    'jql': jql,
    "startAt": 0,
    "maxResults": 50,
    "fields":["id","key", "duedate", "summary",
              "progress","timespent", "status", "customfield_12551",
              // "subtasks",
              "assignee", "fixVersions", "issuetype"]
  });
  if (result.issues.length > 0) {
    $(".alert").remove();
    $(".myTabContent").removeClass('hidden');
    $("#jira-list").html('<h3>Tickets</h3>');
    append_tickets(result.issues);
  }
}

function append_tickets(tickets){
  for (var i = 0; i < tickets.length; i++) {
    $("#jira-list").append(create_ticket(tickets[i]));
  }
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
  ticket_html.prepend(sprint_span(ticket.fields.fixVersions));
  // console.log(ticket_html);
  return ticket_html;
}

function issuetype_icon(issuetype){
  var result = '';
  if(issuetype) {
    result = issuetype.iconUrl;
  }
}

function sprint_span(sprint) {
  var result = '<span class="label fix-version label-default">Back log</span>';
  if (sprint && sprint.length > 0) {
    result = '<span class="label fix-version label-default">' + sprint[0].name + '</span>';
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
  window.open(jira_url+'/browse/' + jira_key);
}

$(function() {
  if(jira_url == undefined || jira_url.length < 1
      || prefix == undefined ||  prefix.length < 1){
    $('.container').html('<div class="alert alert-dismissible alert-success">'+
        '<strong>Hello!</strong> You can configure from <a href="#" class="alert-link option-page-link">options!</a>.'+
      '</div>');
  }
  else{
    var spinner = new Spinner(spin_opts).spin();
    $.when(
      $(".alert").html("<strong>Loading jira tickets..</strong>").append(spinner.el),
      setTimeout(function(){if (jql == undefined ||  jql.length < 1 ) {
        $(".alert").html('<strong>Hello!</strong> You can set you tickets jql from <a href="#" class="alert-link option-page-link">options!</a>.')
      }
      else{
        render_tickets();
      }
      },1333)
    ).done();
  }
  // $.when().then(function( x ) {
  // });
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
  // $('[data-toggle="tooltip"]').tooltip();
});
