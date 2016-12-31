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
        altObjectReply(senderID);
        break;

      case 'Button':
        buttonReply(senderID);
        break;

      case 'hello':
        sendHelloWorld(senderID);
        break;

      case 'Toots':
        sendToots(senderID);
        break;

      case 'Test':
        sendButtonTest(senderID);
        break;

      case 'Joey':
        aboutJoey(senderID);
        break;

      case 'Tuna':
        aboutTuna(senderID);
        break;

      case 'Seven':
        receivedMessageFunctions.aboutSeven(senderID);
        break;

      case 'Puppers':
        // sendTestButton(senderID);
        p = new alternateObjects.photoButtonMessage();
        console.log(p.messageData);
        break;

      default:
        sendDefaultButton(senderID);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

exports.receivedMessageFunctions = receivedMessage
