import { h, Component } from 'preact';

import Note from 'Components/Note';
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

  openPiano = () => {
    this.props.setAppState({ headlineMode: 'piano' });
  };

  closePiano = () => {
    this.props.setAppState({ headlineMode: 'default' });
  };

  render () {
    const { language, currentWork } = this.props.appState;

    let p1 = _$.replaceStringToJSX(data.baseline1[language], '${age}', this.age, true);
    p1 = _$.replaceStringToJSX(p1, '${note}', <Note onMount={this.setNoteDOM} onClick={this.openPiano} />);

    const defaultDOM = [
      (<h1 className={styles.baseline1}>{p1}</h1>),
      (<h2 className={styles.baseline2}>{data.baseline2[language]}</h2>)
    ];

    const workDOM = currentWork && [
      (<h1 className={styles.title} style={{ color: currentWork.color }}>{currentWork.title}</h1>),
      (<h2 className={styles.role}>
        <div className={styles.dash} />
        <span>
          {
            currentWork.details.role.map(role => data.translations[role][language]).join(data.translations.separator[language])
          }
        </span>
      </h2>
      )
    ];

    let headlineDOM;

    switch (this.props.mode) {
      case 'work':
        headlineDOM = workDOM;
        break;
      case 'piano':
        headlineDOM = <Piano language={language} appState={this.props.appState} onMount={this.setPianoDOM} onClose={this.closePiano} />;
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
