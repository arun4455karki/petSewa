import 'react-chat-elements/dist/main.css';
import {axios} from '../../Utils/Axios';
import { MDBContainer } from 'mdb-react-ui-kit';
import { ChatItem, MessageList, Navbar, Input, Button } from 'react-chat-elements';
import {useState, useContext, useEffect} from 'react'
import { PetContext } from '../../Context/Context';
import {v4 as uuidv4} from 'uuid'
import CustomMessageList from '../../Components/CustomMessageList';
const messageExampleObject = [
    {
        _id: 'somerandom Message3',
        user: {
            _id: 'somsdkdlfj',
        },
        lastMessage: "You don't know this",
        unReadMessages: 3,
        lastMessageDate: new Date(),
        messageList: [
            {
                _id: 'arakdasdff',
                position: 'left',
                text: "Yo Man Whats Up ?",
                date: new Date() - 1,
                isRead: true,
                
            },
            {
                _id: 'araakdaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                
            },
            {
                _id: 'araxvkdaf',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                
            },
            {
                _id: 'arakdqaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                
            }
        ],
    },

    {
        _id: 'somerandomMessage',
        user: {
            _id: 'omsdkdlfj',
        },
        lastMessage: "the last sent or received message",
        unReadMessages: 2,
        lastMessageDate: new Date(),
        messageList: [
            {
                _id: 'araaf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                
            },
            {
                _id: 'arakda',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                
            },
            {
                _id: 'rakdaf',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                
            },
            {
                _id: 'arakdf',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                
            }
        ],
    },

    {
        _id: 'hello Mesage',
        user: {
            _id: 'omsdkdlf',
        },
        lastMessage: "the last sent or received message",
        unReadMessages: 2,
        lastMessageDate: new Date(),
        messageList: [
            {
                _id: 'arakdafsss',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                
            },
            {
                _id: 'arakdafs',
                position: 'right',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: true,
                
            },
            {
                _id: 'arakdaffgh',
                position: 'left',
                text: "Hello How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                
            },
            {
                _id: 'arakssdfdaff',
                position: 'left',
                text: "How are you doing ?",
                date: new Date() - 1,
                isRead: false,
                
            }
        ],
    }
]


export default function ChatAdmin(){
    const {socket} = useContext(PetContext)
    const [chatList, setChatList] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const [text, setText] = useState('')
    async function fetchChatList (chatId=null){
        try{
            const response = await axios.get(`/api/admin/getChatList`)
            setChatList(response.data.data)
            if(chatId){
                const activeChat = response.data.data.filter(item => item._id ==chatId)
                console.log(activeChat)
                setActiveChat(activeChat[0])
            }else{
                setActiveChat(response.data.data[0])
            }
        }catch(error){
            console.log('An error occurred while fetching ChatList', error)
        }
    }
    const handleChatItemClick = (itemId) => {
        fetchChatList(itemId)
    }     
    const handleChatInput = (recipientId) => {
        const messageObject = {
            text: text,
            recipientId,
            senderId: 'admin',
            date: new Date(),
            isRead: true
        }
        socket.emit('sendMessage', messageObject)
        setActiveChat((prev) => {
            return {...prev, messageList: [ ...prev.messageList, {_id: uuidv4(), text, date: messageObject.date, isRead: messageObject.isRead, position: 'right'}]}
        })
        setText('')
    }
    useEffect(()=>{
        fetchChatList()
    }, [])
    useEffect( () =>{
        socket?.on('receiveMessage', (newMessage) => {
            console.log(newMessage)
            setActiveChat((prev) => {
                return {...prev, messageList: [ ...prev.messageList, {_id: uuidv4(), ...newMessage}]}
            })
        })
        return () => {
            socket?.off('receiveMessage')
        }
    }, [socket])
    return <>
        <MDBContainer className='d-flex bg-light shadow-5 rounded-5 justify-content-center'>
            {
                chatList?.length == 0 ?
                <>
                    <div>
                        No Chat to display
                    </div> 
                </>:<>
                    <MDBContainer className='d-flex flex-column'>
                        {
                            chatList.map( item => <ChatItem 
                                key={item._id}
                                avatar='https://imgs.search.brave.com/XmWo89rrDH7sV2NOJzKw5vMt4FrPmtc6_nK7g0VHrMw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzYwLzI2LzA4/LzM2MF9GXzU2MDI2/MDg4MF9PMVYzUW0y/Y05PNUhXak42Nm1C/aDJOcmxQSE5IT1V4/Vy5qcGc'
                                title={item.user.name} 
                                subtitle={item.lastMessage}
                                unread={item.unRead}
                                date = {item.lastMessageDate}
                                onClick = { () => handleChatItemClick(item._id)}
                                />
                            )
                        }

                    </MDBContainer>
                    {
                        activeChat ?
                        <>
                            <MDBContainer className='d-flex flex-column'>
                                <Navbar
                                    className='bg-light'
                                    left={<div>Logo</div>}
                                    center={<div>{activeChat.user.name}</div>}
                                    right={<div>Contact</div>}
                                    type="light"
                                />
                                <CustomMessageList messageList={activeChat.messageList} adminPosition='right' />
                                <Input
                                    className='chat-input'
                                    placeholder="Type here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rightButtons={<Button text='send' onClick={()=> handleChatInput(activeChat.user._id)} title ='Send'/>}
                                />
                            </MDBContainer>
                        </>:
                        <>
                        <div>
                            Loading...
                        </div>
                        </>

                    }
                </>
            }

        </MDBContainer>

    </>
}