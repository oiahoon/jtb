document.addEventListener('DOMContentLoaded', function() {
  var goJiraButton = document.getElementById('go');
  goJiraButton.addEventListener('click', function() {
    jira_number_input=document.getElementById('jira_number');
    document.getElementById('jira_number').focus();
    chrome.tabs.getSelected(null, function(tab) {
      var jira_url="https://jirafnd.dev.activenetwork.com/browse/";
      var prefix=document.getElementById('prefix').value;
      var jira_number=jira_number_input.value;

      window.open(jira_url+prefix+'-'+jira_number);
    });
  }, false);
}, false);