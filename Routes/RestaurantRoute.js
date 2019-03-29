//const Joi = require('joi');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
const UniversalFunctions = require('../Utils/UniversalFunctions');
const Controller      =  require('../Controllers');
const CONFIG          =  require('../Config');
const APP_CONSTANTS   =  CONFIG.APP_CONSTANTS;
const DEVICE_TYPES    =  APP_CONSTANTS.DEVICE_TYPES;

const checkAccessToken = UniversalFunctions.getTokenFromDB;

let login = {
    method: 'POST',
    path: '/api/v1/restaurant/login',
    handler: function (request, reply) {
        var payloadData = request.payload;
        Controller.RestaurantController.login(payloadData, function (err, data) { console.log("err",err,"======data",data);
          if (err) {
              return err; //reply(UniversalFunctions.sendError(err));
          } else {
              return "";
              //reply(UniversalFunctions.sendSuccess(null, data))
          }
        });
    },
    config: {
        description: 'Login Via Email & Password For  Restaurant',
        tags: ['api', 'restaurant'],

        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().required().min(5).trim(),
                deviceType: Joi.string().required().valid([DEVICE_TYPES.IOS,DEVICE_TYPES.ANDROID,DEVICE_TYPES.WEB]),
                deviceToken: Joi.string().trim(),
                //flushPreviousSessions: Joi.boolean().required(),
                //appVersion: Joi.string().required().trim()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType : 'form',
                responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

let Registration = {
    method: 'POST',
    path: '/api/v1/restaurant/registration',
    handler: function (request, reply) {
        Controller.RestaurantController.registration(request.payload, function (err, data) {
          if (err) {
              reply(UniversalFunctions.sendError(err));
          } else {
              reply(UniversalFunctions.sendSuccess(null, data))
          }
        });
    },
    config: {
        description: 'Login Via Email & Password For  Restaurant',
        tags: ['api', 'restaurant'],
        validate: {
            payload: {
                 restaurantName: Joi.string().required().trim(),
                firstName: Joi.string().required().trim(),
                LastName: Joi.string().required().trim(),
                email: Joi.string().email().required(),
                password: Joi.string().required().min(5).trim(),
                deviceType: Joi.string().required().valid([DEVICE_TYPES.IOS,DEVICE_TYPES.ANDROID,DEVICE_TYPES.WEB]),
                deviceToken: Joi.string().required().trim(),
                phoneNo: Joi.string().required().trim(),
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType : 'form',
                responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

var addDeliveryServiceArea = {
    method: 'POST',
    path: '/api/v1/restaurant/addDeliveryServiceArea',
    config: {
        description: "addDelivery ServiceArea || geofencing",
        tags: ['api', 'restaurant'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0] || {};  
            Controller.RestaurantController.addDeliveryServiceArea(request.payload,UserData,function (error, success) {
                if (error) {
                    reply(UniversalFunctions.sendError(error));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, success)).code(200)
                }
            });
        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                locationName: Joi.string().required(),
                coordinates: Joi.array().items(Joi.array().items(Joi.number().required()).required()).min(4).required()
            },
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

let testRoute = {
    method: 'POST',
    path: '/api/v1/restaurant/testRoute',
    config: {
        description: "addDelivery ServiceArea || geofencing",
        tags: ['api', 'restaurant'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, h) {

        const payload = request.payload;
        return `Welcome ${encodeURIComponent(payload.username)}!`;
        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                locationName: Joi.string().required(),
                coordinates: Joi.array().items(Joi.array().items(Joi.number().required()).required()).min(4).required()
            },
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            //failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}



module.exports = [
  login,
  Registration,
];