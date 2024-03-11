const express = require('express');
const { uploadPhoto, resizePhoto, deletePhoto, fetchObjectsByBucketId, createBucket, fetchBuckets, fetchObjectById, deleteBucket } = require('../controller');

const Objectrouter = express.Router();

Objectrouter.route('/').post(uploadPhoto, resizePhoto);
Objectrouter.route('/delete').post(deletePhoto);
Objectrouter.route('/fetch').post(fetchObjectsByBucketId);
Objectrouter.route('/create').post(createBucket);
Objectrouter.route('/fetchBuckets').get(fetchBuckets);
Objectrouter.route('/fetchObject').post(fetchObjectById);
Objectrouter.route('/deleteBucket').post(deleteBucket);

module.exports = Objectrouter;