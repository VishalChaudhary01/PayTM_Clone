import jwt from 'jsonwebtoken'

const isAuth = (req, res, next) => {
     const authHeader = req.headers.authorization;

     if (!authHeader || !authHeader.startsWith('Bearer')) {
          return res.status(403).json({ message: "No token found" });
     } 

     const token = authHeader.split(' ')[1];

     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.userId = decoded.userId;

          next();
     } catch (error) {
          return res.status(403).json({ message: "Invalid token" });
     }
}

export default isAuth;