const Joi      = require('joi');
//var async = require('async');
const MD5      = require('md5');
const Boom     = require('boom');
const jwt      = require('jsonwebtoken');
const CONFIG   = require('../Config');
const APP_CONSTANTS   =  CONFIG.APP_CONSTANTS;
const STATUS_MSG      = APP_CONSTANTS.STATUS_MSG;
const ERROR           = STATUS_MSG.ERROR
const SUCCESS         = STATUS_MSG.SUCCESS
//console.log("APP_CONSTANTS",APP_CONSTANTS);
const Service = require('../Services');


const async = require("async");


var sendError = function (data) { console.log("errr");
    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        var errorToSend = Boom.create(data.statusCode, data.customMessage);
        errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    } else {
        var errorToSend = '';
        if (typeof data == 'object') {
            if (data.name == 'MongoError') {
                errorToSend += ERROR.DB_ERROR.customMessage;
                if (data.code == 11000) { console.log(" data.errmsg",data,data.errmsg);
                    var duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
                    duplicateValue = duplicateValue.replace('}','');
                    errorToSend += ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    // if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1')>-1){
                    //     errorToSend = ERROR.DUPLICATE_ADDRESS.customMessage;
                    // }
                }
            } else if (data.name == 'ApplicationError') {
                errorToSend += ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name == 'ValidationError') {
                errorToSend += ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name == 'CastError') {
                errorToSend += ERROR.DB_ERROR.customMessage + ERROR.INVALID_ID.customMessage + data.value;
            }
        } else {
            errorToSend = data
        }
        var customErrorMessage = errorToSend;
        if (typeof customErrorMessage == 'string'){
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        return Boom.create(400,customErrorMessage)
        //return Boom.wrap(customErrorMessage, { statusCode: 400 });
    }
};


var sendSuccess = function (successMsg, data) {
    successMsg = successMsg || SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode:successMsg.statusCode, message: successMsg.customMessage, data: data || null};

    }else {
        return {statusCode:200, message: successMsg, data: data || null};

    }
};

var failActionFunction = function (request, reply, source, error) {
    var customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation
    return reply(error);
};

let generateAuthToken = (userData,callbackRoute)=>{
    let expTime = Math.floor(Date.now() / 1000) + (60 * 60)
    let jwtToken =   jwt.sign({ exp: expTime, data: userData}, APP_CONSTANTS.JWT_KEY);  //console.log("jwtToken",jwtToken);
     return callbackRoute(null,jwtToken);
    
}
let encryptedPassword = (password,)=>{
    let dbPassword = MD5(password);
    return dbPassword

}


var getTokenFromDB = (request, reply) => { console.log("getTokenFromDB==init===");
    //var token = request.payload.accessToken;
    var token = (request.payload != null && (request.payload.accessToken)) ? request.payload.accessToken : ((request.params && request.params.accessToken) ? request.params.accessToken : request.headers['accesstoken']);
    var userData = null;
    var usertype, userId, criteria; //console.log("token==1",token);
    async.series([
        (cb) => { 
            jwt.verify(token, APP_CONSTANTS.JWT_KEY, function (err, decoded) { 
                if (err) { console.log("init==1=====",err);
                   return cb(ERROR.TOKEN_NOT_VALID);  
                }//messages.TOKEN_EXIRED
                userId = decoded.data._id;
                criteria = {
                    _id: userId,
                    accessToken: token,
                }; //console.log("asdsa====xxx",err,userId,criteria);
                return cb();
            });
        },
        (cb) => { console.log("init==2");
            Service.RestaurantService.getRestaurant(criteria, {}, {lean: true}, function (err, dataAry) { //console.log('jwt err++++++',criteria,dataAry)
                if (err) return cb(err)
                if (dataAry && dataAry.length == 0) return cb(ERROR.TOKEN_NOT_VALID);
                userData = dataAry;
                return cb()
            });
        }
    ], (err, result) => { //console.log("XXXXXX",err);
        if (err) {
            //reply(err) //reply(sendError(err)).takeover(); //
         throw (err);
        } else {
            if (userData && userData._id) {
                userData._id = userData._id;
                userData.type = userType;
            }
            reply({userData: userData}) //return callbackRoute(null,{userData: userData});
        }

    });
};

var allowAccessTokenInHeader = function () {
    return Joi.object({'accessToken': Joi.string().trim().required()}).options({allowUnknown: true});
}


var getFileNameWithUserId = function (thumbFlag, fullFileName, userId) {
    var prefix = CONFIG.APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.ORIGINAL;
    var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    if (thumbFlag) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.THUMB;
    }
    return prefix + userId + ext;
};

