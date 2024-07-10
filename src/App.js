import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { LuSendHorizonal } from "react-icons/lu";
const socket = io("ws://localhost:5000");

const App = () => {
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
    socket.on("connect", () => {
      console.log("Socket.IO connection established");
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO connection closed");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });
  }, []);

  useEffect(() => {
    socket.on("response", (msg) => {
      setTyping(false);
      console.log("received from server " + msg);
      addMessage("Bot", msg);
    });

    return () => {
      socket.off("response");
    };
  }, []);

  const addMessage = (sender, message) => {
    console.log("response " + message);
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

  const sendMessage = (message) => {
    setTyping(true);
    addMessage("User", message);
    socket.emit("message", { client_id: "66836f2ef640cff3cdaa0d50", message });
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
    <div className="fabs">
      <div className={`chat ${isChatVisible ? "is-visible" : ""}`}>
        <div className="chat_header">
          <div className="chat_option">
            <div className="header_img">
              <div className="relative w-10 h-10">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-200 flex-shrink-0">
                  <img
                    src="https://w7.pngwing.com/pngs/198/625/png-transparent-call-centre-customer-service-computer-icons-call-centre-miscellaneous-face-telephone-call-thumbnail.png"
                    alt="Agent"
                  />
                </div>
                <span className="online-indicator"></span>
              </div>
            </div>
            <span id="chat_head">Jane Doe</span>
            {!typing && (
              <>
                {" "}
                <br />{" "}
                <span className="agent type_loader_container">
                  Assistant
                </span>{" "}
                <span className="online"></span>
              </>
            )}
            {typing && (
              <div className="type_loader_container">
                <div class="typing_loader"></div>
              </div>
            )}
            <span
              id="chat_fullscreen_loader"
              className="chat_fullscreen_loader"
              onClick={toggleFullscreen}
            >
              <i
                className={`fullscreen zmdi ${isFullscreen ? "zmdi-window-restore" : "zmdi-window-maximize"}`}
              ></i>
            </span>
          </div>
        </div>

        <div
          id="chat_fullscreen"
          ref={chatboxRef}
          className={`chat_conversion chat_converse ${isFullscreen ? "chat_fullscreen" : ""}`}
        >
          {viewInitialPrompt && (
            <>
              <div className="initial_prompt">How may I assist you?</div>
            </>
          )}
          {messages.map((msg, index) => (
            <span
              key={index}
              className={`chat_msg_item ${msg.sender === "Bot" ? "chat_msg_item_admin" : "chat_msg_item_user"}`}
            >
              {msg.sender === "Bot" && (
                <div className="chat_avatar">
                  <img
                    src="https://w7.pngwing.com/pngs/198/625/png-transparent-call-centre-customer-service-computer-icons-call-centre-miscellaneous-face-telephone-call-thumbnail.png"
                    alt="Agent"
                  />
                </div>
              )}
              {msg.message}
            </span>
          ))}
        </div>

        <div className="fab_field">
          <a id="fab_send" className="send_btn" onClick={() => sendMessage(input)}>
            <i className=""><LuSendHorizonal /></i>
          </a>
          <textarea
            id="chatSend"
            name="chat_message"
            placeholder="Send a message"
            className="chat_field chat_message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleSend}
          ></textarea>
        </div>
      </div>
      <a
        id="prime"
        className={`fab ${isChatVisible ? "is-visible  animate-view-spin" : ""}`}
        onClick={toggleFab}
      >
        <i
          className={`prime zmdi ${isChatVisible ? " zmdi-close" : "zmdi-comment-outline"}`}
        ></i>
      </a>
    </div>
  );
};

export default App;
