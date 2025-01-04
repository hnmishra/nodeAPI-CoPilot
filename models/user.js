import { getDatabase } from '../database.js';
import bcrypt from 'bcryptjs';

const users = [];
const db = getDatabase();

export async function createUser(email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        const info = stmt.run(email, hashedPassword);
        const user = { id: info.lastInsertRowid, email: email  };
        console.log('User created:', email);
        return user;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}
export async function verifyUserCredentials(email, password) {
    
        const user = findUserByEmail(email);
        if (!user) {
            console.log('User not found:', email);
            return false;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log('Password match for user:', email);
            return true;
        } else {
            console.log('Password does not match for user:', email);
            return false;
        }
   
}

export function findUserByEmail(email) {
    try {
        const emailParam = email;
        const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
        const user = stmt.get(emailParam);
      //  console.log('User found:', user);
        return user;
    } catch (err) {
        console.error('Error finding user:', err);
        throw err;
    }
}