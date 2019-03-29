const Mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(Mongoose);
const Config = require('../Config');
const Schema = Mongoose.Schema;

const Restaurant = new Schema({
  restaurantName: {type: String, trim: true, index: true, default: null, sparse: true},
  restaurantNumber: {type: Number, unique: true, sparse: true},
  firstName: {type: String, trim: true, index: true, default: null, sparse: true},
  LastName: {type: String, trim: true, index: true, default: null, sparse: true},
  email: {type: String,unique : true,trim: true,index: true, required: true,sparse: true},
  phoneNo: {type: String, required: true, trim: true, index: true,min: 5, max: 15},
  phoneVerified:{type: Boolean, default: false},
  isBlock: {type: Boolean, default: false},
  deviceType: {
    type: String, enum: [
        Config.APP_CONSTANTS.DEVICE_TYPES.IOS,
        Config.APP_CONSTANTS.DEVICE_TYPES.ANDROID,
        Config.APP_CONSTANTS.DEVICE_TYPES.WEB,
    ]
  },
  location: {
        type: {type: String, enum: "Point", default: "Point"},
        coordinates: {type: [Number]}
  },
  deliveryServiceArea: {
        'type': {type: String, enum: "Polygon", default: "Polygon"},//LineString //Polygon
        coordinates: {type:Array}
  },
  profilePicURL: {
        original: {type: String, default: null},
        thumbnail: {type: String, default: null}
  },
  passwordResetToken: {type: String, trim: true,index: true, sparse: true},
  phoneVerified:{type: Boolean, default: false},
  address: {type: String, trim: true, index: true, default: null, sparse: true},
  countryCode: {type: String, trim: true, min:2, max:5},
  deviceToken: {type: String, trim: true, index: true, unique: true, sparse: true},
  accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
  password: {type: String, trim: true},
  createdAt: {type: Date, default: Date.now,required: true},
  updatedAt: {type: Date, default: Date.now,required: true},

});
Restaurant.index({'location': "2dsphere"});
Restaurant.index({email: 1, restaurantName: 1}, {unique: true});
Restaurant.plugin(AutoIncrement, {inc_field: 'restaurantNumber'});
module.exports = Mongoose.model('restaurants', Restaurant);