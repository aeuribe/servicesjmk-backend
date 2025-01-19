const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.hostinger.com',
        port: 465,
        auth:{
            user:'noreply@servicesjmk.com',
            pass:'NoReply-2025'
        }

    }

);

function sendMail(to,sub,msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg,

    });

    console.log("email sent")
}

sendMail("noreply@servicesjmk.com","Este es el asunto","Este es el mensaje");