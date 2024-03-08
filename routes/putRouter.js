const express = require('express');
const { uploadPhoto, resizePhoto, deletePhoto, fetchObjectsByBucketId, createBucket, fetchBuckets, fetchObjectById, deleteBucket } = require('../controller');

const putRouter = express.Router();

putRouter.route('/').post(uploadPhoto, resizePhoto);
putRouter.route('/delete').delete(deletePhoto);
putRouter.route('/fetch').post(fetchObjectsByBucketId);
putRouter.route('/create').post(createBucket);
putRouter.route('/fetchBuckets').get(fetchBuckets);
putRouter.route('/fetchObject').post(fetchObjectById);
putRouter.route('/deleteBucket').delete(deleteBucket);

module.exports = putRouter;