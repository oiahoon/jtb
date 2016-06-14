document.addEventListener('DOMContentLoaded', function() {
  var goJiraButton = document.getElementById('go');
  options = JSON.parse(localStorage.jira_options);
  var jira_url = options.jira_url;
  var prefix   = options.favoritePorject;
  if(jira_url == undefined || jira_url.length < 1 || prefix == undefined ||  prefix.length < 1 ){
      document.getElementById('container').innerHTML = '<code>fill the options before use :(</code>';
      return false;
    }
  document.getElementById('prefix').value = prefix;
  goJiraButton.addEventListener('click', function() {
    var jira_number=document.getElementById('jira_number').value;
    window.open(jira_url+prefix+'-'+jira_number);
  }, false);
}, false);