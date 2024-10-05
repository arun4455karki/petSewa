import {MessageBox, Avatar } from 'react-chat-elements';
import './styles.css'
export default function CustomMessageList({messageList, adminPosition='left'}){
    return <>
    <div className='message-container'>
        {
            messageList.map(message =>{
                return<div key = {message._id} className={`message-item ${message.position == 'right'?'flex-row-reverse': ''}`}>
                        <Avatar 
                            className ='avatar'
                            src = {`${ message.position == adminPosition ?
                                'https://avatars.githubusercontent.com/u/80540635?v=4':
                                'https://imgs.search.brave.com/XmWo89rrDH7sV2NOJzKw5vMt4FrPmtc6_nK7g0VHrMw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzYwLzI2LzA4/LzM2MF9GXzU2MDI2/MDg4MF9PMVYzUW0y/Y05PNUhXak42Nm1C/aDJOcmxQSE5IT1V4/Vy5qcGc'
                            }`}
                            alt = 'avatar'
                            size='medium'
                            type='rounded'
                        />
                        <MessageBox
                            className='text-box'
                            position={message.position}
                            type='text'
                            text={message.text}
                            date={message.date}

                        />
                    </div>
            }
            )
        }
    </div>
    </>
}