import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
    photoId: { type: String, required: true, unique: true },
    likesCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models.Photo || mongoose.model('Photo', photoSchema);