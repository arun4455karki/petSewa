const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    chatList: [
        {
            title: String,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            avatar: String,
            subtitle: String,
            date: mongoose.Schema.Types.Date,
            messageList: [{
                    position: {type: String, enum: ['left', 'right'], default: 'left'},
                    type: { type: String, default: 'text'},
                    isRead: Boolean,
                    date: mongoose.Schema.Types.Date
            
                }]
        }
      
    ]
  });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin