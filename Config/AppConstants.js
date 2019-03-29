let DEVICE_TYPES = {
    ANDROID:"ANDROID",
    IOS:"IOS",
    WEB:"WEB"
}

let JWT_KEY = "asedrftgyhujik";  //T&GFoodRunnerqwertyyuiop

let s3BucketCredentials = {
    "bucket": "s3-bvs",
    "accessKeyId": "",
    "secretAccessKey": "",
    "s3URL": "https://s3.amazonaws.com/s3-bvs/",
    "folder": {
        "profilePicture": "profilePicture",
        "thumb": "thumb"
    }
};
let FILE_TYPES =  {
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
    OTHERS: 'OTHERS'
};

let DOCUMENT_IMAGES_PREFIX= {
    RESTAURANT_PIC_PREFIX : {
        ORIGINAL : 'restaurantPic_',
        THUMB : 'restaurantThumb_'
    },
    PROFILE_PIC_PREFIX : {
        ORIGINAL : 'profilePic_',
        THUMB : 'profileThumb_'
    },
    LOGO_PREFIX : {
        ORIGINAL : 'logo_',
        THUMB : 'logoThumb_'
    },
    DOCUMENT_PREFIX : 'document_',
}
let  THUMB_SIZE = {
    WIDTH : 100,
    HEIGHT : 100, 
}


let  swaggerDefaultResponseMessages = [
    {code: 200, message: 'OK'},
    {code: 400, message: 'Bad Request'},
    {code: 401, message: 'Unauthorized'},
    {code: 404, message: 'Data Not Found'},
    {code: 500, message: 'Internal Server Error'}
];


let STATUS_MSG = {
    ERROR: {
        APP_ERROR: {
            statusCode:400,
            customMessage : 'Application Error',
            type : 'APP_ERROR'
        },
        DB_ERROR: {
            statusCode:400,
            customMessage : 'DB Error.',
            type : 'DB_ERROR'
        },
        CATEGORY_NAME_EXISTS: {
            statusCode:400,
            customMessage : 'Category name exists',
            type : 'CATEGORY_NAME_EXISTS'
        },
        COUNTRY_CODE_MISSING: {
            statusCode:400,
            customMessage : 'You forgot to enter the country code',
            type : 'COUNTRY_CODE_MISSING'
        },
        DUPLICATE: {
            statusCode:400,
            customMessage : 'Duplicate entry',
            type : 'DUPLICATE'
        },
        EMAIL_EXISTS: {
            statusCode:400,
            customMessage : 'Email exists',
            type : 'EMAIL_EXISTS'
        },
        ERROR_IN_EXECUTION:{
            statusCode:400,
            customMessage : 'ERROR INEXECUTION',
            type : 'ERROR_IN_EXECUTION'
        },
        ERROR_PROFILE_PIC_UPLOAD: {
            statusCode:400,
            customMessage : 'Profile pic is not a valid file',
            type : 'ERROR_PROFILE_PIC_UPLOAD'
        },
        FACEBOOK_ID_PASSWORD_ERROR: {
            statusCode:400,
            customMessage : 'Only one field should be filled at a time, either facebookId or password',
            type : 'FACEBOOK_ID_PASSWORD_ERROR'
        },
        IMP_ERROR: {
            statusCode:500,
            customMessage : 'Implementation Error',
            type : 'IMP_ERROR'
        },
        INCORRECT_PASSWORD: {
            statusCode:401,
            customMessage : 'Incorrect password',
            type : 'INCORRECT_PASSWORD'
        },
        INVALID_EMAIL_PASSWORD: {
            statusCode:400,
            customMessage : 'Invalid email or password',
            type: 'INVALID_EMAIL_PASSWORD'
        },
        INVALID_USER_PASS: {
            statusCode:401,
            type: 'INVALID_USER_PASS',
            customMessage : 'Invalid username or password'
        },
        INVALID_ID: {
            statusCode:400,
            customMessage : 'Invalid Id Provided.',
            type : 'INVALID_ID'
        }, 
        INVALID_COUNTRY_CODE: {
            statusCode:400,
            customMessage : 'Invalid country code, Should be in the format +52',
            type : 'INVALID_COUNTRY_CODE'
        },
        INVALID_PHONE_NO_FORMAT: {
            statusCode:400,
            customMessage : 'Phone no. cannot start with 0',
            type : 'INVALID_PHONE_NO_FORMAT'
        },
       
        PHONE_NO_EXIST: {
            statusCode:400,
            customMessage : 'Phone no already exist',
            type : 'PHONE_NO_EXIST'
        },
        RESTAURANT_NAME_EXISTS: {
            statusCode:400,
            customMessage : 'Restaurant name exists',
            type : 'RESTAURANT_NAME_EXISTS'
        },        
        TOKEN_NOT_VALID: {
            statusCode: 400,        
            customMessage: 'Invalid Token.',
            type: "TOKEN_NOT_VALID"
        },
        TOKEN_ALREADY_EXPIRED: {
            statusCode:401,
            customMessage : 'Token Already Expired',
            type : 'TOKEN_ALREADY_EXPIRED'
        },
        SUB_CATEGORY_NAME_EXISTS: {
            statusCode:400,
            customMessage : 'Subcategory name exists',
            type : 'SUB_CATEGORY_NAME_EXISTS'
        },   
        USEAR_IS_BLOCK: {
            statusCode:400,
            customMessage : 'User is block.',
            type : 'USEAR_IS_BLOCK'
        },     
    },
    SUCCESS: {
        CREATED: {
            statusCode:201,
            customMessage : 'Created Successfully',
            type : 'CREATED'
        },
        DEFAULT: {
            statusCode:200,
            customMessage : 'Success',
            type : 'DEFAULT'
        },
        DELETED: {
            statusCode:200,
            customMessage : 'Deleted Successfully',
            type : 'DELETED'
        },
        LOGOUT: {
            statusCode:200,
            customMessage : 'Logged Out Successfully',
            type : 'LOGOUT'
        },
        UPDATED: {
            statusCode:200,
            customMessage : 'Updated Successfully',
            type : 'UPDATED'
        },
    }
}    

var APP_CONSTANTS = {
    DEVICE_TYPES  :  DEVICE_TYPES,
    DOCUMENT_IMAGES_PREFIX :DOCUMENT_IMAGES_PREFIX,
    FILE_TYPES:FILE_TYPES,
    JWT_KEY       :  JWT_KEY,
    STATUS_MSG    :  STATUS_MSG,
    s3BucketCredentials :s3BucketCredentials,
    THUMB_SIZE    : THUMB_SIZE,
    swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
}
module.exports = APP_CONSTANTS