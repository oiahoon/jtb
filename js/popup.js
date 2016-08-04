var jira_url;
var prefix;
var close_button = '<div id="close-button" class="btn btn-primary btn-xs close-button">&times;</div>';

storage.get('jira_url', function(items){
  console.log(items);
  jira_url = items.jira_url;
});
storage.get('project', function(items){
  console.log(items);
  prefix = items.project;
});

restore_reminders();

function restore_reminders(){
  storage.get({reminder_events: []}, function(items) {
    var reminder_events = items.reminder_events;
    // console.log(reminder_events);
    // console.log(reminder_events.length);
    if (reminder_events.length > 0) {
      $(".alert").remove();
      $(".event-box").removeClass('hidden');
      render_reminders(reminder_events);
      console.log(reminder_events);
    }
  });
}

function remove_reminder(event_id){
  storage.get({reminder_events: []}, function(items) {
    var reminder_events = items.reminder_events;
    reminder_events = arr_delete(reminder_events, event_id);
    // console.log("arr_delete:");
    // console.log(reminder_events);
    storage.set({reminder_events: reminder_events}, function() {
      render_reminders(reminder_events);
    });
  });
}

function render_reminders(reminder_events){
  $(".event-box").html('<h3>Reminders</h3>');
  for (var i = 0; i < reminder_events.length; i++) {
    var time_string = reminder_events[i].event_date.slice(0,10);
    var event_html = $('<a href="#" class="list-group-item" data-index='+reminder_events[i].id+'><span class="badge">'+time_string+'</span><p data-jira-number="'+reminder_events[i].event_name+'">'+reminder_events[i].event_name+'</p></a>')
    event_html.append(close_button);
    var time_left = get_time_remaining(reminder_events[i].event_date);
    if(time_left.total > 0) {
      process_bar = $('<div class="progress progress-striped active"><div class="progress-bar" style="width: 15%"></div></div>')
      if(time_left.days < 1){
        if(time_left.hours < 6) {
          event_html.find("span").attr('class', 'badge badge-danger');
          process_bar.find(".progress-bar").addClass("progress-bar-danger").attr('style', 'width: 95%');
        }
        else{
          event_html.find("span").attr('class', 'badge badge-warning');
          process_bar.find(".progress-bar").addClass("progress-bar-warning").attr('style', 'width: 75%');
        }
      }
      else{
        event_html.find("span").attr('class', 'badge badge-success');
        process_bar.find(".progress-bar").addClass('progress-bar-success');
      }
      event_html.append(process_bar);
    }
    else{
      event_html.find(".badge").attr('class', 'badge badge-default').html('Over due ;(')
      event_html.append('<div class="progress"><div class="progress-bar" style="width: 100%"></div></div>')
    }
    event_html.hover(function() {
    var clsbtn = $(this).find(".close-button");
      clsbtn.show();
      clsbtn.click(function(event) {
        var event_id = $(this).parent('a').attr('data-index');
        remove_reminder(parseInt(event_id));
        // return false;
      });
    }, function() {
      $(this).find('.close-button').hide();
    });
    $(".event-box").append(event_html);
  }
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

function open_jira_number(jira_number){
  window.open(jira_url+prefix+'-'+jira_number);
}
$(function() {
  $(".option-page-link").click(function(event) {
    if (chrome.runtime.openOptionsPage) {
      // New way to open options pages, if supported (Chrome 42+).
      chrome.runtime.openOptionsPage();
    } else {
      // Reasonable fallback.
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
  $('#prefix').html(prefix + ' - ');
  if(jira_url == undefined || jira_url.length < 1 || prefix == undefined ||  prefix.length < 1 ){
    $('.container').html("<code>fill the options before use :(</code>");
    return false;
  }
  $('form#jira').submit(function(event) {
    var jira_number = $("#jira_number").val();
    open_jira_number(jira_number);
    return false;
  });
  $(".list-group-item p").click(function(event) {
    var jira_number = $(this).attr("data-jira-number");
    open_jira_number(jira_number);
    return false;
  });

});
