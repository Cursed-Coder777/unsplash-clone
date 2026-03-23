import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },

    // OAuth fields
    googleId: { type: String, default: '' },
    provider: { type: String, default: 'credentials' }, // 'credentials' | 'google'

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

    // Bookmark field - array of photo IDs
    bookmarks: [{
        photoId: { type: String, required: true },
        savedAt: { type: Date, default: Date.now },
        photoData: { type: Object, default: null }
    }],

    // Like field
    likedPhotos: {
        type: [{
            photoId: { type: String, required: true },
            likedAt: { type: Date, default: Date.now }
        }],
        default: []
    },
    otp: {
        code: { type: String },
        expiresAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);