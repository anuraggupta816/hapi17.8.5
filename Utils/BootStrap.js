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

const UniversalFunctions = require('./UniversalFunctions');

const async = require("async");
const Mongoose = require('mongoose');


const resturantData = [
    {
      restaurantName:"Amritsari Zaika",
      email:"amritsarizaika@yopmail.com",
      password:12345678,
      firstName:"Amritsari",
      LastName:"Zaika",
      phoneNo:"987456123",
      Category:["Cupcakes","Street Food","Halal","Juice and Smoothies","Chopped Salads" ,"Medium Hot Specialty Subs","Burgers","Pizza","Coffee and Tea"],
      location:{
        type:"Point",
        coordinates:[0,0]
      }
    },
    {
      restaurantName:"Sher-E-Punjab",
      email:"sher-e-punjab@yopmail.com",
      firstName:"sher",
      LastName:"E-Punjab",
      phoneNo:"987456121",
      password:12345678,
      Category:["Cupcakes","Street Food","Halal","Juice and Smoothies","Chopped Salads" ,"Medium Hot Specialty Subs","Burgers","Pizza","Coffee and Tea"],
      location:{
        type:"Point",
        coordinates:[0,0]
      }
    },
    {
      restaurantName:"Dum Yum Hyderabadi Biryani - Mohali",
      email:"dumyumhyderabadibiryani@yopmail.com",
      firstName:"Dum Yum",
      LastName:"Hyderabadi Biryani",
      phoneNo:"987456121",
      password:12345678,
      Category:["Cupcakes","Street Food","Halal","Juice and Smoothies","Chopped Salads" ,"Medium Hot Specialty Subs","Burgers","Pizza","Coffee and Tea"],
      location:{
        type:"Point",
        coordinates:[0,0]
      }
    }
]

let insertResturantData  = (resturantData, callbackRoute)=>{

  async.eachSeries(resturantData,(element,outerCallback)=>{
      let resturantId,restaurantExists=false;
      async.auto({
        checkRestaurantExistsORNOT:[(cb)=>{
          var criteria = {
            restaurantName:element.restaurantName,
            email:element.email,
          }
          Service.RestaurantService.getRestaurant(criteria, {},{},(err,result)=>{ 
            if(err) return cb(err); 
            if(result.length>0){
              resturantId = result[0]._id;
              restaurantExists= true;
            }            
            return cb();
          })
        }],
        InsertIntoDb:['checkRestaurantExistsORNOT',(r1,cb)=>{ 
          if(restaurantExists){
            return cb();
          }else{
              element.password= UniversalFunctions.encryptedPassword(element.password);
                Service.RestaurantService.createRestaurant(element,(err,result)=>{ 
                if(err) return cb(err); 
                resturantId = result._id;
                return cb();
              })
          }          
        }],
        InsertCategory:['InsertIntoDb',(r1,cb)=>{ 
          insertResturantCategoryData(resturantId,element.Category,(err,result)=>{
               if (err) return cb(err);
               return cb();
          })
        }]
      },(err,result)=>{
        if (err) return outerCallback(err);
        return outerCallback();
      })              
  },(err,result)=>{
    if (err) return callbackRoute(err);
    return callbackRoute();
  })
}


let insertResturantCategoryData  = (resturantId,Category, callbackRoute)=>{ 
  async.eachSeries(Category, (element,outerCallback)=> {
    let CategoryExists=false;
      async.auto({
        checkCategoryExistsORNOT:[(cb)=>{
          var criteria = {
            "categoryName":element.toString(),
            "restaurant":  Mongoose.Types.ObjectId(resturantId)
          }; 
          Service.CategoryService.getCategory(criteria, {},{},(err,result)=>{ 
            if(err) return cb(err); 
            if(result.length>0){
              CategoryExists= true;
            }            
            return cb();
          })
        }],
        InsertIntoDb:['checkCategoryExistsORNOT',(r1,cb)=>{  
          if(CategoryExists){
            return cb();
          }else{
              let data ={
              categoryName:element,
              restaurant:Mongoose.Types.ObjectId(resturantId)
            };  
            Service.CategoryService.createCategory(data,(err,result)=>{ 
             if(err) return cb(err); 
              return cb();
            })
          }
        }],
      },(err,result)=>{
        if (err) return outerCallback(err);
        return outerCallback();
      })              
  },(err,result)=>{
    if (err) return callbackRoute(err);
    return callbackRoute();
  })

}

insertResturantData(resturantData,(err,result)=>{
  
});
module.exports = {
  insertResturantData:insertResturantData,
}
