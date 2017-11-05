import classnames from 'classnames';
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
  DOB = new Date(Date.UTC(1992, 7, 10, 0, 15, 0));
  age = new Date().getFullYear() - this.DOB.getFullYear();

  setDOM = (ref) => { this.props.setAppState({ dom: {...this.props.appState.dom, headline: ref } }); };
  setNoteDOM = (ref) => { this.props.setAppState({ dom: {...this.props.appState.dom, note: ref } }); };
  setPianoDOM = (ref) => { this.props.setAppState({ dom: {...this.props.appState.dom, piano: ref } }); };
  setDefaultHeadlineDOM = (ref) => { this.props.setAppState({ dom: {...this.props.appState.dom, defaultHeadline: ref } }); };
  setWorkHeadlineDOM = (ref, inst) => {
    this.props.setAppState({ dom: {...this.props.appState.dom, workHeadline: ref } });
    this.props.setAppState({ instances: {...this.props.appState.instances, workHeadline: inst } });
  };

  openPiano = () => { this.props.setAppState({ headlineMode: 'piano' }); };
  closePiano = () => { this.props.setAppState({ headlineMode: 'default' }); };

  render () {
    const { language, currentWork } = this.props.appState;

    let baseline1 = _$.replaceStringToJSX(data.baseline1[language], '${age}', this.age, true);
    baseline1 = _$.replaceStringToJSX(baseline1, '${note}', <Note onMount={this.setNoteDOM} onClick={this.openPiano} />);

    const defaultDOM = <DefaultHeadline
      baseline1={baseline1}
      baseline2={data.baseline2[language]}
      onMount={this.setDefaultHeadlineDOM}
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
      onMount={this.setPianoDOM}
      onClose={this.closePiano}
    />;

    return (
      <div className={classnames(styles.Headline, styles[`is--${this.props.mode}`])} ref={this.setDOM}>
        <TransitionGroup component={_$.getFirstChild}>
          {this.props.mode === 'work' && workDOM}
        </TransitionGroup>
        <TransitionGroup component={_$.getFirstChild}>
          {this.props.mode === 'piano' && pianoDOM}
        </TransitionGroup>
        <TransitionGroup component={_$.getFirstChild}>
          {(this.props.mode === 'default' || !this.props.mode) && defaultDOM}
        </TransitionGroup>
      </div>
    );
  }
}

export default Headline;
