const SERVER_URL = "https://desolate-meadow-32257.herokuapp.com"

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

exports.PhotoButtonMessage = ObjPhotoButtonMessage;
