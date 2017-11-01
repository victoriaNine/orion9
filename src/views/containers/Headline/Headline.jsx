import { h, Component } from 'preact';

import Note from './Note';
import Piano from './Piano';
import data from './Headline.data';
import * as _$ from 'utils';

import styles from './Headline.css';

class Headline extends Component {
  DOB = new Date(Date.UTC(1992, 7, 10, 0, 15, 0));
  age = new Date().getFullYear() - this.DOB.getFullYear();

  setDOM = (ref) => { this.props.setAppState({ dom: {...this.props.appState.dom, headline: ref } }); };
  setNoteDOM = (ref) => { this.props.setAppState({ dom: {...this.props.appState.dom, note: ref } }); };
  setPianoDOM = (ref) => { this.props.setAppState({ dom: {...this.props.appState.dom, piano: ref } }); };

  openPiano = () => {
    this.props.setAppState({ headlineMode: 'piano' });
  };

  closePiano = () => {
    this.props.setAppState({ headlineMode: 'default' });
  };

  render () {
    const appState = this.props.appState;
    const language = appState.language;

    let p1 = _$.replaceStringToJSX(data[0].text[language], '${age}', this.age, true);
    p1 = _$.replaceStringToJSX(p1, '${note}', <Note onMount={this.setNoteDOM} onClick={this.openPiano} />);

    const defaultDOM = (
      <div className={styles.headlineWrapper}>
        <p className={styles.paragraph}>
          {p1}
        </p>
        <p className={styles.paragraph}>
          { data[1].text[language] }
        </p>
      </div>
    );

    let headlineDOM;

    switch (this.props.mode) {
      case 'work':
        headlineDOM = (
          <div className={styles.headlineWrapper}>
            {this.props.appState.currentWork.title}
          </div>
        );
        break;
      case 'piano':
        headlineDOM = <Piano onMount={this.setPianoDOM} onClick={this.closePiano} />;
        break;
      case 'default':
      default:
        headlineDOM = defaultDOM;
        break;
    }

    return (
      <div className={styles.Headline} ref={this.setDOM}>
        {headlineDOM}
      </div>
    );
  }
}

export default Headline;
