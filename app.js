import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import { initializeDatabase } from './database.js';
import eventRoutes from './routes/events.js';
import cors from 'cors';
let app;
try {
    app = express();
    app.use(cors());
    app.use(express.static('public')); //with cors and static we can excess the public images from outside (domain) like http://localhost:3000/images/1735967761803-Designer.jpeg
    app.use(express.json());
    app.use(bodyParser.json()); // Uncommented body-parser middleware
    app.use('/users', userRoutes);
    app.use('/events', eventRoutes);
    console.log("Evnet rount crated");
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { // Changed hardcoded port to use PORT variable
    try {
        const db = initializeDatabase();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
});
