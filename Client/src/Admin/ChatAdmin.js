import 'react-chat-elements/dist/main.css';
import { MDBContainer } from 'mdb-react-ui-kit';
import { ChatItem, MessageList, Navbar } from 'react-chat-elements';
import CustomChatInput from '../Components/Chat/CustomChatInput';
import {useState} from 'react'
const messageExampleObject = [
    {
        chatListItemId: 'somerandom Message3',
        title: 'Person of the Year',
        avatar: 'YO ho',
        lastMessage: "You don't know this",
        unReadMessages: 3,
        lastMessageDate: new Date(),
        messageList: [
            {
                messageId: 'arakdaf',
                position: 'left',
                text: "Yo Man Whats Up ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            }
        ],
    },

    {
        chatListItemId: 'somerandom Message',
        title: 'Name of the person',
        avatar: 'Some Random Avatar',
        lastMessage: "the last sent or received message",
        unReadMessages: 2,
        lastMessageDate: new Date(),
        messageList: [
            {
                messageId: 'arakdaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                type: 'text'
            }
        ],
    },

    {
        chatListItemId: 'hello Message',
        title: 'Name of the person',
        avatar: 'Some Random Avatar',
        lastMessage: "the last sent or received message",
        unReadMessages: 2,
        lastMessageDate: new Date(),
        messageList: [
            {
                messageId: 'arakdaf',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                type: 'text'
            },
            {
                messageId: 'arakdaf',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                type: 'text'
            },
            {
                messageId: 'arakssdfdaf',
                position: 'left',
                text: "How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                type: 'text'
            }
        ],
    }
]

export default function ChatAdmin(){

    const chatList = messageExampleObject.map(item => {return {chatListeItemId: item.chatListItemId,
                                                title: item.avatar,
                                                avatar: item.avatar,
                                                subtitle: item.lastMessage,
                                                date: item.lastMessageDate,
                                                unRead: item.unReadMessages
                                            }
                                        })
    const [activeChat, setActiveChat] = useState(messageExampleObject[0])
    console.log(activeChat)
    const handleChatItemClick = (itemId) => {
        const newActiveChat =   messageExampleObject.filter( item => item.chatListItemId==itemId)
        setActiveChat(newActiveChat[0]) 
    }     
    const handleChatInput = () => {
        
    }                                                                    
    return <>
        <MDBContainer className='d-flex bg-light shadow-5 rounded-5 justify-content-center'>
            <MDBContainer className='d-flex flex-column'>
                {
                    chatList.map( item => <ChatItem 
                        avatar={item.avatar}
                        title={item.title} 
                        subtitle={item.subtitle}
                        unread={item.unRead}
                        date = {item.date}
                        onClick = { () => handleChatItemClick(item.chatListeItemId)}
                        />
                    )
                }

            </MDBContainer>
            <MDBContainer className='flex-column'>
                <Navbar
                    className='bg-light'
                    left={<div>Logo</div>}
                    center={<div>{activeChat.title}</div>}
                    right={<div>Contact</div>}
                    type="light"
                />
                <MessageList
                className='message-list'
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={activeChat.messageList}
                />
                <CustomChatInput />
            </MDBContainer>

        </MDBContainer>

    </>
}