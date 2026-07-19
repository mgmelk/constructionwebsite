const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema(
{

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },


    fullName:{
        type:String,
        required:true
    },


    phone:{
        type:String,
        required:true
    },


    email:{
        type:String
    },


    position:{
        type:String,
        required:true
    },


    department:{
        type:String,
        enum:[
            "Engineering",
            "Architecture",
            "Construction",
            "Finance",
            "HR",
            "Management"
        ]
    },


    salary:{
        type:Number,
        default:0
    },


    hireDate:{
        type:Date,
        default:Date.now
    },


    status:{
        type:String,
        enum:[
            "Active",
            "Inactive"
        ],
        default:"Active"
    },


    address:{
        type:String
    },


    profileImage:{
        type:String,
        default:""
    }


},
{
    timestamps:true
});


module.exports =
mongoose.model("Employee",employeeSchema);