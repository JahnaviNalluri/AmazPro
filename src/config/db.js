const mongoose=require("mongoose");
const URL=process.env.URL;
const connectDb=async()=>{
    if(!URL) throw new Error("URL not found");
    try{
        await mongoose.connect(URL);
        console.log("MongoDB connected successfully");
    }catch(err){
        console.log("Mongo db not connected");
        process.exit(1);
    }

};

module.exports=connectDb;