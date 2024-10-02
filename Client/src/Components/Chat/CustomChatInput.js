import 'react-chat-elements/dist/main.css'
import { Input, Button } from 'react-chat-elements'

export default function CustomChatInput(){

    const handleMessageSend = () => {

    }
    return  <Input
                placeholder="Type here..."
                multiline={true}
                rightButtons={<Button text='send' onClick={()=> handleMessageSend()} title ='Send'/>}
            />
}
