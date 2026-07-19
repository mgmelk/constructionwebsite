const mongoose = require("mongoose");


const engineerSchema = new mongoose.Schema(
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


    specialization:{
        type:String,
        enum:[
            "Civil Engineer",
            "Structural Engineer",
            "Electrical Engineer",
            "Mechanical Engineer",
            "Software Engineer"
        ],
        required:true
    },


    qualification:{
        type:String
    },


    experience:{
        type:Number,
        default:0
    },


    assignedProjects:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
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
mongoose.model("Engineer", engineerSchema);