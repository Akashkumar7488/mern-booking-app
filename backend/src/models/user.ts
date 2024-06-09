import mongoose from "mongoose"
import bcrypt from 'bcryptjs';
export type UserType = {
    _id:string,
    email:string,
    password:string,
    Name:string,
};
const userSchema = new mongoose.Schema({
    email: {type:String, required:true, unique: true},
    password: {type:String, required:true},
    name: {type:String, required:true},

});
// middleware for hashing password
userSchema.pre("save", async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
})

const User = mongoose.model<UserType>("User", userSchema)

export default User;