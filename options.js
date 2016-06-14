function save_options() {
  var url = document.getElementById('url').value;
  var project = document.getElementById('project').value;
  localStorage.jira_options = JSON.stringify({
    jira_url: url,
    favoritePorject: project
  });
  var status = document.getElementById('status');
  status.textContent = 'Options saved.';
  setTimeout(function() {
    status.textContent = '';
  }, 750);
}

function restore_options() {
  options = JSON.parse(localStorage.jira_options);
  console.log(options);
  document.getElementById('url').value = (options.jira_url.length > 0 ? options.jira_url : '');
  document.getElementById('project').value = (options.favoritePorject.length > 0 ? options.favoritePorject : '');
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);