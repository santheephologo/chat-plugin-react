import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./Chatbot_App.css";
import { TbMessageDots } from "react-icons/tb";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { LuSendHorizonal } from "react-icons/lu";


const App = ({configScript}) => {
  const [config, setConfig] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("config : "+configScript)
    if (configScript) {
      
      setConfig(configScript);
    } else {
      console.log("configuration failed")
    }
  }, []);

  useEffect(() => {
    if (config) {
      const socketInstance = io(config.SOCKET_URL);
      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log("Socket.IO connection established");
      });

      socketInstance.on('disconnect', () => {
        console.log("Socket.IO connection closed");
      });

      socketInstance.on('connect_error', (error) => {
        console.error("Socket.IO connection error:", error);
      });

      
    }
  }, [config]);

  if (!config) {
    console.log("Loading configuration...");
    return <div>Loading configuration...</div>;
  }

  if (config && socket) {
    
    return <ChatWidget socket={socket} client_id={config.CLIENT_ID} assitant_name={ config.ASSISTANT_NAME} />;
  }

  return null;
};


const ChatWidget = ({ socket, client_id, assitant_name }) => {
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [viewInitialPrompt, setViewInitialPrompt] = useState(true);
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (typing && viewInitialPrompt) {
      setViewInitialPrompt(false);
    }
  }, [typing, viewInitialPrompt]);
 

  useEffect(() => {
    socket.on("response", (msg) => {
      setTyping(false);
      
      addMessage("Bot", msg);
    });

    return () => {
      socket.off("response");
    };
  }, []);

  const addMessage = (sender, message) => {
    
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

  const sendMessage = (message) => {
    setTyping(true);
    addMessage("User", message);
    socket.emit("message", { client_id: client_id, message });
  };

  const handleSend = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
      setInput("");
    }
  };

  const toggleFab = () => {
    setIsChatVisible(!isChatVisible);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat_bot_main__mx__fabs">
      <div className={`chat_bot_main__mx ${isChatVisible ? "chat_bot_main__mx__is-visible" : ""}`}>
        <div className="chat_bot_main__mx_header">
          <div className="chat_bot_main__mx_option">
            <div className="">
              <div className="chat_bot_main__mx_header_img">
                <div >
                  <img
                    src="https://w7.pngwing.com/pngs/198/625/png-transparent-call-centre-customer-service-computer-icons-call-centre-miscellaneous-face-telephone-call-thumbnail.png"
                    alt="Agent"
                  />
                </div>
                <chatbot_span className="online-indicator"></chatbot_span>
              </div>
            </div>
            <chatbot_span id="chat_bot_main__mx_head">{assitant_name && assitant_name }</chatbot_span>
            {!typing && (
              <>
                {" "}
                <br />{" "}
                <chatbot_span className="agent type_loader_container">
                  Assistant
                </chatbot_span>{" "}
                <chatbot_span className="online"></chatbot_span>
              </>
            )}
            {typing && (
              <div className="type_loader_container">
                <div class="typing_loader"></div>
              </div>
            )}
            <chatbot_span
              id="chat_bot_main__mx_fullscreen_loader"
              className="chat_bot_main__mx_fullscreen_loader"
              onClick={toggleFullscreen}
            >
              <i
                className={`fullscreen zmdi ${isFullscreen ? "zmdi-window-restore" : "zmdi-window-maximize"}`}
              ></i>
            </chatbot_span>
          </div>
        </div>

        <div
          id="chat_bot_main__mx_fullscreen"
          ref={chatboxRef}
          className={`chat_bot_main__mx_conversion chat_bot_main__mx_converse ${isFullscreen ? "chat_bot_main__mx_fullscreen" : ""}`}
        >
          {viewInitialPrompt && (
            <>
              <div className="initial_prompt">How may I assist you?</div>
            </>
          )}
          {messages.map((msg, index) => (
            <chatbot_span
              key={index}
              className={`chat_bot_main__mx_msg_item ${msg.sender === "Bot" ? "chat_bot_main__mx_msg_item_admin" : "chat_bot_main__mx_msg_item_user"}`}
            >
              {msg.sender === "Bot" && (
                <div className="chat_bot_main__mx_avatar">
                  <img
                    src="https://w7.pngwing.com/pngs/198/625/png-transparent-call-centre-customer-service-computer-icons-call-centre-miscellaneous-face-telephone-call-thumbnail.png"
                    alt="Agent"
                  />
                </div>
              )}
              {msg.message}
            </chatbot_span>
          ))}
        </div>

        <div className="fab_field">
          <a id="fab_send" className="chat_bot_main__mx_body_a chat_bot_main__mx__send_btn" onClick={() => sendMessage(input)}>
            <i className=""><LuSendHorizonal /></i>
          </a>
          <textarea
            id="chat_bot_main__mxSend"
            name="chat_bot_main__mx_message"
            placeholder="Send a message"
            className="chat_bot_main__mx_field chat_bot_main__mx_message chat_bot_main__mx_field_input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleSend}
          ></textarea>
        </div>
      </div>
      <a
        id="prime"
        className={`fab ${isChatVisible ? "chat_bot_main__mx__is-visible  animate-view-spin" : ""}`}
        onClick={toggleFab}
      >
              <div className="chatbot_icon_mx_inner">
                  {
                      isChatVisible && (<div className="chatbot_icon_mx"><AiOutlineCloseCircle /></div>)
                  }
                  {
                       !isChatVisible && (<div className="chatbot_icon_mx"><TbMessageDots /></div>)
                  }
             </div>
      </a>
    </div>
  );
};

export default App;
