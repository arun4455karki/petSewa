const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    chatList: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            lastMessage: String,
            lastMessageDate: mongoose.Schema.Types.Date,
            unReadMessage: Number,
            messageList: [{
                    _id: {type: mongoose.Schema.Types.ObjectId},
                    text: String,
                    position: {type: String, enum: ['left', 'right'], default: 'left'},
                    isRead: Boolean,
                    date: mongoose.Schema.Types.Date
                }]
        }
      
    ]
  });

const Admin = mongoose.model('Admin', adminSchema);

module.exports =  {Admin}