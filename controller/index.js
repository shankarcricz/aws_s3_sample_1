const multer = require('multer')
const sharp = require('sharp')
const crypto = require('crypto')
const fs = require('fs');
const Object = require('../models/objectStorage');
const bucket = require('../models/bucket');


const storageM = multer.memoryStorage();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storageM });

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user?.id || crypto.randomUUID()
    }+${Date.now()}.${req.file.mimetype.split('/')[1]}`;
    console.log(req.file.buffer)
    !(fs.existsSync(`./public/images/${req.body.bucket}`)) &&
    fs.mkdir(`./public/images/${req.body.bucket}`, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return;
      }
      console.log('Directory created successfully');
    });
    
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat(`${req.file.mimetype.split('/')[1]}`)
    .toFile(`./public/images/${req.body.bucket}/${req.file.filename}`);
  const object = await Object.create({
    photo : `${req.body.bucket}/${req.file.filename}`,
    id : req.file.filename,
    bucketId : req.body.bucket 
  })

  let bt = await bucket.find({name : req.body.bucket});
  console.log(bt);
  bt[0].objects.push(object._id);
  await bt[0].save({validateBeforeSave : false});
  // const bt = await bucket.find({name : req.body.bucket}).populate('objects').populate({path : 'Object', select : '_id'})
  res.json({
    data: 'success',
    object : object
  })
  next();
};

exports.uploadPhoto = upload.single("photo");


exports.deletePhoto = (req, res, next) => {
  fs.unlink('./public/images/user-55e011b1-0436-49d3-89eb-b2adb169918f+1709780851549.png', (err) => {
    if(err) {
      res.json({
        data: 'error'
      })
      return;
    }
    res.json({
      data: 'success'
    })
  })
}

exports.fetchObjectById = async(req, res, next) => {
  console.log(req.body)
  const obj = await Object.findById(req.body.obj_id)
  res.json({
    status : 'success',
    object : obj
  })
}

exports.createBucket = async (req, res, next) => {

  const buck = await bucket.find();
  const buckt = await bucket.create({
    name : `b-${buck.length+1}`,
    bucketId : `b`
  })
  !(fs.existsSync(`./public/images/${buck.length+1}`)) &&
    fs.mkdir(`./public/images/b-${buck.length+1}`, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return;
      }
      console.log('Directory created successfully');
    });
   res.json({
    status : 'success',
    bucket : buckt
   })

}

exports.fetchBuckets = async (req, res, next) => {
 const buckets = await bucket.find();
 res.json({
  status : 'success',
  buckets : buckets
 })
}

exports.fetchObjectsByBucketId = async (req, res, next) => {
 const objects = await Object.find({bucketId : req.body.b_id});
 res.json(
  {
    objects : objects,
    status : 'success'
  }
 )

}

