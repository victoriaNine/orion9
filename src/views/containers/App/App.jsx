import { h, Component } from 'preact';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { TimelineMax } from 'gsap';

import About from 'Containers/About';
import Canvas from 'Containers/Canvas';
import Home from 'Containers/Home';
import Headline from 'Containers/Headline';
import Nav from 'Containers/Nav';

import './reset.global.css';
import './font-awesome.global.css';
import styles from './App.css';

class App extends Component {
  state = {
    language: 'en',
  };

  navWithRouter = withRouter(Nav);

  componentDidMount() {
    this.updateGradient(this.getGradientOffset());

    document.body.addEventListener("scroll", () => {
      this.updateGradient(this.getGradientOffset());
    });

    window.addEventListener("resize", () => {
      this.updateGradient(this.getGradientOffset());
    });

    const tl = new TimelineMax({ delay: 0.5 });
    tl.from(this.DOM.querySelector(`.${styles.contents}`), 0.4, { opacity: 0, y: 12, clearProps: "all" }, 0.4);
    tl.from(this.navDOM, 0.4, { opacity: 0, x: 12, clearProps: "all" }, "-=0.2");
  }

  getGradientOffset () {
    return document.body.scrollTop - (this.wrapperDOM.offsetTop + this.DOM.offsetTop);
  }

  updateGradient (offset) {
    const string = `top, rgba(0,0,0,1) ${offset}px, rgba(0,0,0,1) calc(60vh + ${offset}px), rgba(0,0,0,${this.getScrollRatio()}) calc(95vh + ${offset}px)`;

    this.wrapperDOM.style.webkitMaskImage = `-webkit-linear-gradient(${string})`;
    this.wrapperDOM.style.maskImage = `linear-gradient(${string})`;
  }

  getScrollRatio () {
    // https://stackoverflow.com/questions/2387136/cross-browser-method-to-determine-vertical-scroll-percentage-in-javascript
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';

    if (b[sh] - h.clientHeight <= 0) {
      return 1;
    }

    return (b[st] / (b[sh] - h.clientHeight));
  }

  setDOM = (ref) => { this.DOM = ref; };
  setWrapperDOM = (ref) => { this.wrapperDOM = ref; };
  setNavDOM = (ref) => { this.navDOM = ref; };
  onLanguageUpdate = (language) => { this.setState({ language }); };

  render () {
    return (
      <Router>
        <main id="app" role="main" className={styles.App} ref={this.setDOM}>
          <Canvas />
          <this.navWithRouter language={this.state.language} onLanguageUpdate={this.onLanguageUpdate} onMount={this.setNavDOM} />
          <div className={styles.wrapper} ref={this.setWrapperDOM}>
            <Headline language={this.state.language} />
            <div className={styles.contents}>
              <Switch>
                <Route path="/:lang?/home" render={() => <Home language={this.state.language} />} />
                <Route path="/:lang?/about" render={() => <About language={this.state.language} />} />
                <Route render={() => <Home language={this.state.language} />} />
              </Switch>
            </div>
          </div>
        </main>
      </Router>
    );
  }
}

export default App;
