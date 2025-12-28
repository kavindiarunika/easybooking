import mongoose from 'mongoose';

const safariSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    adventures:{type:[String] , required:true},
    includeplaces:{type:[String] , required:true},
    TeamMembers:{type:Number , required:true},
    whatsapp:{type:String,required:true},
    totalDays:{type:Number , required:true},
    email:{type:String,required:true},
    mainImage:{type:String,required:true},
    images:{type:[String] },
    shortvideo:{type:String}

})

const safari = mongoose.model('safari', safariSchema);
export default safari;
