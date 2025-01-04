import jwt from 'jsonwebtoken';

const secretKey = 'abctesttoken123'; // Replace with your actual secret key

export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}

export function verifyToken(token) {
 
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    
}

export function authenticate(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token (is convention to send token in this format)
    console.log(token);
    if(token == null){
        return res.sendStatus(401).json({message: 'Missing authorization token'});
    }
    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }catch(err){
        return res.sendStatus(403);
    }
}