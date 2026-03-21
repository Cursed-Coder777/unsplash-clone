require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
    console.log('Testing connection to:', process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('SUCCESS: Connected to DB');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE:', err);
        process.exit(1);
    }
}

test();
