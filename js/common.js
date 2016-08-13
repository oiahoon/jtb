var storage = chrome.storage.local;
function arr_delete( arr, id ){
  if(arr.constructor === Array){
    if (Number.isInteger(id) && id > 0 ) {
      for (var i = arr.length - 1; i >= 0; i--) {
        if(!(Number.isInteger(arr[i].id) && arr[i].id > 0) || arr[i].id == id){
          arr.splice(i, 1);
        }
      }
      for (var i = arr.length - 1; i >= 0; i--) {
        arr[i].id = i + 1;
      }
    }
    return arr;
  }
  else{
    return [];
  }
}

function arr_insert( arr, item ){
  if(!(arr.constructor === Array)){arr = Array();}
  if(typeof item == 'object'){
    item.id = arr.length + 1;
    item_to_insert = item;
  }
  else{
    item_to_insert = {id: (arr.length + 1), item}
  }
  arr.push(item);
  return arr;
}



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

