import { createUser, findUserByEmail } from '../models/user.js';
import validator from 'validator';
import { verifyUserCredentials } from '../models/user.js';
import { generateToken } from '../util/auth.js';

export async function signup(req, res) {
    const { email, password } = req.body;

    if (!email || !password || validator.isEmpty(email.trim()) || validator.isEmpty(password.trim())) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (await findUserByEmail(email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await createUser(email, password);
        const token = generateToken(user);
        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password || validator.isEmpty(email.trim()) || validator.isEmpty(password.trim())) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const isMatch = await verifyUserCredentials(email, password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = await findUserByEmail(email);
        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error verifying user credentials:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
