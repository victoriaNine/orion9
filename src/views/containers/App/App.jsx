import { h, Component } from 'preact';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import About from 'Containers/About';
import Home from 'Containers/Home';
import Headline from 'Containers/Headline';
import Nav from 'Containers/Nav';

import './reset.global.css';
import './font-awesome.global.css';
import styles from './App.css';

class App extends Component {
  state = {
    language: navigator.language.match('fr|en|ja') ? navigator.language : 'en'
  };

  componentDidMount() {
    this.updateGradient(this.getGradientOffset());

    document.body.addEventListener("scroll", () => {
      this.updateGradient(this.getGradientOffset());
    });

    window.addEventListener("resize", () => {
      this.updateGradient(this.getGradientOffset());
    });
  }

  getGradientOffset () {
    return document.body.scrollTop - this.wrapperDOM.offsetTop - this.DOM.offsetTop;
  }

  updateGradient (offset) {
    this.wrapperDOM.style.webkitMaskImage =
      `-webkit-linear-gradient(top, rgba(0,0,0,1) ${offset}px, rgba(0,0,0,1) calc(60vh + ${offset}px), rgba(0,0,0,${this.getScrollRatio()}) calc(100vh + ${offset}px))`;
  }

  getScrollRatio () {
    // https://stackoverflow.com/questions/2387136/cross-browser-method-to-determine-vertical-scroll-percentage-in-javascript
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';

    return (b[st] / (b[sh] - h.clientHeight));
  }

  setDOM = (ref) => {
    this.DOM = ref;
  };

  setWrapperDOM = (ref) => {
    this.wrapperDOM = ref;
  };

  onLanguageUpdate = (language) => {
    this.setState({ language });
  };

  navWithRouter = withRouter(Nav);

  render () {
    return (
      <Router>
        <div id="app" class={styles.App} ref={this.setDOM}>
          <this.navWithRouter language={this.state.language} languageUpdate={this.onLanguageUpdate} />
          <div class={styles.wrapper} ref={this.setWrapperDOM}>
            <Headline language={this.state.language} />
            <div class={styles.contents}>
              <Route path="/home" render={ () => <Home language={this.state.language} /> }/>
              <Route path="/about" render={ () => <About language={this.state.language} /> }/>
              <Route exact path="/" render={ () => <Home language={this.state.language} /> }/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
