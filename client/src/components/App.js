import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import background from '../mongodb_background.png';
import background2 from '../mongodb_background2.png';

import Hostnames from './Hostnames'
import Timestamps from './Timestamps'

class App extends Component {
  render() {
    return (
        <div className = 'container' style={{
      backgroundImage: `url(${background2})`, backgroundPosition: 'center',
          backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%',
          height: '100%' }}><BrowserRouter><Routes>< Route exact path =
            '/' element =
        {
<Hostnames />
        } />
            < Route exact path = '/:hostname' element = {<Timestamps />} /> 
          </Routes></BrowserRouter>
      </div>);
  }
}

export default App;
