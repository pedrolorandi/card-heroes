const { query } = require('express');
const express = require('express');
const router  = express.Router();
const messageQueries = require('../db/queries/message');
const cardMessageQueries = require('../db/queries/cardMessages');
const userQueries = require('../db/queries/user');

router.get('/:id', (req, res) => {
  const messageID = req.params.id;
  const templateVars = {};

  const queryArr = [ messageQueries.getMessage(messageID) ];

  Promise.all(queryArr).then((values) => {
    senderID = values[0][0].sender_id;
    receiverID = values[0][0].receiver_id;
    cardID = values[0][0].card_id;

    Promise.all([ cardMessageQueries.getCardMessage(senderID, receiverID, cardID)])
    .then(messageInfo => {
      const messages = messageInfo[0]

      const userQueriesArr = messages.map(message => {
        return Promise.all([
          userQueries.getUser(message.sender_id),
          userQueries.getUser(message.receiver_id)
        ]).then(([ sender, receiver ]) => {
          return {
              id: message.id,
              sender_id: 5,
              sender: sender,
              receiver_id: 1,
              receiver: receiver,
              card_id: message.card_id,
              timestamp: message.timestamp,
              message: message.message
            };
          });
        });

      Promise.all(userQueriesArr)
      .then((result) => {
        templateVars.messages = result;
        res.render('ch_message', templateVars);
      });
    })
  });
});

module.exports = router;
