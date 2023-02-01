import jwt from 'jsonwebtoken';

 const authentication = (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : null
    if (token == null) return res.status(400).send({ message: "Access Token inValid" });

    jwt.verify(token,process.env.JWT_ACCESS_TOKEN_SECRET, (err,decoded) => {
      if (err) return res.status(401).send({ message: "Unauthorized Access Token inValid" })
      res.locals.data = decoded;
      next();
    })
  };

  export default  authentication;