function AltObjTwoButtonMessage(id, message, buttonOne, buttonTwo){
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
          buttons:[
            buttonOne.fields,
            buttonTwo.fields
          ]
        }
      }
    }
  };
}

function UrlButton(title, url){
  this.fields = {
    title: title,
    type: "web_url",
    url: url
  };
}

function PostbackButton(title, postback){
  this.fields = {
    title: title,
    type: "postback",
    payload: postback
  };
}

function CallButton(title, phone_number){
  this.fields = {
    title: title,
    type: "phone_number",
    payload: "+1" + phone_number
  };
}

function ShareButton(){
  this.fields = {
    type: "element_share"
  };
}


exports.urlButton = UrlButton;
exports.postbackButton = PostbackButton;
exports.callButton = CallButton;
exports.shareButton = ShareButton;
exports.testButton = AltObjTwoButtonMessage;