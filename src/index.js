import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BroweserRouter>
        <App />
    </BroweserRouter>
    , document.getElementById('root'));
registerServiceWorker();
