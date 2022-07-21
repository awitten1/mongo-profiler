import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Hostnames from './Hostnames'
import Timestamps from './Timestamps'
import Timestamps2 from './Timestamps2'
class App extends Component {
  render() {
    return (<div className = 'container'><BrowserRouter><Routes>
            <Route exact path = '/' element = {
<Hostnames /> } />
<Route exact path = '/:hostname' element = {<Timestamps/>} />
          </Routes></BrowserRouter>
      </div>);
  }
}

export default App;
