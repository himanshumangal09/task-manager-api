const express = require('express')
require('./db/mongoose')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
require('./models/user')
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.listen(port,()=>{
    console.log('server is at '+ port)
})
//EXTRA STUFF----------//--------EXTRA STUFF----------//--------EXTRA STUFF------------//---------EXTRA STUFF------------//
// app.use((req,res,next)=>{
//     if(req.method=='GET') {
//         res.send('GET request are disabled')
//     }
//     else {
//         next()
//     }

// })

// app.use((req,res,next)=>{
//         if(req.method){
//             res.status().send('Site under maintanance')
//         } else {
//             res.send('please use correct url')
//         }
// })
// const multer = require('multer') 
// const upload = multer({
//     dest:'images',
//     limits:{
//         fieldSize:1000000
//     },
//     fileFilter(req,file,cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return(new Error('please provide doc/docx document'))
//         }
//         cb(undefined,true)
//     }
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.send({error:error.message}).status(400)
// })

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async ()=>{
//     const user = await User.findById('5d3d5cf5bdc8141b706448fb')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
//     // const task=await Task.findById('5d3d7eebde43620760d0643d')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
// }
// main()   
// const jwt = require('jsonwebtoken')
// const myfkk = async () => {
//     const token = jwt.sign({_id:'dffe2'},'hjghsdfgjkhkukkjjkjjkl',{expiresIn:'7 days'})
//    // console.log(token)
//     const data =jwt.verify(token,'hjghsdfgjkhkukkjjkjjkl')
//   //  console.log(data)
// }
// myfkk()
// const pet = {
//   name:'harsh'
// }
// pet.toJSON=function () {
//   return {}
// }
// console.log(JSON.stringify(pet))