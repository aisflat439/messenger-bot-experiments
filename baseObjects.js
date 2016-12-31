
var textMessage = {
  recipient: {
    id: ""
  },
  message: {
    text: ""
  }
};

var photoMessage = {
  recipient: {
    id: ""
  },
  message: {
    attachment: {
      type: "image",
      payload: {
        url: ""
      }
    }
  }
};

var threeButtonMessage = {
  recipient: {
    id: ""
  },
  message: {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "",
        buttons:[{
          type: "postback",
          title: "",
          payload: ""
        }, {
          type: "postback",
          title: "",
          payload: ""
        }, {
          type: "postback",
          title: "",
          payload: ""
        }]
      }
    }
  }
};

exports.textMessage = textMessage;
exports.threeButtonMessage = threeButtonMessage;
exports.photoMessage = photoMessage;
