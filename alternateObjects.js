const SERVER_URL = "https://desolate-meadow-32257.herokuapp.com"

function ObjPhotoButtonMessage(id, title, subtitle, img, btnTitle){
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
                  payload: title
                }]
              }]
            }
          }
        }
      };
}

exports.PhotoButtonMessage = ObjPhotoButtonMessage;
