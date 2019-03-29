'use strict';

const Models = require('../Models');
const Config = require('../Config');
const APP_CONSTANTS   =  Config.APP_CONSTANTS;
const STATUS_MSG      =  APP_CONSTANTS.STATUS_MSG

//Get Users from DB
var getRestaurant = function (criteria, projection, options, callback) {
    Models.Restaurant.find(criteria, projection, options, callback);
};

//Insert User in DB
var createRestaurant = function (objToSave, callback) {
    new Models.Restaurant(objToSave).save((err,result)=>{
        if(err) { console.log("errr",err.errmsg);
            if (11000 === err.code || 11001 === err.code) { //console.log();
                if(err.errmsg.indexOf("email_1_restaurantName_1")>-1) return  callback(STATUS_MSG.ERROR.RESTAURANT_NAME_EXISTS);//str.indexOf("welcome");
                if(err.errmsg.indexOf("email_1")>-1) return  callback(STATUS_MSG.ERROR.EMAIL_EXISTS);
            }else{
                return callback(err);
            }
        }else{
            return callback(null,result);
        }
    })
};

//Update User in DB
var updateRestaurant = function (criteria, dataToSet, options, callback) {
    Models.Restaurant.findOneAndUpdate(criteria, dataToSet, options, (err,result)=>{
        if(err) { 
            if (11000 === err.code || 11001 === err.code) { //console.log();
                if(err.errmsg.indexOf("email_1_restaurantName_1")>-1) return  callback(STATUS_MSG.ERROR.RESTAURANT_NAME_EXISTS);//str.indexOf("welcome");
                if(err.errmsg.indexOf("email_1")>-1) return  callback(STATUS_MSG.ERROR.EMAIL_EXISTS);
            }else{
                return callback(err);
            }
        }else{
            return callback(null,result);
        }
    });
};

//Delete User in DB
var deleteRestaurant = function (criteria, callback) {
    Models.Customers.findOneAndRemove(criteria, callback);
};


module.exports = {
    getRestaurant: getRestaurant,
    createRestaurant: createRestaurant,
    updateRestaurant: updateRestaurant,
    deleteRestaurant: deleteRestaurant,
};
