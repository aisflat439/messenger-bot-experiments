const SERVER_URL = "https://desolate-meadow-32257.herokuapp.com"

function ObjTextMessage(id, text) {
  this.messageData = {
    recipient: {
      id: id
    },
    message: {
      text: text
    }
  }
}

function ObjPhotoButtonMessage(id, title, subtitle){
    this.messageData = {
      recipient: {
        id: id
      },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: title,
                subtitle: subtitle,
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
      };
}

// function photoButtonMessage(recipient){
//   this.recipient = recipient;
//   this.title = "OMG DOGGO!";
//   this.subtitle = "Here is my dog";
//   this.image_url = "https://desolate-meadow-32257.herokuapp.com/assets/ready.jpg";
//
//   this.messageData = {
//     recipient: {
//       id: recipientId
//     },
  //   message: {
  //     attachment: {
  //       type: "template",
  //       payload: {
  //         template_type: "generic",
  //         elements: [{
  //           title: "OMG DOGGO!",
  //           subtitle: "Here is my dog",
  //           image_url: SERVER_URL + "/pup.jpg",
  //           buttons: [{
  //             type: "postback",
  //             title: "Triggers a Postback",
  //             payload: "Puppers Pic!!!!"
  //           }]
  //         }]
  //       }
  //     }
  //   }
  // };

  // this.messageData function () {sets messagedata.message.attachment.payload.title = }
// }


// exports.photoButtonMessage = photoButtonMessage;
exports.ObjTextMessage = ObjTextMessage;
exports.ObjPhotoButtonMessage = ObjPhotoButtonMessage;
