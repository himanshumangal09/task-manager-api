const express = require('express')
const User=require('../models/user')
const auth = require('../middleware/auth')
const multer=require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail}=require('../emails/account')
const {sendGoodByEmail}=require('../emails/account')
const router = new express.Router()
//CREATE
router.post('/users',async (req,res)=>{
    console.log(req.body)
    const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeEmail(user.email,user.name)
    const token = await  user.genrateAuthToken()
    res.status(201).send({user,token})
}
  catch(e) {
    res.status(400).send(e)
  }
  
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})
//READ
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)

})
router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e) {
        res.status(500).send()
    }
})


//UPDATE
router.patch('/users/me',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedupdates=['name','email','password','age']
    const isvalidoper = updates.every((update)=> allowedupdates.includes(update))
    if(!isvalidoper) {
        return res.status(404).send({error:'invalid updates'})
    }
try{
    const user = req.user
    updates.forEach((update)=>{
    user[update]=req.body[update]
    })
    
    await user.save()
    // //const user =await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    // if(!user) {
    //     return res.status(404).send()
    // }
     res.send(user)
}
catch(e) {
    res.status(400).send(e)
}
})
//DELETE
router.delete('/users/me',auth ,async(req,res)=>{
    try {
        // const user1 = await User.findByIdAndDelete(req.user._id)
        // if(!user1) {
        //     return res.status(404).send()
        // }
        // res.send(user1)
        sendGoodByEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)
       }
    catch(e) {
        res.status(400).send()
    }
})

router.post('/users/login',async (req,res)=>{
    try {
     const user=await User.findByCredentials(req.body.email,req.body.password)
     const token = await user.genrateAuthToken()
     res.send({user,token})
     
    }
    catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await res.user.send()
        res.status(200).send()
    }
    catch(e) {
        res.status(500).send()
    }
})
router.post('/users/logoutAll',auth, async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e) {
        res.status(500).send()
    }
})
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            cb(new Error('must be jpg,png,jpeg'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
  const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
   req.user.avatar= buffer
    await req.user.save()
    
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()

})
router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar) {
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }
    catch(e) {
        res.status(404).send
    }
})
module.exports=router
