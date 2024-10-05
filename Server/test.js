require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } =require("./Models/adminSchema");
const {User} = require('./Models/userSchema')

mongoose.connect(process.env.MONGODB_URI);
 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', () => console.log('Connected Successfully'));

// Sample function to add a message
// async function addMessageToChat(userId, message, position) {
//     try {
//         // Find the specific admin and chat
//       const admin = await Admin.findOne({"chatList.user": userId})
    
//       if(admin){
//         await Admin.updateOne(
//             { 
//               "chatList.user": userId // Find the chat for the specific user
//             },
//             {
//                 $push: {
//                     "chatList.$.messageList": {
//                         _id: new mongoose.Types.ObjectId(),  // Generates a new ObjectId for the message
//                         position: position, // Defaults to 'left' if no position is provided
//                         text: message.text,
//                         isRead: message.isRead, // Default value, can change based on your logic
//                         date: message.date
//                     }
//                 },
//                 $set: {
//                     "chatList.$.lastMessage": message.text,
//                     "chatList.$.lastMessageDate": message.date,
//                     "chatList.$.unReadMessage": 0
//                 }
//             },
//             { new: true, upsert: true }
//         );
//         console.log("Message added to existing chat.");
//       }else{
//         await Admin.updateOne(
//           {},
//           {
//               $push: {
//                   chatList: {
//                       title: `Chat with user ${userId}`,  // Adjust the title as needed
//                       user: userId,
//                       lastMessage: message.text,
//                       lastMessageDate: message.date,
//                       unReadMessage: 0,
//                       messageList: [{
//                           _id: new mongoose.Types.ObjectId(),
//                           position: position,
//                           text: message.text,
//                           isRead: message.isRead,
//                           date: message.date
//                       }]
//                   }
//               }
//           }
//         );
//         console.log("New chat created and message added.");
//       }
//     } catch (error) {
//         console.error('Error adding message:', error);
//     }
// }

// const messageObject={
//     text: 'Hey how are you doing',
//     senderId: "66fe42aaf70b511289453de8",
//     recipientId: 'admin',
//     role: 'user',
//     date: new Date(),
//     isRead: true
// }

// addMessageToChat(messageObject.senderId, messageObject, 'right')

// Sample function to add a message to a user's message list
async function addMessageToUser(userId, message, position) {
    try {
      // Step 1: Find the user by userId
      const user = await User.findById(userId);
  
      if (user) {
        // Step 2: Push the new message to the messageList array
        await User.updateOne(
          { _id: userId },
          {
            $push: {
              messageList: {
                _id: new mongoose.Types.ObjectId(),  // Unique ID for the message
                text: message.text,                  // Message text
                position: position, // Defaults to 'left'
                isRead: message.isRead,                        // Defaults to unread
                date: message.date                     // Timestamp for the message
              }
            }
          }
        );
        console.log('Message added to the user\'s messageList.');
      } else {
        console.log('User not found.');
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
}
  


  const messageObject={
    text: 'Hey how are you doing',
    senderId: "66fe42aaf70b511289453de8",
    recipientId: 'admin',
    role: 'admin',
    date: new Date(),
    isRead: true
}

addMessageToUser(messageObject.senderId, messageObject, 'right')

