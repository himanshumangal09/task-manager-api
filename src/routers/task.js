const express = require('express')
const task=require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()
//CREATE
router.post('/tasks',auth,async (req,res)=>{

    try {
        const Task = new task({
            ...req.body,
            owner:req.user._id
        })
    // const Task = new task(req.body)
    await   Task.save()
     res.status(201).send(Task)
    }
    catch(e) {
    res.status(400).send()
    }
    //.then(()=>{
    //     res.status(201).send(Task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
    })
    //GET --/tasks?completed=true
//GET--/tasks?limit=10&skip=10
//GET --/tasks?sortBy=createdAt:asc
///Users/ram/mongodb/bin/mongod.exe --dbpath=/Users/ram/mongodb-data
    router.get('/tasks',auth, async (req,res)=>{
  const match={}
  const sort={}
  if(req.query.completed) {
    match.completed = req.query.completed==='true'
  }
  if(req.query.sortBy) {
const parts=req.query.sortBy.split(':')
sort[parts[0]]=parts[1]==='desc'?-1:1
  }
        try {
//     const Task = await task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
res.send(Task)
     }
     catch(e) {
        res.status(400).send()
     }
        // task.find({})
        //.then((task)=>{
        //     res.send(task)
        // }).catch((e)=>{
        //     res.status(500).send()
        // })
    })
    router.get('/tasks/:id',auth, async (req,res)=>{
        const _id=req.params.id
        try {
            const Task= await task.findOne({_id,owner:req.user._id}) 
            //const Task= await task.findById(_id)
             res.send(Task)
        }
        catch(e) {
            res.status(400).send()
        }
        // task.findById(_id).then((task)=>{
        //     if(!task) {
        //         return res.status(400).send()
        //     }
        //     res.send(task)
        // }).catch(()=>{
        //     res.status(500).send()
        // })
    })
    
    router.patch('/tasks/:id',auth,async(req,res)=>{
        const allowedupdates=['description','completed']
        /**{
        "completed": true,
        "_id": "5d382c467022483088a578e1",
        "description": "not done",
        "__v": 0
    } */
        const updates=Object.keys(req.body)
        //  console.log(req.body)
        const isvalidoper=updates.every((update)=>allowedupdates.includes(update))
        if(!isvalidoper)
        {
            return res.status(400).send({error:'invalid updates'})
        }
        try {
         const Task=await task.findOne({_id:req.params.id,owner:req.user._id})
            //  const Task = await task.findById(req.params.id)
          if(!task) {
              res.staatus(404).send()
          }
            updates.forEach((update)=>{
            Task[update]=req.body[update]    
            })
            await Task.save()
            //(req.params.id,req.body,{new:true,runValidators:true})
            res.send(Task)
        }
        catch(e) {
            res.status(404).send(e)
        }
    })
    router.delete('/tasks/:id',auth,async(req,res)=>{
        try {
            const Task = await task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
            if(!Task) {
                return res.status(404).send()
            }
            res.send(Task)
           }
        catch(e) {
            res.status(400).send()
        }
    })
    
module.exports=router