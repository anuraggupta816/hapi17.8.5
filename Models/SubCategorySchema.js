const Mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(Mongoose);
const Config = require('../Config');
const Schema = Mongoose.Schema;

const SubCategory = new Schema({
  categoryName: {type: String, lowercase: true, trim: true},
  restaurant: {type: Schema.ObjectId, ref: 'restaurants'},
  category: {type: Schema.ObjectId, ref: 'category'},
  categoryNumber: {type: Number, unique: true, sparse: true},
  isDeleted: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now,required: true},
  updatedAt: {type: Date, default: Date.now,required: true},

});
SubCategory.plugin(AutoIncrement, {inc_field: 'subCategoryNumber'});
SubCategory.index({categoryName: 1, category:1,restaurant: 1}, {unique: true});
module.exports = Mongoose.model('subcategory', SubCategory);