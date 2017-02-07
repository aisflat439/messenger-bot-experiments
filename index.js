const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

require('console.table');

const baseObjects       = require('./baseObjects.js');
const alternateObjects  = require('./alternateObjects.js');
const button            = require('./buttonObjects.js');
const text              = require('./textMessageObjects.js');
const image             = require('./photoMessageObjects.js');

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN
const phone_number = process.env.PHONE_NUMBER
const SERVER_URL = process.env.SERVER_URL

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
  // console.log("-----------Something happened------------");
  // console.log(event.postback);
  // console.log("-----------postback------------");
  // console.log(typeof(event.postback));
  console.log(event);
  console.table(event);

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var postback = event.postback

  if  (postback){

    switch (postback.payload) {

      case 'dogs':
        title = "Joey";
        subtitle = "This is Joey. She is a Cairn Terrier, like Toto from the Wizard of Oz.";
        img = "/joey_.jpg";
        btnTitle = "Ready for Tuna?";
        payload = "dogs-one";
        p = new alternateObjects.PhotoButtonMessage(senderID, title, subtitle, img, btnTitle, payload);
        callSendAPI(p.messageData);
        break;

      case 'dogs-one':
        title = "Tuna";
        subtitle = "Here is Tuna. He's probably a Jack Russel and Bichon mix. He's a lot of fun.";
        img = "/tuna_.jpg";
        btnTitle = "Okay!";
        payload = "dogs-two";
        p = new alternateObjects.PhotoButtonMessage(senderID, title, subtitle, img, btnTitle, payload);
        callSendAPI(p.messageData);
        break;

      case 'dogs-two':
        title = "Seven";
        subtitle = "Seven spent her first 5 years as a labratory beagle. Now she's 'retired'.";
        img = "/seven_.jpg";
        btnTitle = "Okay!";
        payload = "dogs-happy";
        p = new alternateObjects.PhotoButtonMessage(senderID, title, subtitle, img, btnTitle, payload);
        callSendAPI(p.messageData);
        break;

      case 'dogs-happy':
        botReply = new image.PhotoOnlyMessage(senderID, "/happy_dogs.jpg");
        callSendAPI(botReply.message);
        setTimeout(function(){
          sendDefaultButton(senderID, "What's next?");
        }, 2000);
        break;

      case 'fetch':
        botReply = new text.TextMessage(senderID, "Great! Let me go get my ball");
        callSendAPI(botReply.message);
        botReply = new image.PhotoOnlyMessage(senderID, "/pup.jpg");
        callSendAPI(botReply.message);
        setTimeout(function(){
          btn = new button.PostbackButton("Okay!", "fetch-park");
          botReply = new button.OneButtonMessage(senderID, "Let's go check out the park.", btn);
          callSendAPI(botReply.message);
        }, 2000);
        break;

      case 'adventure':
        botReply = new text.TextMessage(senderID, "We're always ready for an adventure")
        callSendAPI(botReply.message);
        botReply = new image.PhotoOnlyMessage(senderID, "/lets_go.jpg");
        callSendAPI(botReply.message);
        setTimeout(function(){
          msg = "Where we heading to?"
          btn1 = new button.PostbackButton("Into the woods!", "adventure-woods");
          btn2 = new button.PostbackButton("To the snow!", "adventure-snow");
          botReply = new button.TwoButtonMessage(senderID, msg, btn1, btn2);
          callSendAPI(botReply.message);
        }, 2000);
        break;

      case 'fetch-park':
        botReply = new text.TextMessage(senderID, "The park is one of my favorite places. Sometimes I go and play fetch for hours. I've been known to jump to get a ball.");
        callSendAPI(botReply.message);
        botReply = new image.PhotoOnlyMessage(senderID, "/jump.jpg");
        callSendAPI(botReply.message);
        setTimeout(function(){
          btn1 = new button.PostbackButton("Dogs", "dogs");
          btn2 = new button.PostbackButton("Adventure", "adventure");
          botReply = new button.TwoButtonMessage(senderID, "What's next? Meet the dogs or an adventure?", btn1, btn2);
          callSendAPI(botReply.message);
        }, 3000);
        break;

      case 'adventure-snow':
        botReply = new text.TextMessage(senderID, "Here we SNOW!!!");
        callSendAPI(botReply.message);
        img = setPhoto();
        botReply = new image.PhotoOnlyMessage(senderID, img);
        callSendAPI(botReply.message);
        setTimeout(function(){
          msg = "Yikes it's chilly, let's head inside!"
          btn = new button.PostbackButton("Okay", "back-inside");
          botReply = new button.OneButtonMessage(senderID, msg, btn);
          callSendAPI(botReply.message);
        }, 2000);
        break;

      case 'adventure-woods':
        p = new alternateObjects.PhotoButtonMessage(senderID, "Woods", "We love a good woods adventure.", "/woodss.jpg", "Keep going?", "Woods");
        callSendAPI(p.messageData);
        break;

      case 'back-inside':
        botReply = new text.TextMessage(senderID, "Phew, it was cold. Good to get back on the couch.");
        callSendAPI(botReply.message);
        botReply = new image.PhotoOnlyMessage(senderID, "/couch.jpg");
        callSendAPI(botReply.message);
        setTimeout(function(){
          sendDefaultButton(senderID, "What now?");
        }, 2000);
        break;

      case 'payload3':
        botReply = new text.TextMessage(senderID, "You did it 3");
        callSendAPI(botReply.message);
        break;

      case 'Woods':
        botReply = new text.TextMessage(senderID, "Woods are a nice place to visit. We have a few favorite places you should check out.");
        callSendAPI(botReply.message);
        msg = "Learn more:"
        btn1 = new button.UrlButton("Rose Tree Park", "http://www.co.delaware.pa.us/depts/parks/rosetree.html");
        btn2 = new button.UrlButton("Ridley Creek Park", "http://www.dcnr.state.pa.us/stateparks/findapark/ridleycreek/");
        btn3 = new button.UrlButton("Heinz Wildlife Refuge", "https://www.fws.gov/refuge/john_heinz/");
        botReply = new button.ThreeButtonMessage(senderID, msg, btn3, btn2, btn1);
        callSendAPI(botReply.message);
        setTimeout(function(){
          msg = "Ready to meet the dogs?"
          btn = new button.PostbackButton("Okay", "dogs");
          botReply = new button.OneButtonMessage(senderID, msg, btn);
          callSendAPI(botReply.message);
        }, 3000);
        break;

      default:
        botReply = new text.TextMessage(senderID, "SEVENS!!")
        callSendAPI(botReply.message)
        break;
    }
  }
}

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("----msg-----");
  console.table(event.sender);
  console.log("----msg-----");

  // console.log("Received message for user %d and page %d at %d with message:",
  //   senderID, recipientID, timeOfMessage);
  // console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    if (testReplies(messageText)){
      messageText = "setReply"
    }

    switch (messageText) {

      case 'Button':
        buttonReply(senderID);
        break;

      case 'Github':
      case 'github':
        m = 'Here is the link to the github repo for this bot.'
        b1 = new button.UrlButton("Github", "https://github.com/aisflat439/messenger-bot-experiments");
        botReply = new button.TwoButtonMessage(senderID, m, b1);
        callSendAPI(botReply.message);
        break;

      case 'hello':
        message = "Hello World!"
        botReply = new text.TextMessage(senderID, message);
        callSendAPI(botReply.message)
        break;

      case 'setReply':
        message = "I know right? We're super cute."
        botReply = new text.TextMessage(senderID, message);
        callSendAPI(botReply.message)
        break;

      case 'Test':
        m = "second 2 button message!";
        b1 = new button.UrlButton("sample", "https://www.facebook.com");
        b2 = new button.UrlButton("sample", "https://www.facebook.com");
        botReply = new button.TwoButtonMessage(senderID, m, b1, b2);
        callSendAPI(botReply.message);
        break;

      case 'Two':
        m = "Two button message!";
        b1 = new button.PostbackButton("option1", "payload1");
        b2 = new button.PostbackButton("option2", "payload2");
        botReply = new button.TwoButtonMessage(senderID, m, b1, b2)
        callSendAPI(botReply.message);
        break;

      case 'Three':
        m = "Three button message!";
        b1 = new button.PostbackButton("option1", "payload1");
        b2 = new button.PostbackButton("option2", "payload2");
        b3 = new button.PostbackButton("option3", "payload3");
        botReply = new button.ThreeButtonMessage(senderID, m, b1, b2, b3)
        callSendAPI(botReply.message);
        break;

      case 'Photos':
        m = new image.PhotoOnlyMessage(senderID, "/seven.jpg");
        callSendAPI(m.message);
        break;

      case 'Joey':
        message = "Joey is practically perfect in every way. She was the lady's first dog."
        botReply = new text.TextMessage(senderID, message);
        callSendAPI(botReply.message)
        break;

      case 'Tuna':
        message = "That's tuna, he's my buddy. He's super magical. His middle name is Falkor like the dragon from 'The Never Ending Story' because he's also super dragony."
        botReply = new text.TextMessage(senderID, message);
        callSendAPI(botReply.message);
        break;

      case 'Seven':
        message = "Seven is a hilarious monkey with a funny accent. She hails from Glaxonia, home of the Smithkleiniens"
        botReply = new text.TextMessage(senderID, message);
        callSendAPI(botReply.message)
        break;

      case 'Puppers':
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

function sendDefaultButton(recipientId, msg = "Hi, What should we do?") {
  message = "Thanks for checking out my bot. This is an experiment I created to learn about Node.js and conversational UI."
  botReply = new text.TextMessage(recipientId, message);
  callSendAPI(botReply.message);

  setTimeout(function(){
    message = "Type github at any time to see check out the code for this messenger bot."
    botReply = new text.TextMessage(recipientId, message);
    callSendAPI(botReply.message);
  }, 1000);

  setTimeout(function(){
    btn1 = new button.PostbackButton("See my dogs", "dogs");
    btn2 = new button.PostbackButton("Fetch", "fetch");
    btn3 = new button.PostbackButton("Have an adventure", "adventure");

    botReply = new button.ThreeButtonMessage(recipientId, msg, btn1, btn2, btn3);
    callSendAPI(botReply.message)
  }, 2000);
}

function buttonReply(recipientId) {

  msg = "Here's some info about me!"

  btn1 = new button.UrlButton("Follow me on Github!", "https://www.github.com/aisflat439");
  btn2 = new button.PostbackButton("Have an adventure!", "adventure");
  btn3 = new button.CallButton("Call Phone Number", phone_number);

  botReply = new button.ThreeButtonMessage(recipientId, msg, btn1, btn2, btn3);
  callSendAPI(botReply.message);
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

      // console.log("Successfully sent generic message with id %s to recipient %s",
        // messageId, recipientId);
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

function setPhoto(){
  var photo = Math.random() < 0.5 ? "/snow_dog2.jpg" : "/snow_dog.jpg";
  return photo;
}

function testReplies(msg){
  wordsArray = ["Awww", "Cute", "Sweet", "OMG", "cute", "Omg"];
  len = wordsArray.length
  for (var i = 0; i < len; i++){
    if (msg.indexOf(wordsArray[i]) !== -1 ){
      return true;
    }
  }
  return false;
}
