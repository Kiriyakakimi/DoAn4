import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();
const SECRET_KEY = 'emiton'; // Use a more secure secret key in production

// Đăng ký (Registration)
router.post('/register', async (req, res) => {
    const { name, email, password, birthDate, gender } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !birthDate || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            birthDate,
            gender,
        });

        // Save the user to the database
        await newUser.save();

        // Respond with user data excluding password
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            birthDate: newUser.birthDate,
            gender: newUser.gender,
        });
    } catch (error) {
        console.error('Error during registration:', error); // Logs error for debugging
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Đăng nhập (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Respond with token and user data
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error during login:', error); // Logs error for debugging
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

export default router;
