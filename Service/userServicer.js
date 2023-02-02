
import generateToken from '../Utils/tokenGenerator';
import authentication from '../Utils/authentication';
import userModal from '../Modal/userModal';
import jwt from 'jsonwebtoken';
import fetch, {Headers} from 'node-fetch';

const getUserRoutes = (router) => {

    router.route('/').get((req, res) => res.send('Sample Node Application'));
    router.route('/ping').get((req, res) => res.send({ status: 'active', time: new Date() }));

    router.route('/create-user').post(async (req, res) => {
        try {
            console.log("create-user")
            const { firstName, lastName, email, password, phone } = req.body;
            const userExists = await userModal.findOne({ email });
            if (userExists) {
                res.status(400).send({ message: 'Email already registered' });
            }
            const user = await userModal.create({
                firstName,
                lastName,
                email,
                phone,
                password: password,
            });
            console.log("user",user)
            const data = {
                user: user,
                message: "Signup Successfully",
                accessToken: generateToken(user._id, 'access'),
                refreshToken: generateToken(user._id, 'refresh'),
            };
            res.status(200).send(data)
        } catch (err) {
            console.log("err",err)
            res.status(500).send({ message: err.message });
        }
    });

    router.route('/login').post(async (req, res) => {
        try {
            console.log("login")
            const { email, password } = req.body;
            const user = await userModal.findOne({ email: email });
            if (!user) {
                res.status(404).send({ message: 'user Not Found' });
            }
            if (user.password.toString() === password) {
                await user.save();
                const data = {
                    user: user,
                    message: 'Signin Successfully',
                    accessToken: generateToken(user._id, 'access'),
                    refreshToken: generateToken(user._id, 'refresh'),
                };
                res.status(200).send(data);
            } else {
                res.status(401).send({ message: 'Password Incorrect' });
            }
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

    router.route('/get-user/:id').get(authentication, async (req, res) => {
        try {
            const id = req.params.id;
            const user = await userModal.findById(id);
            if (!user) {
                res.status(400).send({ message: 'User Not Found' });
            }
            res.status(200).send({user, message: 'user getById Successfully'});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/refresh-token').post(async (req, res) => {
        const { token } = req.body;
        if (token == null) return res.status(400), send({ data: { message: "Refresh Token inValid" } })
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(401).send({ data: { message: "Unauthorized Refresh Token inValid" } })
            const token = generateToken(decoded.id, 'access');
            return res.status(200).send({ token });
        });
    });

    router.route('/getall').get(async (req, res) => {
        try {
            const user = await userModal.find();
            res.status(200).send({ data: user, message: "Get All user" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/getall-user').get(async (req, res) => {
        try {

            await fetch('https://gorest.co.in/public/v2/users')
                .then(resp => resp.json())
                .then(data => {
                    res.status(200).send({ data, message: "Get All user by external api" });
                }).catch(err => {
                    console.log("errr", err);
                })

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })
    router.route('/post').post(authentication, async (req, res) => {
        try {
            const { title, body, user_id } = req.body;
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify({
                "title": title,
                "body": body,
                "user_id": user_id
            });
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            const response = await fetch("https://gorest.co.in/public/v2/posts", requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "Post successfull submitted" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/post/:id').put(authentication, async (req, res) => {
        try {
            const id = req.params.id
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify(req.body);
            
            var requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            const response = await fetch(`https://gorest.co.in/public/v2/posts/${id}`, requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "Post successfull submitted" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/post/:id').get(authentication, async (req, res) => {
        try {
            const id = req.params.id
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
            
            
            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };
            
            const response = await fetch(`https://gorest.co.in/public/v2/posts/${id}`, requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "Post successfull submitted" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/post').get(authentication, async (req, res) => {
        try {
            const id = req.params.id
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
            
            
            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };
            
            const response = await fetch(`https://gorest.co.in/public/v2/posts`, requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "GetAll Post successfull" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/comment/:id').put(authentication, async (req, res) => {
        try {
            const id = req.params.id
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify(req.body);
            
            var requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            const response = await fetch(`https://gorest.co.in/public/v2/comments/${id}`, requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "Post successfull updated" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/comment/:id').get(authentication, async (req, res) => {
        try {
            const id = req.params.id
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
        
            
            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };
            
            const response = await fetch(`https://gorest.co.in/public/v2/comments/${id}`, requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "Get Comment by id successfull" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/comment').post(authentication, async (req, res) => {
        try {
            const { body, name, post_id, email } = req.body;
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify({
                    "post_id": post_id,
                    "name": name,
                    "email": email,
                    "body": body
            });
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            const response = await fetch("https://gorest.co.in/public/v2/comments", requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "Comment successfull Submitted" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    router.route('/comment').get(authentication, async (req, res) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer 45dd03c1ddd5a85933743fb7c5ef2e5698d5eeb1917f766126b1cd793a6b393c");
            myHeaders.append("Content-Type", "application/json");
            
            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };
            
            const response = await fetch("https://gorest.co.in/public/v2/comments", requestOptions)
            if(response.ok) {
                const data = await response.json()
                res.status(200).send({ data, message: "GetAll Comments successfull" });
            } else {
                const message = await response.json()
                res.status(400).send({ message });
               
            }

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })
    return router;
}

export default getUserRoutes;