import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Hostnames from './Hostnames'

class App extends Component {
  render() {
    return (<div className = 'container'><BrowserRouter><Routes>
            <Route exact path = '/' element = {
<Hostnames />
            } />
          </Routes></BrowserRouter>
      </div>);
  }
}

export default App;
