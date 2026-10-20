import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    resetPasswordToken?: string;
    resetPasswordExpiry?: number;
    name: {
        first: string;
        last: string;
    };
    googleId?: string;
    discordId?: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    discordAccessToken?: string;
    discordRefreshToken?: string;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    spotifyId?: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true},
    password: { type: String},
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Number },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },
    googleId: { type: String },
    discordId: { type: String },
    googleAccessToken: { type: String },
    googleRefreshToken: { type: String },
    discordAccessToken: { type: String },
    discordRefreshToken: { type: String },
    spotifyAccessToken: { type: String },
    spotifyRefreshToken: { type: String },
    spotifyId: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema);