import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Stockz from './stockz';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Stockz />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
