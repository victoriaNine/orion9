import { h, Component } from 'preact';
import { TimelineMax } from 'gsap';

import Note from './Note';

import data from './Headline.data';

import styles from './Headline.css';

function replaceStringToJSX (string, match, jsx, join) {
  const result = [];

  string.split(match).forEach((part, index, array) => {
    result.push(part);
    (index < array.length - 1) && result.push(jsx);
  });

  return join ? result.join("") : result;
}

class Headline extends Component {
  DOB = new Date(Date.UTC(1992, 7, 10, 0, 15, 0));
  age = new Date().getFullYear() - this.DOB.getFullYear();

  componentDidMount () {
    const tl = new TimelineMax({ delay: 0.5 });
    tl.from(this.DOM.querySelectorAll(`.${styles.paragraph}`)[0], 0.4, { opacity: 0, y: -12, clearProps: "all" });
    tl.from(this.DOM.querySelectorAll(`.${styles.paragraph}`)[1], 0.4, { opacity: 0, y: -12, clearProps: "all" }, "-=0.2");
    tl.from(this.noteDOM, 0.4, { opacity: 0, clearProps: "all" });
  }

  setDOM = (ref) => { this.DOM = ref; };
  setNoteDOM = (ref) => { this.noteDOM = ref; };

  render () {
    const language = this.props.language;

    let p1 = replaceStringToJSX(data[0].text[language], '${age}', this.age, true);
    p1 = replaceStringToJSX(p1, '${note}', <Note onMount={this.setNoteDOM} />);

    return (
      <div className={styles.Headline} ref={this.setDOM}>
        <p className={styles.paragraph}>
          {p1}
        </p>
        <p className={styles.paragraph}>
          { data[1].text[language] }
        </p>
      </div>
    );
  }
}

export default Headline;
