var textMessage = {
  recipient: {
    id: ""
  },
  message: {
    text: ""
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
