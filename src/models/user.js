const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt =require('bcryptjs')
const jwt =  require('jsonwebtoken')
const Task =require('./task')
const uS=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    age:{
        type:Number,
     
        default:0,
        validate(value) {
            if(value<0)
            {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,//unique email id every time
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true,

        validate(value){
            if(value.toLowerCase().includes('password'))
                {
                    throw new Error('Should not contain "password" ')
                }
            
        }
    },
    tokens:[{
        token:{
        type:String,
        required:true
        }
    }],avatar:{
        type:Buffer
    }

},{
    timestamps:true
})
uS.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

uS.methods.toJSON = function () {
    const user= this
    const userOject = user.toObject()
    delete userOject.password
    delete userOject.tokens
    delete userOject.avatar
    return userOject 
}

uS.methods.genrateAuthToken = async function () {
try {
    const user=this
    const token= jwt.sign({_id:user._id.toString() },process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}
catch(e){
//const c={}    
return user
}
}
//login model
//mongodb+srv://tasksapp:<password>@cluster0-n1s83.mongodb.net/test
uS.statics.findByCredentials = async (email,password) =>{
try{
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) {
    throw new Error('Unable to  login')
     }
     return user
}

catch(e) {
return user
}
}
//password hashing before saving the password
uS.pre('save', async function (next) {
try {
    const user=this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
   // console.log('before saving the saving  user')
    next()
    console.log(user)
}
catch(e) {
    return user
}
})
uS.pre('remove',async function(next){
try {
    const user=this
  await  Task.deleteMany({owner:user._id})
    next()
}
catch(e) {
return 'can not delete '
}
})
const User=mongoose.model('User',uS)
module.exports=User