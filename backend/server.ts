import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import router from './services/router';
import execute from "./services/areas/areaExecution";
import cors from 'cors';
import { get_about } from './about';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

console.log(MONGO_URI);

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "area" });
    app.use('/api', router);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      
      console.log(`http://localhost:${PORT}`);
    });

    app.get('/about.json', (req, res) => {
      const about = get_about(req, res);
      res.json(about);
    });

    execute.action_execute();

  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
};

startServer();