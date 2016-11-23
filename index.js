const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

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

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var postback = event.postback

  if (postback){

    switch (postback) {
      case 'dogs':
        sendDogs(senderID);
        break;

      case 'shortcuts':
        sendShortcuts(senderID);
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

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'Button':
        buttonReply(senderID);
        break;

      case 'hello':
        sendHelloWorld(senderID);
        break;

      case 'Toots':
        sendToots(senderID);
        break;

      case 'Dog':
        sendDog(senderID);
        break;

      case 'Test':
        sendTestButton(senderID);
        break;

      default:
        sendDefaultButton(senderID);
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}


function sendDogs(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Great! Let's see some dogs"
    }
  };

  callSendAPI(messageData);
}
}

function sendShortcuts(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Great! Let's practice some shortcuts"
    }
  };

  callSendAPI(messageData);
}

function sendAdventure(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Adventure time!"
    }
  };

  callSendAPI(messageData);
}
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
          text: "Hi! What should we work on?",
          buttons:[{
            type: "postback",
            title: "See my dogs",
            payload: "dogs"
          }, {
            type: "postback",
            title: "Learn some Atom shortcuts",
            payload: "shortcuts"
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

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function sendDog(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/dog.jpg"
        }
      }
    }
  };

  callSendAPI(messageData);
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
          text: "Here is the header",
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

function sendToots(recipientId){
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: "Magoots"
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
