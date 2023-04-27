const express = require('express');

const router = express.Router();

const User = require('./../models/User');
const UserVerification = require('./../models/UserVerification');

const nodemailer = require('nodemailer');

const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcrypt');
const path = require("path");
let transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

transporter.verify((error, success) => {

    if (error) {
        console.log(error);
    } else {

        console.log("ready for messages");
        console.log(success);
    }
})


require("dotenv").config();


// sign in

router.post('/signup', (req, res) => {
    console.log("inside signup")

    let { name, email, password, NgoID } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    NgoID = NgoID.trim();

    if (name == "" || email == "" || password == "" || NgoID == "") {

        res.json({

            status: "FAILED",
            message: "Empty input fields !"
        });

    } else if (!/^[a-zA-Z ]*$/.test(name)) {

        res.json({

            status: "FAILED",
            message: "Invalid name entered"

        });

    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {

        res.json({

            status: "FAILED",

            message: "Invalid email"

        });

    } else if (password.length < 8) {
        res.json({

            status: "FAILED",

            message: "Password is too short !"

        });
    } else {

        User.find({ email }).then(result => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "Email is already in use please try with different email    "
                })
            } else {

                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {

                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        NgoID,
                        verified: false,
                    });

                    newUser.save().then(result => {
                        sendVerificationEmail(result, res);
                    })
                })
                    .catch(err => {
                        res.json({
                            
                            status: "FAILED",
                            message: "Email is already in use please try with different email   ",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user account"
                        })
                    })
            }

        }).catch(err => {

            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }
});

const sendVerificationEmail = ({ _id, email }, res) => {
    //url to be used in email
    console.log("inside")
    const currentUrl = "http://localhost:5000/";
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete signup process and login to your account.</p> <P>This link <b>expires in 6 hours<b>.</p> <p> Press <a href=${"http://localhost:3000/#/" + "user/verify/" + _id + "/" }>here </a> to proceed. </p>`,

    };

    const saltRounds = 10;
    bcrypt
        .hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {

            const newVerification = new UserVerification({
                userID: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,
            });

            newVerification
                .save()
                .then(() => {
                    transporter.sendMail(mailOptions)
                        .then(() => {
                            res.json({
                                status: "PENDING",
                                message: "Verification email sent"
                            });
                        })
                        .catch((error) => {
                            console.log(error);

                            res.json({
                                status: "FAILED",
                                message: "Verification email failed"
                            });
                        })
                }).
                catch((error) => {
                    console.log(error);
                    res.json({

                        status: "FAILED",
                        message: "Coudln't save verified data"
                    });
                })
        })

        .catch(() => {
            res.json({

                status: "FAILED",
                message: "An error occured while hashing email data"
            });
        })
};



router.get("/verify/:userID/:uniqueString", (req, res) => {

    let { userID, uniqueString } = req.params;

    UserVerification.find({ userID })
        .then((result) => {
            if (result.length > 0) {

                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;

                if (expiresAt < Date.now()) {
                    UserVerification.deleteOne({ userID })
                        .then(result => {
                            User.deleteOne({ _id: userID })
                                .then(() => {
                                    let message = "Link has expired please sign up again";
                                    res.redirect(`/user/verified/error=true &message=${message}`);
                                })
                                .catch((error) => {
                                    let message = "An error occured while clearing expired user verification record.";
                                    res.redirect(`/user/verified/error=true &message=${message}`);
                                })
                        })
                        .catch((error) => {
                            console.log(error);
                            let message = "An error occured while clearing expired user verification record.";
                            res.redirect(`/user/verified/error=true &message=${message}`);
                        })
                } else {
                    bcrypt.compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                User.updateOne({ _id: userID }, { verified: true })
                                    .then(() => {
                                        UserVerification.deleteOne({ userID })
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, "./..views/verified.html"));
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                let message = "An error occured while finalizing verification.";
                                                res.redirect(`/user/verified/error=true &message=${message}`);
                                            })
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        let message = "An error occured while updating user record.";
                                        res.redirect(`/user/verified/error=true &message=${message}`);
                                    })
                            } else {

                                let message = "Invalid verification details passed.";
                                res.redirect(`/user/verified/error=true &message=${message}`);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            let message = "An error occured while comparing unique strings.";
                            res.redirect(`/user/verified/error=true &message=${message}`);
                        })
                }

            } else {
                let message = "Account record doesn't exist or has been verified already please sign up or log in.";
                res.redirect(`/user/verified/error=true &message=${message}`);
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "An error occured while checking for existing user.";
            res.redirect(`/user/verified/error=true &message=${message}`);

        })

});

router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"));
})

//to update adminVerified Variable
router.get('/:id/:id2',async(req,res)=>{

   // const {id,id2}=req.params;
   //console.log('hiti')
   const {id,id2}=req.params;
   
   if(id2==1)
   {
        const user=await User.findById(id);
        user.adminVerified='2';
        await user.save();
       

   }
   else{
    const user=await User.findById(id);
    user.adminVerified='0';
    await user.save();
    

   }
   allUsers=await User.find({});
   //send new data of users
    res.status(200).send({allUsers})
    
    
})


//signin

router.post('/signin', (req, res) => {

    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {

        res.json({

            status: "FAILED",
            message: "Empty credentials !"
        });

    } else {
        const user=User.find({email})
        if(!user){
            res.json({
                status:"FAILED",
                message:"User doesn't exist"
            })
        }
      

        User.find({ email })
            .then(data => {
                if (data.length) {

                        
                    if(!data[0].verified){
                        res.json({
                            status: "FAILED",
                            message: "Email has not been verified"
                        })
                    }else{
                        const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if (result) {
                            
                            if(data[0].adminVerified=='1')
                            {
                                res.json({
                                    status: "FAILED",
                                    message: "Admin pending"
                                })
                            }
                            else if(data[0].adminVerified=='0'){
                                res.json({
                                    status: "FAILED",
                                    message: "Admin rejected your request"
                                })

                            }
                            else {
                                res.json({
                                    status: "SUCCESS",
                                    message: "Sign in successful",
                                    data: data
                                })
                            }
                           
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Incorrect Password"
                            })
                        }
                    })
                        .catch(err => {


                            res.json({
                                status: "FAILED",
                                message: "An error occured"
                            })
                        })
                }
                    }

                    
                else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid Credentials"
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occured"
                })
            })
    }
})

   //getallcards
   router.get('/getuser',async (req,res)=>{
    User.find({}).exec()
     .then(p=>{
         res.status(200).json(p)
     })
     .catch(error=>console.log(error));
   })

//update user
router.post('/verifyuser/:userId', 
  
    async (req, res) => {
        try {
            const userId = req.params.userId;
           await User.findOneAndUpdate({
              _id:userId
            },{
              $set:{
                verified:true
              }
            })
           const user=await User.find({_id:userId});
            res.json({message:"success",user:user});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

module.exports = router;