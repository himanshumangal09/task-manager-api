const sgMail = require('@sendgrid/mail')
//const sendgridAPIkey='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'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.send({
    to:'himanshu9555548291@gmail.com',
    from:'himanshu8076504461@gmail.com',
    subject:'first creation',
    text:'hoping for the real magic'
})
const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'himanshu8076504461@gmail.com',
        subject:'thanks for joining',
        text:`Hi ${name}, Welcome to the world of task management!!.`
    })
}
const sendGoodByEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'himanshu8076504461@gmail.com',
        subject:'feedbaack',
        text:`Hi ${name}, can you please provide your feedback .Have a nice day.`
    })
}
module.exports={
    sendWelcomeEmail,
    sendGoodByEmail
}