import mongoose from 'mongoose'

const venderauth = new mongoose.Schema({

    email:{type:String , required:true},
    phone:{type:String , required:false, default:""},
    password:{type:String ,required:true},
    category:{type:String ,required:true},
    otp:{type:String},
    otpExpireAt:{type:Date},
    isVerified:{type:Boolean ,default:false}

},{timestamps:true})

const vendor = mongoose.model("VendorAuth" , venderauth);
export default vendor;