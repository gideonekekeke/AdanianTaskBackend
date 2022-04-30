//import the usermodel
const userModel = require('../Model/UserMode')
const {v4} = require('uuid')
const express = require('express')
const bcypt = require('bcrypt')
const jwt =  require('jsonwebtoken')
const router = express.Router()




// verify user token and return the user data

const verification = (req, res, next) => {
	try {
		const authToken = req.headers.authorization;

		if (authToken) {
			const token = authToken.spit(" ")[2]

			jwt.verify(token, "ThiSiSthEsEcREtEkEyee", (error, payload) => {
				if (error) {
					res.status(400).json({ message: "please check your token" });
				} else {
					req.user = payload;

					next();
				}
			});
		} else {
			res.status(400).json({ message: "something is wrong with this token" });
		}
	} catch (err) {
		res.status(400).json({ message: "an error occured" });
	}
};

//creating the method to get all users
router.get('/users' , async(req, res)=>{
    try{
            const getUsers = await userModel.find()
        res.status(200).json({
            message : "Successful",
            data : getUsers
        })

    }catch(err){
        res.status(404).json({
            message : "an error occured"
        })
    }
})




//creating the method to get all users by id
router.get('/users/:id', async(req, res)=>{
    try{

        const getUsersById = await userModel.findById(req,params.id, req.body)
        res.status(200).json({
            message : "Successful",
            data : getUsersById
        })

    }catch(err){
        res.status(404).json({
            message : "an error occured or invalid id"
        })
    }
})


//creating the registration router for all users..... jwt (for token generating) , bcypt(for hashing password)

router.post("/register",  async(req, res)=>{
    try{
        const {userName, email, password, userID} = req.body


        // this function is checking for an already existing email in the platform
        const checkEmail = await userModel.findOne({email : email})
        if(checkEmail){
            return res.json({
                message : "email already been used "
            })
        }

         

       

        // getting random hashpasswords from bcrypt
        const salt = await bcypt.genSalt(10)
        const hashpassword = await bcypt.hash(password, salt)
        

        const RegisterUser = await userModel.create({
            userName,
            email,
            password : hashpassword,
            userID : v4()
        })

        res.status(201).json({
            message : "Registered successfully",
            data : RegisterUser
        })

    }catch(err){
          res.status(404).json({
            message : "an error occured"
        })
    }
})





// signin a user and generate a token for the user

router.post("/signin", async (req, res) => {
	try {
		const { email , password} = req.body;

		const user = await userModel.findOne({ email });


        //checking if the password is correct and comparing it
		if (user) {
			const checkPassword = await bcypt.compare(
				password,
				user.password,
			);

			if (checkPassword) {
				const { password, ...info } = user._doc;

				const token = jwt.sign(
					{
						id: user._id,
						email: user.email,
						userName: user.userName,
						
					},
					"ThiSiSthEsEcREtEkEyee",
					{ expiresIn: "1d" },
				);

			return	res.status(200).json({
					message: `welcome back ${user.userName}`,
					data: { ...info, token },
				});
			} 
		} else {
		return	res.status(404).json({ message: "user not found" });
		}
	} catch (err) {
		return res.status(400).json({ message: "an error occured" });
	}
});


module.exports = router