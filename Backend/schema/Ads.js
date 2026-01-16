import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    url:{ type:String ,required:true},
    type:{type:String , required:true},
})

const addSchema =  new mongoose.Schema({
    villaad:{type:[mediaSchema] },
    homeAd:{type:[mediaSchema] },
    goTripAd:{type:[mediaSchema] },
})

const AdsSchema = mongoose.model('ads' ,addSchema)
export default AdsSchema;
