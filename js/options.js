var acc_attrs = ['jira_url', 'project', 'username', 'password'];
var event_item = $('<li class="col-md-5" data-id=""><a><span class="badge"></span><button type="button" class="close jira_fake"><span class="delete_reminder">&times;</span></button></a></li>');

function save_options() {
  var jira_url = $('#jira_url').val();
  var project  = $('#project').val();
  var username = $("#username").val();
  var password = $("#password").val();
  var jql      = $("#jql").val();
  storage.set({jira_url: jira_url, project: project, username: username, password: password, jql: jql}, function(){
    $("#save-status").html("Options saved.").fadeIn().fadeOut('slow');
    // $("#save-status").fadeIn();
  });
}

function restore_options() {
  // this is unexpected!!! why
  // for (var i = 0; i < acc_attrs.length; i++) {
  //   var el = acc_attrs[i];
  //   var element = document.getElementById(el);
  //   storage.get(el, function(items){
  //     console.log(items);
  //     console.log(element);
  //     console.log(el);
  //     items[el] && (element.value = items[el]);
  //   });
  // }
  storage.get('jira_url', function(items){
    // console.log(items);
    items.jira_url && $('#jira_url').val(items.jira_url);
  });
  storage.get('project', function(items){
    // console.log(items);
    items.project && $('#project').val(items.project);
  });
  storage.get('username', function(items){
    items.username && $('#username').val(items.username);
  });
  storage.get('password', function(items){
    items.password && $('#password').val(items.password);
  });
  storage.get('jql', function(items){
    items.jql && $('#jql').val(items.jql);
  });
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
  $("span.version").html(manifest.version);
});