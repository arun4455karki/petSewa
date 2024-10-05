require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const {Server} = require('socket.io');
const {User} = require('./Models/userSchema')
const { Admin } = require('./Models/adminSchema');

// { id: [ socketId, role]}
const userSessions = {}

// Create HTTP server to use with socket.io
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI);
 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', () => console.log('Connected Successfully'));

io.on('connection', (socket) =>{
  const {id} = socket.handshake.query
  if(id){
      userSessions[id] = socket.id
  }
  console.log(`User ${id} connected with socket ID: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    try{
      /*          Data Fromat         */
      // const data={
      //     text: 'Hey how are you doing',
      //     senderId: "66fe42aaf70b511289453de8",
      //     recipientId: 'admin',
      //     date: new Date(),
      //     isRead: true
      // }
      const { senderId, recipientId, role, ...message } = data
      console.log('Message received', message)
      if(recipientId=='admin'){
        // when the users send the message
        console.log(senderId, recipientId)
        await addMessageToAdmin(senderId, message, 'left' )
        await addMessageToUser(senderId, message, 'right')
      }else{
        // when the admin sends the message
        console.log(senderId, recipientId)
        await addMessageToAdmin(recipientId, message, 'right')
        await addMessageToUser(recipientId, message, 'left')
      }
      const recipientSocketId = userSessions[recipientId];
      if (recipientSocketId){
        console.log(recipientSocketId, recipientId)
        io.to(recipientSocketId).emit('receiveMessage', {...message, position: 'left', })
      }
    }catch(err){
      console.log('Message saved and broadcasted')
      socket.emit('errorMessage', 'Message could not be saved')
    }

  })

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id)
  })

})
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


// Sample function to add a message
async function addMessageToAdmin(userId, message, position) {
    try {
        // Find the specific admin and chat
      const admin = await Admin.findOne({"chatList.user": userId})
    
      if(admin){
        const updatedAdmin=await Admin.updateOne(
            { 
              "chatList.user": userId // Find the chat for the specific user
            },
            {
                $push: {
                    "chatList.$.messageList": {
                        _id: new mongoose.Types.ObjectId(),  // Generates a new ObjectId for the message
                        position: position, // Defaults to 'left' if no position is provided
                        text: message.text,
                        isRead: message.isRead, // Default value, can change based on your logic
                        date: message.date
                    }
                },
                $set: {
                    "chatList.$.lastMessage": message.text,
                    "chatList.$.lastMessageDate": message.date,
                    "chatList.$.unReadMessage": 0
                }
            },
            { new: true, upsert: true }
        );
        console.log("Message added to existing chat.");
        // const messageList = updatedAdmin.chatList.filter(item => item.user== userId)[0].messageList
        // return messageList[messageList - 1]
        return
      }
      const updatedAdmin=await Admin.updateOne(
        {},
        {
            $push: {
                chatList: {
                    user: userId,
                    lastMessage: message.text,
                    lastMessageDate: message.date,
                    unReadMessage: 0,
                    messageList: [{
                        _id: new mongoose.Types.ObjectId(),
                        position: position,
                        text: message.text,
                        isRead: message.isRead,
                        date: message.date
                    }]
                }
            }
        },
        {new: true}
      );
      console.log("New chat created and message added.");
      // const messageList = updatedAdmin.chatList.filter(item => item.user== userId)[0].messageList
      // return messageList[messageList - 1]
      return
    } catch (error) {
        console.error('Error adding message:', error);
    }
}

// Sample function to add a message to a user's message list
async function addMessageToUser(userId, message, position) {
  try {
    // Step 1: Find the user by userId
    const user = await User.findById(userId);

    if (user) {
      // Step 2: Push the new message to the messageList array
      const updatedUser=await User.updateOne(
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
      return
      // return updatedUser.messageList[updatedUser.messageList.length - 1]
    }
      
    console.log('User not found.');
    
  } catch (error) {
    console.error('Error adding message:', error);
  }
}
