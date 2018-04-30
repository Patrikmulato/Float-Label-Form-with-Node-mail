const express = require('express');
const bodyParser = require('body-parser');
const expresshandlebars = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();


// View engine
app.engine('handlebars' , expresshandlebars());
app.set('view engine' , 'handlebars');

//Static Folder
app.use('/public' , express.static(path.join(__dirname , 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req , res) => {
  res.render("contact");
});

app.post('/send' , (req ,res) => {
  const output = `
  <p>You have a new message</p>
  <h3>Details</h3>
  <ul>
    <li>First Name: ${req.body.FirstName}</li>
    <li>Last Name: ${req.body.LastName}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.cell}</li>
  </ul>
  <h3>Comment</h3>
  <p>${req.body.comments}</p>
  `;

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'test@example.com', // generated ethereal user
            pass: 'example' // generated ethereal password
        },
        tls: {
          rejectUnathorized:false  // If localhost
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Node Mailer 👻" <test@kavegepdepo.com', // sender address
        to: 'example@gmail.com', // list of receivers
        subject: 'Node mail', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.render('contact' , {msg:'Email has been sent!'})
    });
});

app.listen(3000 , () => console.log('Server started...'));
