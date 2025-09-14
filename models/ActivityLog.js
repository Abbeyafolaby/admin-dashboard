import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: false 
    }, // may be null for unauth actions
    actionType: { 
        type: String, 
        required: true 
    }, // e.g. login_success, login_failed, create_user, update_role, delete_user, read_stats
    meta: { 
        type: mongoose.Schema.Types.Mixed 
    }, // any extra metadata (route, entity id, details)
    ip: { 
        type: String 
    },
    userAgent: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
});

export default mongoose.model('ActivityLog', activityLogSchema);