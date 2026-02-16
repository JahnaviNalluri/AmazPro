const mongoose=require("mongoose");
const orderSchema=mongoose.Schema({
   products: [{
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
}],

    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    totalAmt:{
        type:Number,
        required:true,
    },
    status:{
        enum:["pending","shipping","paid","delivered","cancelled"],
        default:"pending",
        type:String,
    },
    paymentId:{
        type:String,
    },
    shippingAddress:{
        type:String,
        required:true,
    }
})

module.exports=mongoose.model("Order",orderSchema);