const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT //we set up an enviroment variable under the config folder that makes PORT=3000 locally but in heroku PORT would be something else





app.use(express.json())
app.use(userRouter) 
app.use(taskRouter)
// need these line for routers to work
//routers are pretty much the same like app. all the routers you see were created in this file with app but moved to their own files and app was replaced with router(in the beginning of each router)
//router files allow us to create more complex applications to be run on index.js instead of everything to be run on index.js with app.



app.listen(port, ()=>{
    console.log('Server is up on port '+ port)
})












//We use middleware to customize our server to fit our needs.

// app.use((req, res, next)=>{
//     if (req.method === 'GET'){
//         res.send('GET requests are disabled')
//     } else {
//         next()// make sure this runs or route handlers will not run (you dont want next to run if its not authenticated and needs to be)
//     }
    
// }) //this function is for middleware

//Middleware fucntion for Maintenance
// app.use((req, res, next)=>{
//     res.status(503).send('503 Sorry the website is under maintenance! Please check back soon :)')
// })



//This is how user and task models can be related and get info from each other
// const main = async ()=>{
//     // how to find the user object from Task model
//     // const task = await Task.findById('60633b9e149f4218a815deaf')
//     // await task.populate('owner').execPopulate() // populate allows us to make owner from an id to the actual object that its referencing from
//     // console.log(task.owner)

//     //How to find the Task object from User model
//     // const user = await User.findById('606339f67bf3102530292484')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)  
// }
// main()




// const jwt = require('jsonwebtoken')


// const myfunction = async ()=>{
//     const token = jwt.sign({ _id:'124d' }, 'thisisasecret', { expiresIn: '7 days'}) //this creates a token. sign() takes an object (a unique identifer for a user to be authenticated(users id, email ...)), second argument is a string signature (called a secret) to verify the token. You can also make the token last for a limited time(seconds, minutes, hours, days, months ...ect)
//     console.log(token)

//     const data = jwt.verify(token, 'thisisasecret') // to verify the token
//     console.log(data)

// }

// myfunction()



//Example function for hashing passwords and check if the password is correct
// const myfunction = async ()=>{
//     const password = 'Red12345!'
//     const hashedPassword = await bcrypt.hash(password, 8) //second argument is how many rounds to run the hashing code(8 rounds is recommended)

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatched = await bcrypt.compare(password, hashedPassword) //compare takes in a password(which it will be hashed ) and the hash password you want to compare if identical. It returns a booleen true its a match. If it doesnt the password is wrong.
//     console.log(isMatched)
// }

// myfunction()
// //hashing is one way cant reverse it to decrypt it.





