const mongoose=require("mongoose");
const reviewSchema=mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    feedback:{
        type:String,
    },
    rating:{
        type:Number,
        default:1,
        required:true,
    }
},{timestamps:true})
module.exports=mongoose.model("Review",reviewSchema);