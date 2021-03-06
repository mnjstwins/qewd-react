/*

 ----------------------------------------------------------------------------
 | qewd-react: React Client Modules for QEWD                                |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
 | Reigate, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  17 January 2017

*/

"use strict"

var React = require('react');
var ReactDOM = require('react-dom');
var ewdClient = require('ewd-client');
var ewdController = require('./controller');

module.exports = function(params) {

  var io;
  if (!params.no_sockets) io = require('socket.io-client');
  var $;
  if (!params.ajax) $ = require('jquery');

  var EWD = ewdClient.EWD;
  //console.log('cwd = ' + process.cwd());
  EWD.application = {
    name: params.applicationName || 'unknown',
    mode: params.mode || 'development',
    log: params.log || true
  };

  EWD.log = params.log || false;

  //console.log('EWD = ' + JSON.stringify(EWD));
  var MainPage = params.MainPage;

  var Top = React.createClass({

    getInitialState: function() {
      return {
        status: 'wait',
      }
    },

    componentWillMount: function() {

      // set up EWD.js-specific context

      this.controller = ewdController(EWD, this, $, io);
    },


    componentDidMount: function() {
      if (params.log) console.log('starting EWD');
      var startParams = {
        application: EWD.application.name,
        cookieName: params.cookieName,
        url: params.url,
        io: io,
        $: $
      };
      this.start(startParams);
    },

  render: function render() {

    var componentPath = ['app'];

    var renderComponent;
    if (this.state.status === 'wait') {
      renderComponent = React.createElement(
        'div',
        null,
        'Please wait...'
      );
    } else {
      renderComponent = React.createElement(MainPage, {
        controller: this.controller,
        componentPath: componentPath,
        status: this.state.status
      });
    }

    return renderComponent;
  }
});

ReactDOM.render(React.createElement(Top, null), document.getElementById('content'));
};

