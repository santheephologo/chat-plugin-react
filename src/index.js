import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './Chatbot_App.css';

const ReactChatbotWidget = {
  init: (domElement, configScript) => {
    if (domElement) {
      ReactDOM.render(<App configScript={configScript} />, domElement); 
    } else {
      console.error('Target DOM element not found');
    }
  }
};

export default ReactChatbotWidget;


