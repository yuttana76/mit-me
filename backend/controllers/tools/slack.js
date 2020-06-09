//Tutorail link
// https://www.npmjs.com/search?q=keywords:slack
// https://api.slack.com/messaging/composing/layouts#attachments
// https://api.slack.com/


// Require module:
var MIT_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

var slack = require('slack-notify')(MIT_SLACK_WEBHOOK_URL);

// Bundled notification types:

// slack.bug('Something bad happened!'); // Posts to #bugs by default
// slack.success('Something good happened!'); // Posts to #alerts by default
// slack.alert('Something important happened!'); // Posts to #alerts by default
// slack.note('Here is a note.'); // Posts to #alerts by default

// Send custom fields which are nicely displayed by the Slack client:

// slack.alert({
//   text: 'Current server stats',
//   fields: {
//     'CPU usage': '7.51%',
//     'Memory usage': '254mb'
//   }
// });

// // The `fields` object is custom shorthand for the `attachments` array:

// slack.alert({
//   text: 'Current server stats',
//   attachments: [
//     {
//       fallback: 'Required Fallback String',
//       fields: [
//         { title: 'CPU usage', value: '7.51%', short: true },
//         { title: 'Memory usage', value: '254mb', short: true }
//       ]
//     }
//   ]
// });

// // Everything is overridable:

// slack.send({
//   channel: '#myCustomChannelName',
//   icon_url: 'http://example.com/my-icon.png',
//   text: 'Here is my notification',
//   unfurl_links: 1,
//   username: 'Jimmy'
// });

// // Roll your own notification type:
// var statLog = slack.extend({
//   channel: '#statistics',
//   icon_emoji: ':computer:',
//   username: 'Statistics'
// });

// statLog({
//   text: 'Current server statistics',
//   fields: {
//     'CPU usage': '7.51%',
//     'Memory usage': '254mb'
//   }
// });

// // Callbacks and a generic onError function are supported:

var msg3={
    channel: '#web-app',
    icon_url: 'http://example.com/my-icon.png',
    text: 'Here is my notification',
    unfurl_links: 1,
    username: 'Jimmy'
  }

var msg2 = {
  channel: '#mit',
  text: 'Current server statistics',
  fields: {
    'CPU usage': '7.51%',
    'Memory usage': '254mb'
  }
}

// msg_buttons
var msg ={
  channel: '#mit',
    "text": "Would you like to play a game?",
  "attachments": [
      {
          "text": "Choose a game to play",
          "fallback": "You are unable to choose a game",
          "callback_id": "wopr_game",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
              {
                  "name": "game",
                  "text": "Chess",
                  "type": "button",
                  "value": "chess"
              },
              {
                  "name": "game",
                  "text": "Falken's Maze",
                  "type": "button",
                  "value": "maze"
              },
              {
                  "name": "game",
                  "text": "Thermonuclear War",
                  "style": "danger",
                  "type": "button",
                  "value": "war",
                  "confirm": {
                      "title": "Are you sure?",
                      "text": "Wouldn't you prefer a good game of chess?",
                      "ok_text": "Yes",
                      "dismiss_text": "No"
                  }
              }
          ]
      }
  ]
}
/**
 * alert
 * success
 * bug
 * note
 * send
 * / */
// slack.note(msg3, function (err) {

//     if (err) {
//       console.log('API error:', err);
//     } else {
//       console.log('Message received!');
//     }

// });

// slack.send({
//   channel: '#web-app',
//   icon_url: 'http://example.com/my-icon.png',
//   text: 'Here is my notification',
//   unfurl_links: 1,
//   username: 'Jimmy'
// });

// slack.onError = function (err) {
//   console.log('API error:', err);
// };

//  Create Slack API

function sendSlack(msg){

  return new Promise(function(resolve, reject) {

    slack.note(msg, function (err) {

      if (err) {
       console.log('API error:', err);
       reject({code:1,msg:err});
     } else {
       console.log('Message received!');
       resolve({code:0,msg:'Message received!'});
     }
 });

  });

}


exports.slackMsg=() =>{

  sendSlack(msg).then((rs)=>{
    // Send Slack msg successful
  },err=>{
    log.err('Slack msg error')
  });
}

exports.slackmsgAPI = (req, res, next) => {

  sendSlack(msg).then((rs)=>{
    res.status(200).json({
      code:0,
      message:  "Successfully!",

    });
  },err=>{

    res.status(200).json({
      code:1,
      message:  err,

    });

  })



}
