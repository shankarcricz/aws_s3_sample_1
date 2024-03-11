const multer = require('multer')
const sharp = require('sharp')
const crypto = require('crypto')
const fs = require('fs');
const Object = require('../models/objectStorage');
const bucket = require('../models/bucket');
const PDFDocument = require('pdf-lib');

const path = require('path');
const errorHandle = require('./errorHandle');

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

exports.resizePhoto = errorHandle(async (req, res, next) => {
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
    console.log(req.file)


    if (req.file.mimetype === 'application/pdf') {
      // Handle PDF file
      const pdfBuffer = req.file.buffer;
      var fileName = Date.now() + '_' + req.file.originalname;
      
      // Write the PDF buffer to a file on the filesystem
      fs.writeFileSync(path.join(`public/images/${req.body.bucket}`, fileName), pdfBuffer);
  
      
    } else {
      sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat(`${req.file.mimetype.split('/')[1]}`)
    .toFile(`./public/images/${req.body.bucket}/${req.file.filename}`);

    }

    if(req.file.mimetype == 'application/pdf') {
      var object = await Object.create({
        photo : `${req.body.bucket}/${fileName}`,
        id : req.file.filename,
        bucketId : req.body.bucket 
      })
    } else {
      var object = await Object.create({
        photo : `${req.body.bucket}/${req.file.filename}`,
        id : req.file.filename,
        bucketId : req.body.bucket 
      })
    }
  

  let bt = await bucket.find({name : req.body.bucket});
  console.log(bt);
  bt[0]?.objects.push(object._id);
  await bt[0]?.save({validateBeforeSave : false});
  // const bt = await bucket.find({name : req.body.bucket}).populate('objects').populate({path : 'Object', select : '_id'})
  if(req.file.mimetype == 'application/pdf') {
    res.json(`public/images/${req.body.bucket}/${req.file.filename}`);
  } else {
  res.json({
    data: 'success',
    object : object
  }) }
  next();
});

exports.uploadPhoto = upload.single("photo");




exports.deleteBucket = errorHandle(async (req, res, next) => {
  console.log(req.body)
    const deletedBucket = await bucket.deleteOne({name : req.body.bucketId});
    const objs = await Object.deleteMany({bucketId : req.body.bucketId});
    console.log('Directory deleted successfully.');
    res.json({
      status : 'success',
      deletedBucket
    });
});

exports.deletePhoto = errorHandle(async (req, res, next) => {
  console.log(req.body)

  const object = await Object.findByIdAndDelete(req.body.obj_id);
  // const buc = await bucket.find({name : object?.bucketId});
  console.log(object)
  fs.unlink(`./public/images/${object?.photo}`, (err) => {  //need bucket id as well
    if(err) {
      res.json({
        data: 'error'
      })
      return;
    }
    res.json({
      data: 'success',
      object : object
    })
  })
})

exports.fetchObjectById = errorHandle(async(req, res, next) => {
  console.log(req.body)
  const obj = await Object.findById(req.body.obj_id)
  if(obj?.id?.endsWith('pdf')) {
    // const filePath = path.join(__dirname.slice(0,28), `public/images/${obj?.photo}`); // Replace with your actual path
    // console.log(filePath)
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.sendFile(filePath, (err) => {
  //     if (err) {
  //         console.error(err);
  //         res.status(500).send('Error downloading PDF');
  //     } else {
  //         console.log('PDF downloaded successfully');
  //     }
  // });
  res.json({
    status: 'succes',
    url : `public/images/${obj?.photo}`
  })
  } else {
  res.json({
    status : 'success',
    object : obj
  })}
})

exports.createBucket = errorHandle( async (req, res, next) => {
  const buck = await bucket.find();
  const bool = await bucket.find({name : `b-${buck.length+1}`}) 
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
});

exports.fetchBuckets = errorHandle(async (req, res, next) => {
 const buckets = await bucket.find();
 res.json({
  status : 'success',
  buckets : buckets
 })
});

exports.fetchObjectsByBucketId = errorHandle(async (req, res, next) => {
 const objects = await Object.find({bucketId : req.body.b_id});
 console.log(objects, '-----')
 
 res.json(
  {
    objects : objects,
    status : 'success'
  }
 )

});

