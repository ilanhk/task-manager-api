const sgMail = require('@sendgrid/mail')// Sendgrid Api that allows a user to send emails



sgMail.setApiKey(process.env.SENDGRID_API_KEY) //all caps is convention when making an enviroment variable


const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'ilanlieberman@hotmail.com', //future use a custom domain or email for that account
        subject: 'Welcome to the Task Manager App!',
        text: `Welcome to the Task Manager App ${name}! Let us know how you get along with the app :)`,
        // html: ''//can make an email message like an html document with images etc.. but text email better because more open/sent rate because looks more real then a marketing looking email
    }) // back ticks found on the left of 1 on the keyboard allows you to add arguments/varaibles in a string with '${}'
}


const sendCancelationEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'ilanlieberman@hotmail.com',
        subject: 'Your Acount has been Deleted from the Task Manager App',
        text: `Hi ${name}, your Task Manager account has been deleted as requested. If you have the time please let us know the reason for your cancelation so we can improve out customer experience. Thank you and have a nice day! :)`,
    }) 
}



// sgMail.send({
//     to: 'ilanlieberman@hotmail.com',
//     from: 'ilanlieberman@hotmail.com',
//     subject: 'MANAGER APP',
//     text: 'Hello hello!'
// }).then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}// this is how you export multiple functions