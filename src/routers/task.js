const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication')
const router = new express.Router()


//To create a Task and save to the database from a login user
router.post('/tasks', auth, async (req, res)=>{
    const task = new Task({
        ...req.body, //this is to copy 'req.body' to this object
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

//To read all Tasks in the database from a login user
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20 to get to the second page if each page has a limit of 10 objects
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res)=>{
    const match = {}
    const sort = {}

    if (req.query.completed){
        match.completed = req.query.completed === 'true' //this is to make sure it gets a boolean answer
    }

    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 //if its true it will equal -1(descending order) if not it will equal 1(ascending order)
    }
    
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), //limit only accepts integer
                skip:  parseInt(req.query.skip), //same with skip
                sort,
            },
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e){
        res.status(500).send()
    }
})

//To read a Task by ID from a login user
router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

//To Update a Task by ID from a login user
router.patch('/tasks/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed'] 
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update)) 

    if (!isValidOperation){
        return res.status(400).send({ error: "Invalid updates. All or one of the variables you want to update doesn't exist!"})
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e){
        res.status(400).send(e)
    }
})

//To delete a Task by ID from a login user
router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }
        res.send(task)

    } catch (e){
        res.status(500).send(e)
    }
})



module.exports = router