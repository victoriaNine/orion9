import { h, Component } from 'preact';
import { Link } from 'react-router-dom';

import data from './List.data';

import styles from './List.css';

class List extends Component {
  itemsDOM = [];
  gifsDOM = [];

  onSelect = (item, index) => {
    this.itemsDOM[index].querySelector(`.${styles.title}`).style.color = item.color;

    item.gif && this.gifsDOM[index].classList.add(styles['is--visible']);
    this.props.onSelect(item);
  };

  onDeselect = (item, index) => {
    this.itemsDOM[index].querySelector(`.${styles.title}`).style.color = '';
    item.gif && this.gifsDOM[index].classList.remove(styles['is--visible']);

    this.props.onDeselect(item);
  };

  render () {
    const { language } = this.props;

    return (
      <div className={styles.wrapper}>
        <ul className={styles.List}>
          {this.props.items.map((item, index) => {
            const linkTitle = typeof item.title === 'object' ? item.title[language] : item.title;
            return (
              <li
                className={styles.item}
                onMouseEnter={() => { this.onSelect(item, index); }}
                onMouseLeave={() => { this.onDeselect(item, index); }}
                ref={(ref) => { this.itemsDOM[index] = ref; }}
              >
                {
                  item.details && (
                    <Link to={`/work/${item.id}`} onClick={() => { this.onDeselect(item, index); }}>
                      <div className={styles.title}>{ linkTitle }</div>
                      <div className={styles.baselineWrapper}>
                        <div className={styles.dash} /><div className={styles.baseline}>{data.translations.more[language]}</div>
                      </div>
                    </Link>
                  )
                }
                {
                  !item.details && item.internalLink && <Link to={item.url} onClick={() => { this.onDeselect(item, index); }} className={styles.title}>
                    { linkTitle }
                  </Link>
                }
                {
                  !item.details && !item.internalLink && <a href={item.url} target="_blank" className={styles.title}>
                    { linkTitle }
                  </a>
                }
              </li>
            );
          })}
        </ul>
        <div className={styles.gifWrapper}>
          {this.props.items.map((item, index) => {
            return item.gif && (
              <div className={styles.gifContainer} ref={(ref) => { this.gifsDOM[index] = ref; }}>
                <img src={item.gif} className={styles.gif} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default List;
