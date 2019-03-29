'use strict';

var Joi = require('joi');

var customerRegister = {
	method: 'POST',
	    path: '/api/customer/register',
	handler: function (request, reply) {
	var payloadData = request.payload;
	Controller.CustomerController.createCustomer(payloadData, function (err, data) { console.log("sadasasd");
	    if (err) {
	        reply(err);
	    } else {
	        reply(data).code(201)
	    }
	});
	},
	config: {
	    description: 'Register Customer',
	        tags: ['api', 'customer'],
	        payload: {
	        maxBytes: 9437184,//2000000,
	            parse: true,
	            output: 'file'
	    },
	    validate: {
	        payload: {
	            firstName: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
	            LastName: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).optional(),
	            phoneNo: Joi.string().regex(/^[0-9]+$/).min(5).required(),
	            email: Joi.string().email().required(),
	            password: Joi.string().optional().min(6).trim(),
	            facebookId: Joi.string().optional().trim(),
	            //deviceType: Joi.string().required().valid([DEVICE_TYPES.IOS,DEVICE_TYPES.ANDROID]),
	            deviceToken: Joi.string().required().trim(),
	            appVersion: Joi.string().required().trim(),
	            profilePic: Joi.any()
	            .meta({swaggerType: 'file'})
	            .optional()
	            .description('image file'),
	            // socialMode: Joi.string().valid(
	            //     SOCIAL_TYPE.FACEBOOK
	            //     //SOCIAL_TYPE.GOOGLE_PLUS
	            // ).optional(),
	            countryCode:Joi.string().required().trim(),
	        },
	        //failAction: UniversalFunctions.failActionFunction
	    },
	    plugins: {
	        'hapi-swagger': {
	            payloadType : 'form',
	                //responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
	        }
	    }
	}
}

module.exports = [
   customerRegister
]