# Jira Tool Box (JTB)
[![Code Climate](https://codeclimate.com/github/oiahoon/jtb/badges/gpa.svg)](https://codeclimate.com/github/oiahoon/jtb)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
----
## info
  Jira Tool Box(short just JTB) is designed to speed up your workflow. It's simple to use!
  You can easily direct to a JIRA ticket just by enter the ID.
  You can browse your concerned tickets without open the Jira dashbord.
  Just configure the *Jira Url*, *Project*, *JQL* and you are ready to go! Do not need your account, just login the jira on chrome before.

[![Jira Tool Box! @Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png "Jira Tool Box! @Chrome Web Store")](https://chrome.google.com/webstore/detail/jira-tool-box/loekjiebmpggjjhekdeifbbbmlcdlbba?hl=zh-CN)

#  FEATURES
  - Just type the ticket ID and hit enter and are directly to the JIRA ticket page;
  - List your tickets by JQL or filter id;
  - Easy to browse your concerned ticktets;
  - Do not need you account, but you should login in from chrome before use;

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete changelog.

## Support

For support please create an issue here at GitHub

## Pull Requests

Feel free to submit any PRs here, too. :)

Please indent using two spaces only, have a newline at the EOF and use UNIX line ending, thanks!


## development
```bashshell
# Please make sure that `yo`, `gulp` and `bower` was installed on your system using this command:
npm install --global yo gulp-cli bower

# clone the repo
git clone https://github.com/oiahoon/go-jira.git

# cd 
cd go-jira

# Transform updated source written by ES2015 (default option)
gulp babel

# or Using watch to update source continuously
gulp watch

# Make a production version extension
gulp build
```

## via & thanks
  - [generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension)
  - [yeoman](http://yeoman.io/)

----
Built by (c) Joey Huang and contributors. Released under the MIT license.
