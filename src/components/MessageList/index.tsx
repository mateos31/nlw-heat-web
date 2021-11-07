import styles from './styles.module.scss'
import logoImage from '../../assets/logo.svg';

import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const messageQueue: Message[] = []

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
    messageQueue.push(newMessage);
})

export function MessageList() {
    const [ messages, setMessages ] = useState<Message[]>([])

    useEffect( () =>{
        const timer = setInterval(() => {
            if(messageQueue.length > 0) {
                setMessages([
                    messageQueue[0],
                    messages[0],
                    messages[1]
                ].filter(Boolean))
            }
        }, 3000)
    })

    //Usamos quando queremos carregar algum tipo de dado assim que o componente é exibido em tela
    //Recebe dois parametros: oq queremos que seja executado, e quando queremos fazer. Este 'quando' é um array, toda vez que o valor de uma das variáveis do array mudar, a função será executada
    //Se quisermos que a função seja executada apenas uma vez podemos deixar o array vazio 
    useEffect(() => {
        api.get<Message[]>('messages/last3').then( response => {
            setMessages(response.data);
        })
    }, [])

    return(
        <div className={styles.messageListWrapper}>
            <img src={logoImage} alt="DoWhile 2021" />

            <ul className={styles.messageList}>
                { messages.map(message => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                }) }
            </ul>
        </div>
    )
}