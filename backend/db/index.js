const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
    try {
        // const MONGO_URI = process.env.MONGO_URI;
        // if (!MONGO_URI) {
        //     throw new Error("MongoDB URI is missing");
        // }
        await mongoose.connect("mongodb+srv://admin:mzSsqsuwf4YEmBtQ@test1.hmlk9.mongodb.net/");
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database', error);
        process.exit(1);
    }
}

const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const TallySchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['Sale', 'RevertSale', 'Credit Note', 'Debit Note'], // Allowed values
    },
    amount: {
        type: Number,
        required: true,
    },
    user: {
        type: objectId,
        ref: 'User',
    }
}, {
    timestamps: true
});
const User = mongoose.model('User', UserSchema);
const Tally = mongoose.model('Tally', TallySchema);

module.exports = { connectToDatabase, User, Tally };
