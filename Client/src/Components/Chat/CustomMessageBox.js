import 'react-chat-elements/dist/main.css'
import { MessageList, Navbar } from 'react-chat-elements'
import CustomChatInput from './CustomChatInput'
import { MDBContainer } from 'mdb-react-ui-kit'

export default function CustomChatMessage(){
    return <>

            <MDBContainer className='.flex-column'>
                <Navbar
                    className='bg-light'
                    left={<div>Logo</div>}
                    center={<div>Home</div>}
                    right={<div>Contact</div>}
                    type="light"
                />
                <MessageList
                className='message-list'
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={[
                {
                position:"left",
                type:"text",
                title:"Kursat",
                text:"Give me a message list example !",
                },
                {
                position:"right",
                type:"text",
                title:"Emre",
                text:"That's all.",
                },
                ]}
                />
                <CustomChatInput />
            </MDBContainer>

    </>
}