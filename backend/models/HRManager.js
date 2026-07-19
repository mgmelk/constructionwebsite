const mongoose = require("mongoose");


const hrManagerSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },


    employeeId:{
        type:String,
        required:true,
        unique:true
    },


    department:{
        type:String,
        default:"Human Resource"
    },


    position:{
        type:String,
        default:"HR Manager"
    },


    hireDate:{
        type:Date,
        default:Date.now
    },


    responsibilities:[
        {
            type:String
        }
    ],


    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});


module.exports =
mongoose.model("HRManager", hrManagerSchema);