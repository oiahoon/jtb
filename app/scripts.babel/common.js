global.storage = chrome.storage.sync;
global.spin_opts = {
  lines: 7 // The number of lines to draw
, length: 0 // The length of each line
, width: 14 // The line thickness
, radius: 9 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1.9 // Rounds per second
, trail: 50 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '68%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
};
global.manifest = chrome.runtime.getManifest();
global.expiretime = 1000*60*5; // expired in 5 minutes


global.storage_prefix = 'jtb__';
global.defaultJql = 'project = veb AND issuetype in standardIssueTypes() AND status in (Open, \'In Progress\', Test, Review, Design, Coding, \'Review Queue\', \'Code Review\') AND assignee in (currentUser()) ORDER BY created DESC';


global.timestart = Date.now();
function timeMark(mark){
  console.warn(' Bof [' + mark + '] ================');
  console.log(Date.now() - timestart);
  timestart = Date.now();
}
