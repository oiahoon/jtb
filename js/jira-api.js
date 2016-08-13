/**
 * JTB means jira tool box
 * use Cookie-based Authentication
 */
class JTB {
  constructor(jira_url, username, password) {
    this._jira_url = jira_url;
    this._user = username;
    this._password = password;
    this._client = undefined;
    this._cookie = undefined;
  }

  client() {
    if(this._client == undefined) {
      this._client = new XMLHttpRequest();
    }
    return this._client;
  }

  auth() {
    var client = this.client();
    var url = this._jira_url + '/rest/auth/1/session';
    client.open("POST", url, false);
    client.setRequestHeader("Content-Type", "application/json");
    // console.log("===============================");
    var post_data = JSON.stringify({"username": this._user, "password": this._password});
    // console.log(post_data);
    client.send(post_data);
    // console.log(client.response);
    if (client.status == 200){
      console.log('succesfully logged in');
      var resp = JSON.parse(client.response);
      var session  = resp.session;
      this._cookie = session.name + '=' + session.value;
    }
    else {
      throw "Login failed :(";
    }
  }

  query(queryJson){
    if(this._cookie == undefined){ this.auth(); }
    var client = this.client();
    var url = this._jira_url + '/rest/api/2/search';
    client.open("POST", url, false);
    client.setRequestHeader("Content-Type", "application/json");
    var post_data = JSON.stringify(queryJson);
    client.send(post_data);
    var resp = JSON.parse(client.response);
    // console.log(resp);
    return resp;
  }
}

/**
 * USAGE
 */
// jira_tool_box = new JTB('https://jirafnd.dev.activenetwork.com', 'jhuang', 'hyY19870511');
// jira_tool_box.auth();
// result = jira_tool_box.query({
//   'jql':'filter=35023',
//   "startAt": 0,
//   "maxResults": 50,
//   "fields":["id","key", "duedate","progress","timespent", "status", "customfield_12551", "assignee"]
// });
