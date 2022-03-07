const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('upload', 'upload/w_400')
})
imageSchema.virtual('imgToDelete').get(function() {
    return this.filename.split('/').pop();
})


// Mongoose virtuals are not part of result object by default
// virtuals are not included when you convert document to JSON
// to include res.json() set toJSON schema option to { virtuals: true }
const opts = { toJSON: { virtuals: true } };

const SessionSchema = new Schema({
    title: String,
    user: String,   // or Rider  //
    duration: Number,
    location: String,
    description: String,
    rating: Number,
    images: [imageSchema],
    // Mapbox data
    geometry: {
        type: {
            type: String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    // Creation date
    dateObj: Date,
    created_at: String,
    numOfDaysCreated: Number
}, opts);

SessionSchema.virtual('properties.popupMarkup').get(function() {
    let location = this.location
    if ( !(/[a-zA-Z]/g.test(this.location)) ) { // If no letter was found
        location = 'Custom location'
    } else {
        location = this.location;
    }

    return `
    <a href="/sessions/${this._id}" class="popup__title">${this.title}</a>
    <p class="popup__location">${location}</p>
    `
})

// Sets the created_at parameter equal to the current time
SessionSchema.pre('save', function(next){
    this.dateObj = new Date();

    const dateObj = this.dateObj;
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const year = dateObj.getUTCFullYear();

    this.created_at = day + "/" + month + "/" + year;
    next();
});

SessionSchema.post('init', function(){
    const today = new Date();
    this.numOfDaysCreated = Math.floor((today - this.dateObj) / 8.64e7);
});


module.exports = mongoose.model('Training-Session', SessionSchema);