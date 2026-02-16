const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    role:{
        type:String,
        enum:["user","vendor","admin"],
        default:"user",
    },
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    phoneno:{
        type:String,
        required:true,
         match: [/^\d{10,15}$/, "Invalid phone number"],
    },
    address:{
        type:String,
        required:true,
    },
    vendorInfo:{
        storename:{
            type:String,
        },
        storedesc:{
            type:String,
        }
    },
    isprofilecompleted:{
        type:Boolean,
        default:false,
    }

}, {timestamps:true});

module.exports=mongoose.model("User",userSchema);