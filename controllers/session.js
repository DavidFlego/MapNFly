// MODEL
const Session = require('../models/session');
const User = require('../models/user');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require('../cloudinary/index')

module.exports.renderAllSessions = async (req, res) => {
    const user = await User.findById(req.user._id).populate('sessions');
    res.render('sessions/index', { user });
}

module.exports.renderForm = async (req, res) => {
    const user = await User.findById(req.user._id)
    const coordinates = req.params.coordinates;
    let location;
    if (coordinates) {
        location = coordinates.split('(').pop().split(')')[0];
    }
    res.render('sessions/new', { user, rating: 0, location });
}

module.exports.saveSession = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.session.location,
        limit: 1
    }).send();
    const user = await User.findById(req.user._id)
    const session = new Session(req.body.session);
    session.geometry = geoData.body.features[0].geometry;
    session.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    user.sessions.push(session)
    await session.save();
    await user.save();
    req.flash('successSession', 'Cool, session was saved!!!');
    res.redirect(`/sessions/${session._id}`);
}


module.exports.getSession = async (req, res) => {
    const user = await User.findById(req.user._id)
    const session = await Session.findById(req.params.id).populate();
    if ( !user.sessions ) {
        req.flash('errorSession', 'Sorry, cannot find that session!')
        return res.redirect('/sessions')
    }
    
    console.log(session)
    
    res.render('sessions/show', { session, rating: session.rating });
}

module.exports.renderEditForm = async (req, res) => {
    const user = await User.findById(req.user._id)
    const session = await Session.findById(req.params.id);
    if ( !session ) {
        req.flash('errorSession', 'Sorry, cannot find that session!')
        return res.redirect('/sessions')
    }
    res.render('sessions/edit', { user, session, rating: session.rating });
}

module.exports.updateSession = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.session.location,
        limit: 1
    }).send();
    const updatedSession = await Session.findByIdAndUpdate(req.params.id,
        { ...req.body.session },
        { useFindAndModify: false, new: true }); // {new: true} returns updated object
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    updatedSession.images.push(...imgs);
    updatedSession.geometry = geoData.body.features[0].geometry;
    await updatedSession.save();
    console.log(req.files)
    req.flash('successSession', 'Session successfully updated!');
    res.redirect(`/sessions/${updatedSession._id}`);
}

module.exports.deleteSession = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, 
        { $pull: { sessions: id } },
        { useFindAndModify: false, new: true })
    await Session.findByIdAndDelete(id);
    req.flash('successSession', 'Session successfully deleted!');
    res.redirect('/sessions');
}

module.exports.deleteImage = async (req, res) => {
    const { id, imgId } = req.params;
    
    // await cloudinary.uploader.destroy(imgId, function(err, result) { console.log(result, err) });

    const updatedSession = await Session.findByIdAndUpdate(id,
        { $pull: { images: {filename: {$eq: `MapNFly/${imgId}`} } } },
        { useFindAndModify: false, new: true })
    req.flash('successSession', 'Image successfully deleted!');
    res.redirect(`/sessions/${updatedSession._id}/edit`)
}