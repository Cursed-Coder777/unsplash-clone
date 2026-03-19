import mongoose from 'mongoose';

function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI as string).then(() => {
        console.log('Connected to DB');
    }).catch((err: Error) => {
        console.log(err);
    });
}

export { connectToDb }