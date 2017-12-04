let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"stuart.wilcox15@gmail.com",
    pass:"*******"
  }
});

module.exports.sendMail = function(recipientEmail, activationUrl){
  let mailOptions = {
    from:"stuart.wilcox15@gmail.com",
    to:recipientEmail,
    subject:"Account Activation",
    text:"Please follow this link to activate your account: "+activationUrl
  }

  transporter.sendMail(mailOptions, function(err, info){
    if(err){
      console.log(err);
      return false;
    }else{
      console.log('Email sent: '+info.response);
      return true;
    }
  });
}
