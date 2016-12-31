const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const baseObjects = require('./baseObjects.js');
const alternateObjects = require('./alternateObjects.js');

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

const SERVER_URL = "https://desolate-meadow-32257.herokuapp.com"

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.send('OMGGMO')
})

app.get('/assets', function(){
  console.log("Works");
})

app.use(express.static('assets'))

app.get('/webhook/', function(req, res){
  if(req.query['hub.verify_token'] === token){
      res.send(req.query['hub.challenge'])
    }
  res.send('No entry')
})

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback){
          evaluatePostback(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function evaluatePostback(event){
  console.log("-----------Something happened------------");
  console.log(event.postback);
  console.log("-----------postback------------");
  console.log(typeof(event.postback));

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var postback = event.postback

  if  (postback){

    switch (postback.payload) {
      case 'dogs':
        sendJoeyPhoto(senderID);
        break;

      case 'fetch':
        sendFetch(senderID);
        break;

      case 'adventure':
        sendAdventure(senderID);
        break;

      default:
        sendSeven(senderID);
        break;
    }
  }
}

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    switch (messageText) {
      case 'OMG':
        message = "GMO";
        botReply = new alternateObjects.TextMessage(senderID, message);
        callSendAPI(botReply.message);
        break;

      case 'Button':
        buttonReply(senderID);
        break;

      case 'hello':
        sendHelloWorld(senderID);
        break;

      case 'Two':
        m = "Two button message!";
        bOne = "First Button";
        bTwo = "Secon Button";
        botReply = new alternateObjects.TwoButtonMessage(senderID, message, bOne, bTwo)
        callSendAPI(botReply.message);
        break;

      case 'Photos':
        m = new alternateObjects.PhotoOnlyMessage(senderID, "/seven.jpg");
        callSendAPI(m.messageData);
        break;

      case 'Joey':
        message = "Joey is practically perfect in every way. She was the lady's first dog."
        botReply = new alternateObjects.TextMessage(senderID, message)
        callSendAPI(botReply.message)
        break;

      case 'Tuna':
        message = "That's tuna, he's my buddy. He's super magical. His middle name is Falkor like the dragon from 'The Never Ending Story' because he's also super dragony."
        botReply = new alternateObjects.TextMessage(senderID, message);
        callSendAPI(botReply.message);
        break;

      case 'Seven':
        message = "Seven is a hilarious monkey with a funny accent. She hails from Glaxonia, home of the Smithkleiniens"
        botReply = new alternateObjects.TextMessage(senderID, message)
        callSendAPI(botReply.message)
        break;

      case 'Puppers':
        // sendTestButton(senderID);
        p = new alternateObjects.PhotoButtonMessage(senderID, "Here", "It words");
        console.log(p.messageData);
        callSendAPI(p.messageData);
        break;

      default:
        sendDefaultButton(senderID);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendButtonTest(recipientId){
  var messageData = baseObjects.threeButtonMessage;
  messageData.recipient.id = recipientId;
  messageData.message.attachment.payload.text = "Cool! lets do that!";
  messageData.message.attachment.payload.buttons[0].title = "I'm a longer title";
  messageData.message.attachment.payload.buttons[0].payload = "oneeeee";
  messageData.message.attachment.payload.buttons[1].title = "Continuing longer test";
  messageData.message.attachment.payload.buttons[1].payload = "gmo";
  messageData.message.attachment.payload.buttons[2].title = "Test";
  messageData.message.attachment.payload.buttons[2].payload = "three";

  callSendAPI(messageData);
}

function sendFetch(recipientId) {
  var messageData = baseObjects.photoMessage;
  messageData.recipient.id = recipientId;
  messageData.message.attachment.payload.url = SERVER_URL + "/pup.jpg";

  callSendAPI(messageData);
}

function sendAdventure(recipientId){
  var messageData = baseObjects.photoMessage;
  messageData.recipientId = recipientId;
  messageData.message.attachment.payload.url = SERVER_URL + "/ready.jpg"

  callSendAPI(messageData);
}

function sendDefaultButton(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Hi! What should we do?",
          buttons:[{
            type: "postback",
            title: "See my dogs",
            payload: "dogs"
          }, {
            type: "postback",
            title: "Fetch",
            payload: "fetch"
          }, {
            type: "postback",
            title: "Have an adventure",
            payload: "adventure"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendTestButton(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "OMG DOGGO!",
            subtitle: "Here is my dog",
            image_url: SERVER_URL + "/pup.jpg",
            buttons: [{
              type: "postback",
              title: "Triggers a Postback",
              payload: "Puppers Pic!!!!"
            }]
          }]
        }
      }
    }
  }
  callSendAPI(messageData);
}

function sendTunaPhoto(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/tuna.jpg"
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendJoeyPhoto(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/joey.jpg"
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendSevenPhoto(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/seven.jpg"
        }
      }
    }
  };

  callSendAPI(messageData);
}

function altObjectReply(recipientId){
  r = new alternateObjects.TextMessage(recipientId, "GMO");
  callSendAPI(r.message);
}

function buttonReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Here's some info about me.",
          buttons:[{
            type: "web_url",
            url: "https://www.github.com/aisflat439",
            title: "Follow me on Github!"
          }, {
            type: "postback",
            title: "Trigger Postback",
            payload: "DEVELOPER_DEFINED_PAYLOAD"
          }, {
            type: "phone_number",
            title: "Call Phone Number",
            payload: "+16505551234"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendHelloWorld(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Hello World!"
    }
  };

  callSendAPI(messageData);
}

function sendSeven(recipientId){
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: "SEVENS!"
      }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: access },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
})
