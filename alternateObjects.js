const SERVER_URL = process.env.SERVER_URL

function ObjPhotoButtonMessage(id, title, subtitle, img, btnTitle, payload){
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
                image_url: SERVER_URL + img,
                buttons: [{
                  type: "postback",
                  title: btnTitle,
                  payload: payload
                }]
              }]
            }
          }
        }
      };
}

exports.PhotoButtonMessage = ObjPhotoButtonMessage;
