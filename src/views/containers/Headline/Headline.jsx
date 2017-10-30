import { h, Component } from 'preact';

import Note from './Note';

import data from './Headline.data';

import styles from './Headline.css';

function replaceStringToJSX (string, match, jsx, join) {
  const result = [];
  string.split(match).forEach((part, index, array) => {
    result.push(part);
    (index < array.length - 1) ? result.push(jsx) : null;
  });

  return join ? result.join("") : result;
}

class Headline extends Component {
  DOB = new Date(Date.UTC(1992, 7, 10, 0, 15, 0));
  age = new Date().getFullYear() - this.DOB.getFullYear();

  render () {
    const language = this.props.language;

    let p1 = replaceStringToJSX(data[0].text[language], '${age}', this.age, true);
    p1 = replaceStringToJSX(p1, '${note}', <Note />);

    return (
      <div className={styles.Headline}>
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
