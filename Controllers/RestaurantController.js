const Service = require('../Services');
const Models  = require('../Models');
const Config = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const APP_CONSTANTS   =  Config.APP_CONSTANTS;
const DEVICE_TYPES    =  APP_CONSTANTS.DEVICE_TYPES;

const async = require("async");

let login_old =(payloadData, callbackRoute)=> { 
    let userData;
    async.auto({
      getUserData:[(cb)=>{
        payloadData.password= UniversalFunctions.encryptedPassword(payloadData.password);
        let criteria  ={
          email:payloadData.email,
          password:payloadData.password
        } 
        let projection= {
            password:0,__v:0
        }
        Service.RestaurantService.getRestaurant(criteria,projection,{lean:true},(err,result)=>{
          if(err) return cb(err); 
          if(result.length==0) return cb(err); 
          userData = result[0];
          return cb();
        })
      }],
      generateAccessToken:['getUserData',(r1,cb)=>{
        UniversalFunctions.generateAuthToken({_id:userData._id,email:userData.email,name:userData.email},(err,result)=>{ 
           if(err) return cb(err);
           userData.accessToken = result;
           return cb();
        })
      }],
      updateAccessToken:['generateAccessToken',(r1,cb)=>{
         let criteria = {_id:userData._id}
         let dataToSet ={
            accessToken:userData.accessToken,
            updatedAt: new Date(),
         }
         if(payloadData.deviceToken){
            dataToSet.deviceToken  = payloadData.deviceToken;
            dataToSet.deviceType   = payloadData.deviceType;
         }
         Service.RestaurantService.updateRestaurant(criteria,dataToSet,{new:true},(err,result)=>{ 
          if(err) return cb(err); 
          return cb();
        })
      }]
    },function(err,result){
       if(err) return callbackRoute(err);
       return callbackRoute(null,{
        userData:userData
       });
    });
}

let  login =(payloadData, callbackRoute)=> { 
    let userData;
    return new Promise((resolve, reject) => {
      resolve();
})
    /*
    async.auto({
      getUserData:[(cb)=>{
        payloadData.password= UniversalFunctions.encryptedPassword(payloadData.password);
        let criteria  ={
          email:payloadData.email,
          password:payloadData.password
        } 
        let projection= {
            password:0,__v:0
        }
        Service.RestaurantService.getRestaurant(criteria,projection,{lean:true},(err,result)=>{
          if(err) return cb(err); 
          if(result.length==0) return cb(err); 
          userData = result[0];
          return cb();
        })
      }],
      generateAccessToken:['getUserData',(r1,cb)=>{
        UniversalFunctions.generateAuthToken({_id:userData._id,email:userData.email,name:userData.email},(err,result)=>{ 
           if(err) return cb(err);
           userData.accessToken = result;
           return cb();
        })
      }],
      updateAccessToken:['generateAccessToken',(r1,cb)=>{
         let criteria = {_id:userData._id}
         let dataToSet ={
            accessToken:userData.accessToken,
            updatedAt: new Date(),
         }
         if(payloadData.deviceToken){
            dataToSet.deviceToken  = payloadData.deviceToken;
            dataToSet.deviceType   = payloadData.deviceType;
         }
         Service.RestaurantService.updateRestaurant(criteria,dataToSet,{new:true},(err,result)=>{ 
          if(err) return cb(err); 
          return cb();
        })
      }]
    },function(err,result){
       if(err) return callbackRoute(err);
       return callbackRoute(null,{
        userData:userData
       });
    });*/
}


var registration =(payloadData, callbackRoute)=> {
    let userData;
    async.auto({
      InsertIntoDb:[(cb)=>{
        payloadData.password= UniversalFunctions.encryptedPassword(payloadData.password);
        payloadData.location = {
            type:"Point",
            coordinates:[0,0]
        }
        Service.RestaurantService.createRestaurant(payloadData,(err,result)=>{ 
         if(err) return cb(err); 
          userData = result;
          return cb();
        })
      }],
      generateAccessToken:['InsertIntoDb',(r1,cb)=>{
        UniversalFunctions.generateAuthToken({_id:userData._id,email:userData.email,name:userData.email},(err,result)=>{
           if(err) return cb(err);
           userData.accessToken = result;
           return cb();
        })
      }],
      updateAccessToken:['generateAccessToken',(r1,cb)=>{
         let criteria = {_id:userData._id}
         let dataToSet ={
             accessToken:userData.accessToken
         }
         Service.RestaurantService.updateRestaurant(criteria,dataToSet,{new:true},(err,result)=>{ 
          if(err) return cb(err); 
          userData = result;
          return cb();
        })
      }]
    },function(err,result){
       if(err) return callbackRoute(err);
       return callbackRoute(null,{
        userData:userData
       });
    })
}


var addDeliveryServiceArea = function (payload, UserData,callbackRoute) { //console.log("payload#####",payload);
    //var areaId;
    var servingLocation;
    async.auto({
      createLocation:[(cb)=>{
        let criteria = {_id:userData._id}
        let dataToSet = {
            locationName: [payload.locationName],
            location: {
                type: "Polygon",//LineString //Polygon
                coordinates: [payload.coordinates]
            }
        }
        Service.RestaurantService.updateRestaurant(criteria, dataToSet, options,(err, data)=> {
            if (err) return cb(err);
            servingLocation = data;
            return cb(null);
        });
      }]
    },()=>{
      if (error) return callbackRoute(error);
      return callbackRoute();
    })     
};

module.exports ={
  login:login,
  registration:registration,
  addDeliveryServiceArea
}