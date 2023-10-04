const mongoose = require('mongoose');
const {Schema} = mongoose;

const LocationSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String, 
    address: String, 
    photos: [String], 
    description: String, 
    features: [String],
    extraInfo: String, 
    checkIn: Number, 
    checkOut: Number, 
    maxGuests: Number,
    price: Number
});

const LocationModel = mongoose.model('Location', LocationSchema);

module.exports = LocationModel;