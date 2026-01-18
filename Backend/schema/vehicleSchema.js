import mongoose, { Schema } from "mongoose";

const vehicleSchema =new mongoose . Schema({

    name:{type:String ,required:true},
    Price:{type:Number , required:true},
    type:{type:String , required:true},
    description:{type:String},
    discrict:{type:String, required:true},
    passagngers:{type:Number},
    facilities:{type:[String]},
    mainImage:{type:String ,required:true},
    otherImages:{type:[String]},
    whatsapp:{type:String,required:true},
    ownerEmail:{type:String}

});

const vehicle = mongoose.model("VehicleRent" , vehicleSchema);
export default vehicle;