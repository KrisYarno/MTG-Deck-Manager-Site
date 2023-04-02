const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
    name: {
     type: String,
     required: true,
    },
    commander: {
    type: String,
    required: true,
    },
    deckList: [
        {
        type: String,
        },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
});

module.exports = mongoose.model('Deck', DeckSchema);
