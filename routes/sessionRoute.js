const express = require('express');
const router = express.Router();

// CLOUDINARY
const { storage } = require('../cloudinary')
// help us with parsing the multipart/form-data
// primarily used to upload files
const multer = require('multer')
const upload = multer( {storage} )

// Error handlers
const catchAsyncError = require('../utilities/catchAsyncError');

// CONTROLLERS
const session = require('../controllers/session')

// Middleware validation
const { isLoggedIn, validateSession } = require('../utilities/middleware');

router.route('/')
    .get(isLoggedIn, catchAsyncError(session.renderAllSessions))
    // THIS NEED TO BE FIXED first validate then upload the image
    .post(isLoggedIn, upload.array('image'), validateSession, catchAsyncError(session.saveSession));

// RENDER new form
router.get('/new/:coordinates?', isLoggedIn, session.renderForm);

router.route('/:id')
    .get(isLoggedIn, catchAsyncError(session.getSession))
    .put(isLoggedIn, upload.array('image'), validateSession, catchAsyncError(session.updateSession))
    .delete(isLoggedIn, catchAsyncError(session.deleteSession));

// EDIT specific session
// RENDER form with prepopulated inputs
router.get('/:id/edit', isLoggedIn, catchAsyncError(session.renderEditForm));

router.put('/:id/image/:imgId', isLoggedIn, catchAsyncError(session.deleteImage));

module.exports = router;