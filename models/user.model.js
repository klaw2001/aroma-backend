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
        required:false
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
    status:{
        type:String,
        enum: ['active', 'inactive'], 
        default:'inactive'
    }
})

export default mongoose.model("User",UserSchema)
