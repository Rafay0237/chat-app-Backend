const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    email: {
        type: String,
        required:[true,'Email Is Required! '],
        minlength:[10,'Email is too Short! ']
    },
    userName:{
        type: String,
        required:[true,'User name Is Required! '],
        minlength:[4,'User name is too Short! ']
    },
    password:{
        type: String,
        required:[true,'Password Is Required! '],
        minlength:[6,'Password is too Short! ']
    },
    profilePicture:{
        type:String,
        default:"https://th.bing.com/th?id=OIP.vpU_KUELPRjvDl4PvY0xIAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2" 
    }
})
const users= mongoose.model("users",userSchema);

module.exports=users;
