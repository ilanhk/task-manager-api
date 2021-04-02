const express = require('express')
const { updateOne } = require('../models/user')
const User = require('../models/user')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/acount')
const sharp = require('sharp') //this allows user to manipulate an image to specific dimensions and more b4 it goes to html
const auth = require('../middleware/authentication') // to add middleware to a route add it as the argument before the function argument
const multer = require('multer') //this is to do file uploads with express. Also comes with a multer middleware
const router = new express.Router()



//To create a user and save to the database
router.post('/users', async (req, res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user , token })
    } catch(e){
        res.status(400).send(e)
    }
})
//changing status to 201(something is created) or 400(bad request) is to make sure the api sends the right status info

//To Login a User
router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(e){
        res.status(400).send(e)
    }
})

//To Logout a User
router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send()
    }
})

//To Logout a User from all devices/sessions
router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

//To read user that is login
router.get('/users/me', auth, async (req, res)=>{
    res.send(req.user)
})


//To Update a User when login
router.patch('/users/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age'] 
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update)) // purpose of this is to make sure the update variable exists because if it doesnt it will still run. This way we can not make it run and show error.

    if (!isValidOperation){
        return res.status(400).send({ error: "Invalid updates. All, some, or one of the variables you want to update doesn't exist!"})
    }
    try {
        updates.forEach((update)=> req.user[update] = req.body[update]) //this is update all keys in the object that needs updating
        await req.user.save()
        res.send(req.user)
    } catch (e){
        res.status(400).send(e)
    }
}) //patch is used for updating existing objects. 'new: true' will return the new user over the existing one and the 'runValidators: true' is to make sure the new data is validated.

//To delete a login User by its own profile
router.delete('/users/me', auth, async (req, res)=>{
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (e){
        res.status(500).send(e)
    }
})


//To upload a profile picture
const upload = multer({
    limits: {
        fileSize: 1000000, //max limit in megabites so users cant spam my servers with huge files which would cost me to store
    },
    fileFilter(req, file, cb){
        // if (!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('file must be a PDF. Please upload a PDF.'))
        // } //to make sure its a pdf file

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('file must be a jpg, jpeg or png. Please upload any one of those.'))
        }// this is to check if its an image file. inside the match function there is a regular expression seeing if the ending is ether '.jpg', '.jpeg' or '.png'

        cb(undefined, true)

        //cb = callback
        // cb(new Error('file must be a PDF')) //to send back an error
        // cb(undefined, true) //to accept the upload
        // cb(undefined, false) //to reject the upload
    } ,
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    //req.file.buffer - to access the binary image data
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer() //this is to make the image in that dimensions and a png file
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({ error: error.message }) // this function is to handle errors by sending now html but send a json error message
})

//to delete a profile pic
router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//To see the image in the browser
router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar){
            throw new Error('Cant find user or user doesnt have an avatar')
        }

        res.set('Content-Type', 'image/png') //this is a header to let server know the type of data we are recieving
        res.send(user.avatar)
    } catch (e){
        res.status(404).send()
    }
})








module.exports = router