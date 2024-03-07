const mongoose = require('mongoose')

const objectSchema = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    photo : String,
    id : String,
    bucketId : String
},
{
    toJSON : {virtuals : true},
    toObject : { virtuals : true}
})

objectSchema.index({title: 1})




const Object = mongoose.model('Object', objectSchema);

module.exports = Object;