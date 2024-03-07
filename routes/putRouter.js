const express = require('express');
const { uploadPhoto, resizePhoto, deletePhoto, fetchObjectsByBucketId, createBucket, fetchBuckets, fetchObjectById } = require('../controller');

const putRouter = express.Router();

putRouter.route('/').post(uploadPhoto, resizePhoto);
putRouter.route('/delete').delete(deletePhoto);
putRouter.route('/fetch').post(fetchObjectsByBucketId);
putRouter.route('/create').post(createBucket);
putRouter.route('/fetchBuckets').get(fetchBuckets);
putRouter.route('/fetchObject').post(fetchObjectById);

module.exports = putRouter;