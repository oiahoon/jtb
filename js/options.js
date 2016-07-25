var storage = chrome.storage.local;
var event_item = $('<li class="col-md-5" data-id=""><a><span class="badge"></span><button type="button" class="close jira_fake"><span class="delete_reminder">&times;</span></button></a></li>');

function save_options() {
  var url = document.getElementById('url').value;
  var project = document.getElementById('project').value;
  storage.set({jira_url: url, project: project}, function(){
    $("#save-status").html("Options saved.").fadeIn().fadeOut('slow');
    // $("#save-status").fadeIn();
  });
}

function restore_options() {
  storage.get('jira_url', function(items){
    // console.log(items);
    if(items.jira_url){
      $('#url').val(items.jira_url);
    }
  });
  storage.get('project', function(items){
    // console.log(items);
    if(items.project){
      $('#project').val(items.project);
    }
  });
  restore_reminders();
}

function add_reminder(){
  var event_name  = $("#event-name").val();
  var event_date  = $("#event-date").val() + " 18:00:00";
  if (event_name.length > 0 && event_date.length > 0) {
    append_event(event_name, event_date);
    $("#event-name").val('');
    console.log("add reminder:" + event_name + " @ " + event_date);
  }
  else{
    console.warn("event_name or event_date is empty!");
  }
}
function append_event(event_name, event_date){
  storage.get({reminder_events: []}, function(items) {
    var reminder_events = items.reminder_events;
    // reminder_events.push({event_name: event_name, event_date: event_date});
    reminder_event = {event_name: event_name, event_date: event_date};
    reminder_events = arr_insert(reminder_events, reminder_event);
    storage.set({reminder_events: reminder_events}, function() {
      render_reminders(reminder_events);
    });
  });
}

function remove_reminder(event_id){
  storage.get({reminder_events: []}, function(items) {
    var reminder_events = items.reminder_events;
    reminder_events = arr_delete(reminder_events, event_id);
    storage.set({reminder_events: reminder_events}, function() {
      render_reminders(reminder_events);
    });
  });
}

function restore_reminders(){
  storage.get({reminder_events: []}, function(items) {
    var reminder_events = items.reminder_events;
    render_reminders(reminder_events)
    // console.log(reminder_events);
  });
}
function render_reminders(reminder_events){
  $(".event-box ul").html('');
  for (var i = 0; i < reminder_events.length; i++) {
    var event_html = event_item.clone();
    event_html.find("span.badge").html(reminder_events[i].event_date.slice(0,10));
    event_html.find("a").prepend(reminder_events[i].event_name);
    event_html.attr('data-id', reminder_events[i].id);
    event_html.find('.delete_reminder').on('click', delete_handler);
    $(".event-box ul").append(event_html);
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
function arr_delete( arr, id ){
  if(arr.constructor === Array && Number.isInteger(id) && id > 0 ){
    for (var i = arr.length - 1; i >= 0; i--) {
      if(!(Number.isInteger(arr[i].id) && arr[i].id > 0) || arr[i].id == id){
        arr.splice(i, 1);
      }
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i].id = i + 1;
    }
    return arr;
  }
  else{
    return [];
  }
}

function delete_handler(){
  var reminder_id = $(this).parent("button").parent("a").parent("li").attr('data-id');
  console.log("delete "+ reminder_id);
  remove_reminder(parseInt(reminder_id));
}
$(function () {
  var today = new Date();
  var dd    = ("0" + (today.getDate())).slice(-2);
  var mm    = ("0" + (today.getMonth() +　1)).slice(-2);
  var yyyy  = today.getFullYear();
  today     = yyyy + '-' + mm + '-' + dd ;

  restore_options();

  $("input[type=date]").attr("value", today);

  $("#add-event").click(function(event) {
    add_reminder();
  });
  $("#save").click(function(event) {
    save_options();
  });
  $(".jira_fake").submit(function(event) {
    event.preventDefault();
    // return false;
  });


});