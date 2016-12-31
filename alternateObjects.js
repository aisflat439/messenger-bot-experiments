const SERVER_URL = "https://desolate-meadow-32257.herokuapp.com"

function ObjTextMessage(id, text) {
  this.message = {
    recipient: {
      id: id
    },
    message: {
      text: text
    }
  }
}

function ObjPhotoOnlyMessage(id, photoURL){
  this.messageData = {
    recipient: {
      id: id
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + photoURL
        }
      }
    }
  };
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

function ObjTwoButtonMessage(id, message, choiceOne, choiceTwo){
  this.message = {
    recipient: {
      id: id
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: message,
          buttons:[{
            title: choiceOne,
            type: "web_url",
            url: "https://www.github.com/aisflat439",
          }, {
            title: choiceTwo,
            type: "phone_number",
            payload: "+16505551234",
          }]
        }
      }
    }
  };
}
//
function ObjThreeButtonMessage(id, message, choiceOne, choiceTwo, choiceThree){
  this.message = {
    recipient: {
      id: id
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
            title: choiceOne
          }, {
            type: "postback",
            title: choiceTwo,
            payload: "DEVELOPER_DEFINED_PAYLOAD"
          }, {
            type: "phone_number",
            title: choiceThree,
            payload: "+16505551234"
          }]
        }
      }
    }
  };
}

exports.TextMessage = ObjTextMessage;
exports.TwoButtonMessage = ObjTwoButtonMessage;
exports.ThreeButtonMessage = ObjThreeButtonMessage;
exports.PhotoOnlyMessage = ObjPhotoOnlyMessage;
exports.PhotoButtonMessage = ObjPhotoButtonMessage;
