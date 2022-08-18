const mongoose =require('mongoose') ;

const paymentSchema = new mongoose.Schema({
    user_id:{
        type:String ,
         require,
    },
    name:{
        type:String ,
         require,
    },
    email:{
        type:String ,
         require,
    },
    paymentID:{
        type:String,
        require:true
    },
    address:{
        type:Object ,
         require,
    },
     cart:{
        type:Array ,
        default:[],
    },
    status:{
        type:Boolean ,
        default:false
    }
},{
    timestamps:true
})


module.exports = mongoose.model("Payments",paymentSchema)