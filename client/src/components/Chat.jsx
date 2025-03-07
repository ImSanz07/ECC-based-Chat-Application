import { set } from 'mongoose'
import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  //We need public and private key here


  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      //Here we are sending the data to the server, so we will have to encrypt it here

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("")
    }

  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data])

    });

  }, [socket])


  return (
    <>
      <div className='chat-window'>
        <div className='chat-header'>
          <p>
            Live Chat &nbsp; &nbsp; User:({username}) &nbsp; &nbsp; Session Id:({room})
          </p>
          
         
        </div>
        <div className='chat-body'>
          <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div className='message' id={username === messageContent.author ? "you" : "other"}>
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
          </ScrollToBottom>
        </div>
        <div className='chat-footer'>
          <input type='text' value={currentMessage} placeholder="Hey..." onChange={
            (event) => {
              setCurrentMessage(event.target.value);
            }
          }
            onKeyDown={(event)=>{event.key==='Enter' && sendMessage();}}
          />
          <button onClick={sendMessage}>&#9658;</button>

        </div>
      </div>

    </>
  )
}

export default Chat