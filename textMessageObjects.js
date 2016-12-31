function TextMessage(id, text) {
  this.message = {
    recipient: {
      id: id
    },
    message: {
      text: text
    }
  }
}

exports.TextMessage = TextMessage;
