const mongoose = require('mongoose');

const Post = mongoose.model('Post', {
    title: {
        type: String
    },

    content: {
        type: String
    },
    imagePath: { 
        type: String
        },
    
    postDate: {
            type: String
        },

        creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});


module.exports = Post