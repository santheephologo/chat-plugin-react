// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import "./Chatbot.module.css";

// const ReactChatbotWidget = {
//   init: (domElement, configScript) => {
//     if (domElement) {
//       ReactDOM.render(<App configScript={configScript} />, domElement); 
//     } else {
//       console.error('Target DOM element not found');
//     }
//   }
// };

// export default ReactChatbotWidget;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ChatWidget from './ChatWidget';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   
      <ChatWidget />
  
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
