import express from 'express';
import passport from './passportConfig';
const bodyParser = require('body-parser');
import authController from './authController';
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport';

const authRouter = express.Router();

authRouter.use(bodyParser.json());

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password/:token', authController.resetPassword);
authRouter.get('/user-info', passport.authenticate('jwt', { session: false }), authController.getUserInfo);

authRouter.get('/google', passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
  ],
  accessType: 'offline',
  prompt: 'consent'
}));

authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req: any, res) => {
  const token = req.user.token;
  res.redirect(`http://localhost:8081/features/auth/google-auth?token=${token}`);
});

authRouter.get('/discord', passport.authenticate('discord'));

authRouter.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req: any, res) => {
  const token = req.user.token;
  res.redirect(`http://localhost:8081/features/auth/discord-auth?token=${token}`);
});

authRouter.get('/spotify', passport.authenticate('spotify', {
  scope: [
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-modify-playback-state'
  ]
}));

authRouter.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req: any, res) => {
  const token = req.user.token;
  res.redirect(`http://localhost:8081/features/auth/spotify-auth?token=${token}`);
});

export default authRouter;