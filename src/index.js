

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
// Define and export a function to initialize the widget
const MyReactWidget = {
  init: (domElement) => {
    if (domElement) {
      ReactDOM.render(<App />, domElement);
    } else {
      console.error('Target DOM element not found');
    }
  }
};

export default MyReactWidget;
