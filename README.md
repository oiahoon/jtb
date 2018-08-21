# Jira Tool Box (JTB)
[![Code Climate](https://codeclimate.com/github/oiahoon/jtb/badges/gpa.svg)](https://codeclimate.com/github/oiahoon/jtb)
[![codebeat badge](https://codebeat.co/badges/4b65b33e-44e6-47ed-93d7-4077db7fde2f)](https://codebeat.co/projects/github-com-oiahoon-jtb-master)
[![BCH compliance](https://bettercodehub.com/edge/badge/oiahoon/jtb?branch=master)](https://bettercodehub.com/)
[![Build Status](https://travis-ci.org/oiahoon/jtb.svg?branch=master)](https://travis-ci.org/oiahoon/jtb)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Waffle.io - Issues in progress](https://badge.waffle.io/oiahoon/jtb.png?label=in%20progress&title=In%20Progress)](http://waffle.io/oiahoon/jtb)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Foiahoon%2Fjtb.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Foiahoon%2Fjtb?ref=badge_shield)
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

npm install

# Transform updated source written by ES2015 (default option)
gulp babel

# or Using watch to update source continuously
gulp watch

# Make a production version extension
gulp build
```
if you meet the `check shasum failed` error, maybe you are in China as me,
there are 3 ways to resolve:

```bashshell
# 1. config command
npm config set registry http://registry.cnpmjs.org 
npm info underscore （it will return response）
# 2. npm cli
npm --registry http://registry.cnpmjs.org info underscore 
# 3. vim ~/.npmrc 
registry = http://registry.cnpmjs.org
```

## via & thanks
  - [generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension)
  - [yeoman](http://yeoman.io/)
  - [Vue](https://github.com/vuejs/vue)
  - [Vue ls](https://github.com/RobinCK/vue-ls)
  - [pure.css](https://purecss.io/)

----
Built by (c) Joey Huang and contributors. Released under the MIT license.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Foiahoon%2Fjtb.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Foiahoon%2Fjtb?ref=badge_large)
