const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed:{
        type: Boolean,
        default: false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, //this will say this attribute will be an object id
        required: true,
        ref: 'User', //this is to reference this id to the other model 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)


module.exports = Task

// instance of tasks
// const task = new Task({
//     decription: 'blah blah',
//     completed: true,
// })

// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log('Error!', error)
// })
