// src/lib/models/Collection.ts
import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    photos: [{
        photoId: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
        photoData: { type: Object }
    }],
    coverPhoto: {
        type: String,
        default: ''
    },
}, { timestamps: true });

export default mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
