import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname:{
        type:String,
        default:null,
    },
    lastname:{
        type:String,
        default:null
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        default:null
    },
    dateofbirth:{
        type:Date,
        default:null
    },
    gender:{
        type: String,
        enum: ['male', 'female', 'other'],
        default: null
    },
    about:{
        type:String,
        default:null
    },
    avatar:{
        type:String,
        default:null
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user', 
      },
    // status:{
    //     type:Number,
    //     default:null
    // }
})

export default mongoose.model("User",UserSchema)
