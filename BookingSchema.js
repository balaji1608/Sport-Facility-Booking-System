const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    owner_user_Name:{type:String,required:true},
    player_user_Name:{type:String,required:true},
    date: Date,
    slot_Number: Number
  });

  var booking= mongoose.model("Bookings", BookingSchema);

  module.exports=booking;
