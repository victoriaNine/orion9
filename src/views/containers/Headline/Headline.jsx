import { h, Component } from 'preact';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import Note from 'Components/Note';
import DefaultHeadline from './DefaultHeadline';
import WorkHeadline from './WorkHeadline';
import Piano from 'Containers/Piano';
import data from './Headline.data';
import * as _$ from 'utils';

import styles from './Headline.css';

class Headline extends Component {
  state = {
    contentsHeight: ''
  };

  DOB = new Date(Date.UTC(1992, 7, 10, 0, 15, 0));
  age = new Date().getFullYear() - this.DOB.getFullYear();

  componentDidMount () {
    window.addEventListener("resize", this.onResize);
    setTimeout(this.onResize, 0);
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.onResize);
  }

  componentWillUpdate () {
    this.onResize();
  }

  setDOM = (ref) => {
    this.props.setAppState({
      dom: { ...this.props.appState.dom, headline: ref },
      instances: { ...this.props.appState.instances, headline: this }
    });
  };

  setNoteDOM = (ref) => { this.props.setAppState({ dom: { ...this.props.appState.dom, note: ref } }); };
  setPianoDOM = (ref) => { this.props.setAppState({ dom: { ...this.props.appState.dom, piano: ref } }); };
  setHomeHeadlineDOM = (ref) => { this.props.setAppState({ dom: { ...this.props.appState.dom, homeHeadline: ref } }); };
  setAboutHeadlineDOM = (ref) => { this.props.setAppState({ dom: { ...this.props.appState.dom, aboutHeadline: ref } }); };
  setWorkHeadlineDOM = (ref, inst) => {
    this.props.setAppState({
      dom: { ...this.props.appState.dom, workHeadline: ref },
      instances: { ...this.props.appState.instances, workHeadline: inst }
    });
  };

  openPiano = () => {
    this.props.setAppState({ headlineMode: 'piano' });
  };

  closePiano = () => {
    this.props.setAppState({ headlineMode: 'home' });
    window.location.hash && window.history.pushState(null, null, window.location.pathname);
  };

  onResize = () => {
    const dom = this.props.appState.dom;
    let headlineDOM;

    switch (this.props.mode) {
      case 'work':
        headlineDOM = dom.workHeadline;
        break;
      case 'piano':
        headlineDOM = dom.piano;
        break;
      case 'about':
        headlineDOM = dom.aboutHeadline;
        break;
      case 'home':
      default:
        headlineDOM = dom.homeHeadline;
    }

    this.setState({ contentsHeight: headlineDOM && `${headlineDOM.clientHeight}px` || '' });
  };

  render () {
    const { language, currentWork, audioCtx } = this.props.appState;

    let homeBaseline1 = _$.replaceStringToJSX(data.home.baseline1[language], '${age}', this.age, true);
    homeBaseline1 = _$.replaceStringToJSX(homeBaseline1, '${note}', audioCtx ? <Note onMount={this.setNoteDOM} onClick={this.openPiano} /> : '');

    const homeDOM = <DefaultHeadline
      baseline1={homeBaseline1}
      baseline2={data.home.baseline2[language]}
      onMount={this.setHomeHeadlineDOM}
      hasMaxWidth
    />;

    const aboutDOM = <DefaultHeadline
      baseline1={data.about.baseline1[language]}
      baseline2={data.about.baseline2[language]}
      onMount={this.setAboutHeadlineDOM}
      hasMaxWidth
    />;

    const workDOM = currentWork && <WorkHeadline
      currentWork={currentWork}
      translations={data.translations}
      language={language}
      onMount={this.setWorkHeadlineDOM}
    />;

    const pianoDOM = <Piano
      language={language}
      appState={this.props.appState}
      setAppState={this.props.setAppState}
      onMount={this.setPianoDOM}
      onClose={this.closePiano}
    />;

    return (
      <div
        className={styles.Headline}
        style={{ height: this.state.contentsHeight }}
        ref={this.setDOM}
      >
        <TransitionGroup component={_$.getFirstChild}>
          {this.props.mode === 'work' && workDOM}
        </TransitionGroup>
        <TransitionGroup component={_$.getFirstChild}>
          {this.props.mode === 'piano' && pianoDOM}
        </TransitionGroup>
        <TransitionGroup component={_$.getFirstChild}>
          {(this.props.mode === 'about') && aboutDOM}
        </TransitionGroup>
        <TransitionGroup component={_$.getFirstChild}>
          {(this.props.mode === 'home' || !this.props.mode) && homeDOM}
        </TransitionGroup>
      </div>
    );
  }
}

export default Headline;
