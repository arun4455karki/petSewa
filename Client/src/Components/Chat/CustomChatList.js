import 'react-chat-elements/dist/main.css'
import { ChatList } from 'react-chat-elements'

const messageExampleObject = [
    {
        chatListItemId: 'somerandom Message',
        title: 'Name of the person',
        lastMessage: "the last sent or received message",
        unReadMessages: 3,
        messageList: [
            
        ],
        messageId: 'arakdaf',
        position: 'left',
        text: "Hello How are you doing ?",
        date: new Date() - 1,
        isRead: true
    }
]

const chatListExampleObject = ['','']

export default function CustomChatList(){
    return <ChatList
    className='chat-list'
    dataSource={[
      {
        avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
        alt: 'kursat_avatar',
        title: 'Kursat',
        subtitle: "Why don't we go to the No Way Home movie this weekend ?",
        date: new Date(),
        unread: 3,
      },
      {
        avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
        alt: 'kursat_avatar',
        title: 'Kursat',
        subtitle: "Why don't we go to the No Way Home movie this weekend ?",
        date: new Date(),
        unread: 4,
      },
      {
        avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
        alt: 'kursat_avatar',
        title: 'Kursat',
        subtitle: "Why don't we go to the No Way Home movie this weekend ?",
        date: new Date(),
        unread: 2,
      }
  ]} />
}