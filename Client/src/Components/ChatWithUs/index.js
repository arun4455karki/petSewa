import {useState, useContext, useEffect} from 'react'
import {axios} from '../../Utils/Axios';
import {Navbar, Input, Button } from 'react-chat-elements';
import { MDBIcon, MDBContainer } from 'mdb-react-ui-kit';
import CustomMessageList from '../CustomMessageList'
import './styles.css';
import { PetContext } from '../../Context/Context';
import {v4 as uuidv4} from 'uuid'

function ChatWithUsItem(){
    const [showChat, setShowChat]=useState(false)
    const [text, setText] = useState('')
    const { socket} = useContext(PetContext)
    const handleClick = () => {
        setShowChat(true)
    }
    const [messageList, setMessageList] =useState([])
    useEffect(()=>{
        async function fetchMessageList (){
            try{
                const endpoint = `/api/users/${localStorage.getItem('userID')}/messageList`
                const response = await axios.get(`/api/users/${localStorage.getItem('userID')}/messageList`)
                setMessageList(response.data.data)
            }catch(error){
                console.log('An error occurred while fetching MessageList', error)
            }
        }
        fetchMessageList()
    }, [])
    useEffect( () => {
        socket?.on('receiveMessage', (message) =>{
            console.log(message)
            setMessageList((prev) =>{
                return [...prev, { _id: uuidv4(), ...message}]
            })
        })    
        return () => {
            socket?.off('receiveMessage')
        }
    }, [socket])
    const handleChatInput = (recipientId='admin') =>{
        const messageObject = {
            text,
            position: 'right',
            senderId: localStorage.getItem('userID'),
            recipientId,
            date: new Date(),
            isRead: true
        }
        socket.emit('sendMessage', messageObject)
        setMessageList((prev) =>{
            return [...prev, { _id: uuidv4(), text, position: messageObject.position, date: messageObject.date, isRead: messageObject.isRead}]
        })
        setText('')
    }
    const closeChat = () => {
        setShowChat(false)
    }

    return <>
    {
        showChat ?(<>
            <MDBContainer className='d-flex flex-column message-box'>
                <div className='navbar-wrapper'>
                    <Navbar className='bg-transparent'
                        // left={<div>Logo</div>}
                        center={<div className='title'>{'Admin'}</div>}
                        right={<MDBIcon fas icon="x"  onClick = {closeChat} className='x'/>}
                    />

                </div>
                <CustomMessageList  messageList={messageList}/>
                <Input
                className='chat-input'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type here..."
                rightButtons={<Button className='send-button' text='send' onClick={()=> handleChatInput()} title ='Send'/>}
                />
            </MDBContainer>
        </>):(
            <>
                <div onClick = {handleClick} 
                    className = 'chat-with-us-wrapper' 
                >
                    <div style = {{padding:'16px', color: 'white', display: 'flex', gap: '5px', alignItems: 'center', fontWeight: 'bold'}}>
                        <MDBIcon fas icon="message" />
                        <span>Chat With Us</span>
                    </div>
                </div>

            </>
        )
    }
    </>
}

export default function ChatWithUs(){
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') == 'admin')
    const {loginStatus} = useContext(PetContext)
    useEffect(() =>{
        setIsAdmin(localStorage.getItem('role') == 'admin')
    }, [loginStatus])
    return <>
    {
        !isAdmin ? <ChatWithUsItem />:<></>
    }
    </>
}