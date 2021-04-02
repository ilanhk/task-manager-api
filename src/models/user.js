const mongoose = require('mongoose') //npm moduel that allows us to create models(tables) with mongodb
const validator = require('validator') //npm modules to have more validator options
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') // to create JSON web tokens
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true, //makes sure to get rid of spaces
    }, 
    email:{
        type: String,
        unique: true, //this means that emails must be unique to each user
        required: true,
        trim: true,
        lowercase: true, //to convert email to lowercase just incase.
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is Invalid')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7, //minimum length of the string acceptable will be 7 characters
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Choose another password. Password cannot contain "password"')
            }
        }
    },
    age:{
        type: Number,
        default: 0, //you can set a default value with default
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        } // validate method allows you to design your own validator because mongoose doesnt have a lot of validators
    },
    tokens:[{
        token:{
          type: String,
          required: true,

        }
    }], // this is an array of objects or tokens so you can login and out different devices at the same time which they will each generate unique tokens.
    avatar:{
        type: Buffer, //allows us to store the a buffer with the binary image data with the user which it belongs too

    }
}, {
    timestamps: true //to enable timestamps in this model to know when user was created and when last updated
}) 
//mongoose creates a schema behind the scene but if we do it we can use middleware tools.


//Virtual Property - its not a property stored in a database but a relationship between 2 entities (this case between User and Task models)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // the User model field that is stored in the Task model
    foreignField: 'owner', // the field that User id is in Task model
}) //first argument is the name of the field the second is a reference to the Task model to tell mongoose that they are related


// You can use schemas to create new methods for a model (like bellow after methods and statics those functions i created ).

//To hide password and tokens from the user when everything is authenticated(user dosnt need to see hash password or tokens when login)
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password 
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//To generate a JSON web token
userSchema.methods.generateAuthToken = async function (){
    const user = this 
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//method to login users
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({ email })

    if (!user){
        throw new Error("Unable to Login couldn't find user")
    }
    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched) {
        throw new Error('Incorrect password. Please try again')
    }

    return user
}


//Hashes the pasword before saving
userSchema.pre('save', async function (next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() //call 'next' when you are done with the function. If you dont the function is going to hang forever
}) //cant be arrow function. 'pre' is to do something before the event 'save'


//Middleware to delete all tasks related to user when user is deleted
userSchema.pre('remove', async function (next){
    const user = this
    
    await Task.deleteMany({ owner: user._id })

    next() 
})


const User = mongoose.model('User', userSchema)

module.exports = User

//instances of User
// const me = new User({
//     name: ' Ilan ',
//     email: 'ILANLIEBERMAN@HOTMAIL.COM   ',
//     age: 27,
//     password: 'Hello123'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error!', error)
// })