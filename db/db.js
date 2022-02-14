const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = "mongodb+srv://dev:devtest@cluster0.quj8h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//const url = "mongodb://localhost:27017/blogpost";   
// Connect MongoDB at default port 27017.
let mong = mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});