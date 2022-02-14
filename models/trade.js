const mongoose = require('mongoose');

const Trade = mongoose.model('Trade', {
    stockName: {
        type: String
    },

    price: {
        type: String
    },
    quantity: { 
        type: String
        },
    
    tradeDate: {
            type: String
        },

        creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});


module.exports = Trade