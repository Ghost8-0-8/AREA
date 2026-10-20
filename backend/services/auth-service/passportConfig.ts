
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy, Profile as DiscordProfile } from 'passport-discord';
import { Strategy as SpotifyStrategy, Profile as SpotifyProfile } from 'passport-spotify';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import UserModel from '../user-service/userModel';
import dotenv from 'dotenv';

dotenv.config();

function generateToken(user: any): string {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    discordId: user.discordId,
    googleId: user.googleId,
    spotifyId: user.spotifyId,
    name: user.name,
  };
  return jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: '24h' });
}

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.user._id.toString());
});

passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, undefined);
  }
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY!,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await UserModel.findById(jwt_payload.id);
    return user ? done(null, user) : done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  passReqToCallback: true,
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
}, async (req, accessToken: string, refreshToken: string, profile: GoogleProfile, done: any) => {
  try {
    let user = (req as any).user || await UserModel.findOne({ googleId: profile.id });

    if (user) {
      user.googleAccessToken = accessToken;
      user.googleRefreshToken = refreshToken;
      await user.save();
    } else {
      user = new UserModel({
        googleId: profile.id,
        email: profile.emails?.[0].value,
        name: { first: profile.name?.givenName, last: profile.name?.familyName },
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
      });
      await user.save();
    }

    console.log(user);
    const token = generateToken(user);
    done(null, { user, token });
  } catch (err) {
    done(err, undefined);
  }
}));


passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  callbackURL: process.env.DISCORD_CALLBACK_URL!,
  passReqToCallback: true, 
  scope: ['identify', 'email', 'guilds'],
}, async (req, accessToken: string, refreshToken: string, profile: DiscordProfile, done: any) => {
  try {
    let user = (req as any).user || await UserModel.findOne({ discordId: profile.id });

    if (user) {
      user.discordAccessToken = accessToken;
      user.discordRefreshToken = refreshToken;
      await user.save();
    } else {
      user = new UserModel({
        discordId: profile.id,
        email: profile.email,
        name: { first: profile.username, last: profile.discriminator },
        discordAccessToken: accessToken,
        discordRefreshToken: refreshToken,
      });
      await user.save();
    }

    const token = generateToken(user);
    done(null, { user, token });
  } catch (err) {
    done(err, undefined);
  }
}));

passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  callbackURL: process.env.SPOTIFY_CALLBACK_URL!,
  passReqToCallback: true,
  scope: ['user-read-email', 'user-read-private'],
}, async (req, accessToken: string, refreshToken: string, expires_in: number, profile: SpotifyProfile, done: any) => {
  try {
    let user = (req as any).user || await UserModel.findOne({ spotifyId: profile.id });

    if (user) {
      user.spotifyAccessToken = accessToken;
      user.spotifyRefreshToken = refreshToken;
      await user.save();
    } else {
      const [first, last] = profile.displayName?.split(' ') || [profile.displayName, ''];
      user = new UserModel({
        spotifyId: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: { first: first || 'Unknown', last: last || 'Unknown' },
        spotifyAccessToken: accessToken,
        spotifyRefreshToken: refreshToken,
      });
      await user.save();
    }

    const token = generateToken(user);
    done(null, { user, token });
  } catch (err) {
    done(err, undefined);
  }
}));

export default passport;
