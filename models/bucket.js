const mongoose = require('mongoose')

const bucketSchema = new mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    name : String,
    bucketId : String,
    objects : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Object'
    }]
},
{
    toJSON : {virtuals : true},
    toObject : { virtuals : true}
})

bucketSchema.index({title: 1})




const bucket = mongoose.model('Bucket', bucketSchema);

module.exports = bucket;