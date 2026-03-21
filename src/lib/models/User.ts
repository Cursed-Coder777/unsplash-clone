import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    
    // Profile fields
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    paypal: { type: String, default: '' },
    messageEnabled: { type: Boolean, default: false },
    hireEnabled: { type: Boolean, default: false },
    interests: [{ type: String }],
    
    // Social counts
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    photosCount: { type: Number, default: 0 },
    
    otp: {
        code: { type: String },
        expiresAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);