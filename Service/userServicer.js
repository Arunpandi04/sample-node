
const generateToken = require('../Utils/tokenGenerator');
const authentication = require('../Utils/authentication')
const userModal = require('../Modal/userModal');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const getUserRoutes = (router) => {
    router.route('/').get( (req, res) => res.send('Sample Node Application'));
    router.route('/ping').get( (req, res) => res.send({ status: 'active', time: new Date() }));
    
    router.route('/create-user').post( async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            const userExists = await userModal.findOne({ email });
            if (userExists) {
                res.status(400).send({message: 'Email already registered'});
            }
            const user = await userModal.create({
                firstName,
                lastName,
                email,
                password: password.toString(),
            });
            const data = {
                user: user,
                message: "Signup Successfully",
                accessToken: generateToken(user._id,'access'),
                refreshToken: generateToken(user._id,'refresh'),
            };
            res.status(200).send(data)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

    router.route('/login').post( async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModal.findOne({ email: email });
            if(!user) {
                res.status(404).send({message: 'user Not Found'}); 
            }
            if(user.password.toString() === password) {
                await user.save();
            const data = {
                user: user,
                message: 'Signin Successfully',
                accessToken: generateToken(user._id,'access'),
                refreshToken: generateToken(user._id,'refresh'),
            };
                res.status(200).send(data); 
            } else{
                res.status(401).send({message: 'Password Incorrect'});
            }
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

    router.route('/get-user/:id').get(authentication,async(req,res) => {
        try {
            const id = req.params.id;
            const user = await userModal.findById(id);
            if(!user) {
                res.status(400).send({message: 'User Not Found' });
            }
            res.status(200).send(user);
        } catch(error) {
            res.status(500).send({message: error.message});
        }
    })

    router.route('/refresh-token').post( async (req, res) => {
        const { token } = req.body;
        if (token == null) return res.status(400),send({data: { message: "Refresh Token inValid" }})
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
             if (err) return res.status(401).send({data: { message: "Unauthorized Refresh Token inValid" }})
             const token = generateToken(decoded.id,'access');
             return res.status(200).send({token});
         });
    });

    router.route('/getall').get( async (req, res) => {
        try {
            const user = await userModal.find();
              res.status(200).send({data:user, message:"Get All user"}); 
            } catch(error) {
                res.status(500).send({message: error.message});
            }
    })
      
    return router;
}

module.exports = getUserRoutes;