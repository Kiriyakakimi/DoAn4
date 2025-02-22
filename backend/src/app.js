import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './controllers/authController.js';
import userRoutes from './controllers/userController.js';
import postRoutes from './controllers/postController.js';
import groupRoutes from './controllers/groupController.js';
import messageRoutes from './controllers/mesController.js';
import notifiRoutes from './controllers/notifiController.js';
const app = express();

// Enable CORS for your frontend (localhost:3000)
app.use(cors({
    origin: 'https://zafacook.netlify.app', // Allow only requests from localhost:3000
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/groups', groupRoutes);
app.use('/messages', messageRoutes);
app.use('/notifications', notifiRoutes);

mongoose.connect('mongodb+srv://vyvictory:1234567899@cluster0.vahim.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful connection
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
