const mongoose=require("mongoose");
const cartSchema=mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
            },
            quantity:{
                type:Number,
                default:1,
                min:1,
            },
            price:{
                type:Number,
                required:true,
            }
        }
    ]

},{timestamps:true});

module.exports=mongoose.model("Cart",cartSchema);