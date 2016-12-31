const SERVER_URL = "https://desolate-meadow-32257.herokuapp.com"

function PhotoOnlyMessage(id, photoURL){
  this.message = {
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

exports.PhotoOnlyMessage    = PhotoOnlyMessage;
