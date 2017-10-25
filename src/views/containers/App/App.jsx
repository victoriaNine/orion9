import { h, Component } from 'preact';

import HomePage from 'Containers/HomePage';

import './reset.css';
import './App.css';

class App extends Component {
  render () {
    return (
      <div id="app">
        <HomePage />
      </div>
    );
  }
}

export default App;
