import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
        ] 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['user','admin'], 
        default: 'user' 
    },
}, 
{ 
    timestamps: true 
});

export default mongoose.model('User', userSchema);
