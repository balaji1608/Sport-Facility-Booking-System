
const mongoose = require('mongoose');
const OwnerSchema = new mongoose.Schema({
  user_Name:{type:String, unique:true,required:[true,"Please check your data entry, no username specified"]},
  Infra_Name:{type:String, required:[true,"Please check your data entry, infrastructure name is not specified"]},
  Sport_Type:{type:String, required:[true,"Oops!, missing type of sport."]} ,
  Open_Time: {type:Number, required:[true,"Plase make sure you have entred the opening time!"]} ,
  slots:{type:Number, required:true},
  Area:{type:String, required:[true,"Please enter the area of infrastructure!"]},
  City:{type:String, required:[true,"Please enter the City where infrastructure is located!"]},
  M_Num: {type:Number, required:[true,"Please enter your mobile number!"], minLength:9},
  password: {type: String, required:[true,"Please make sure you enter the password"]},
  email: {type:String, unique:true,required:[true,"Please make sure you enter the password"]},
  tot_slots:[{type:Number}],
});

const Owner= mongoose.model("Owner", OwnerSchema);

module.exports=Owner;