var getFileNameWithUserIdWithCustomPrefix = function (thumbFlag, fullFileName,type, userId) {
    var prefix = '';
    if (type == APP_CONSTANTS.FILE_TYPES.LOGO){
        prefix = APP_CONSTANTS.DOCUMENT_IMAGES_PREFIX.LOGO_PREFIX.ORIGINAL;
    }else if (type == APP_CONSTANTS.FILE_TYPES.DOCUMENT){
        prefix = APP_CONSTANTS.DOCUMENT_IMAGES_PREFIX.DOCUMENT_PREFIX;
    }
    var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    if (thumbFlag && type == APP_CONSTANTS.FILE_TYPES.LOGO) {
        prefix = APP_CONSTANTS.LOGO_PREFIX.THUMB;
    }
    return prefix + userId + ext;
};


function uploadFile(fileData, userId, type, callbackParent) {
    //Verify File Data
    var imageURL = {
        original: null,
        thumbnail: null
    };
    var logoURL = {
        original: null,
        thumbnail: null
    };
    var documentURL = null;

    var originalPath = null;
    var thumbnailPath = null;
    var dataToUpload = [];

    async.series([
        function (cb) { //Validate fileData && userId
            if (!userId || !fileData || !fileData.filename) {
                console.log('in upload file to s3',userId,fileData)
                cb(ERROR.IMP_ERROR)
            } else {
                // TODO Validate file extensions
                cb();
            }
        }, function (cb) {
            //Set File Names
            imageURL.original = UniversalFunctions.getFileNameWithUserIdWithCustomPrefix(false, fileData.filename, type,  userId);
            imageURL.thumbnail = UniversalFunctions.getFileNameWithUserIdWithCustomPrefix(true, fileData.filename, type, userId);
            cb();
        },
        function (cb) {
            //Save File
            var path = Path.resolve(".") + "/uploads/" + imageURL.original;
            saveFile(fileData.path, path, function (err, data) {
                cb(err, data)
            })
        },
        function (cb) {
            //Create Thumbnail if its a logo
            originalPath = Path.resolve(".") + "/uploads/" + imageURL.original;
            dataToUpload.push({
                originalPath: originalPath,
                nameToSave: imageURL.original
            });
            if (type == APP_CONSTANTS.FILE_TYPES.LOGO){
                thumbnailPath = Path.resolve(".") + "/uploads/" + imageURL.thumbnail;
                createThumbnailImage(originalPath, thumbnailPath, function (err, data) {
                    dataToUpload.push({
                        originalPath: thumbnailPath,
                        nameToSave: imageURL.thumbnail
                    });
                    cb(err, data)
                })
            }else {
                cb();
            }

        },
        function (cb) {
            //Upload both images on S3
            parallelUploadTOS3(dataToUpload, cb);
        }
    ], function (err, result) {
            callbackParent(err, imageURL)
    });
}

function createThumbnailImage(originalPath, thumbnailPath, callback) {
    var gm = require('gm').subClass({imageMagick: true});
    gm(originalPath)
        .resize(APP_CONSTANTS.THUMB_SIZE.THUMB_WIDTH, APP_CONSTANTS.THUMB_SIZE.THUMB_HEIGHT, "!")
        .autoOrient()
        .write(thumbnailPath, function (err, data) {
            callback(err)
        })
}
/*
var knox = require('knox');
var fsExtra = require('fs-extra');


function saveFile(fileData, path, callback) {
    fsExtra.copy(fileData, path, callback);
}

function deleteFile(path) {
    fsExtra.delete(path, function (err) {
        console.log('error deleting file>>',err)
    });
}
UploadManager.uploadFileToS3WithThumbnail(payloadData.profilePic, customerData._id, function (err, uploadedInfo) {
                    if (err) { //console.log("errrr145",err);
                        return cb(err)
                    } else {
                        dataToUpdate.profilePicURL.original = uploadedInfo && uploadedInfo.original && UniversalFunctions.CONFIG.awsS3Config.s3BucketCredentials.s3URL + uploadedInfo.original || null;
                        dataToUpdate.profilePicURL.thumbnail = uploadedInfo && uploadedInfo.thumbnail && UniversalFunctions.CONFIG.awsS3Config.s3BucketCredentials.s3URL + uploadedInfo.thumbnail || null;
                        //console.log("dataToUpdate150",dataToUpdate);
                        return cb();
                    }
})*/

//generateAuthToken({_id:"as",name:"saddsd",email:"asdsadsad"});
module.exports = {
    sendError:sendError,
    sendSuccess:sendSuccess,
    failActionFunction:failActionFunction,
    encryptedPassword:encryptedPassword,
    generateAuthToken:generateAuthToken,
    getTokenFromDB:getTokenFromDB


}