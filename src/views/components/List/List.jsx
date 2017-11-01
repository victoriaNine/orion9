import { h, Component } from 'preact';

import styles from './List.css';

class List extends Component {
  state = {
    currentGif: ''
  };

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
            return (
              <li
                className={styles.item}
                onMouseEnter={() => { this.onSelect(item, index); }}
                onMouseLeave={() => { this.onDeselect(item, index); }}
                ref={(ref) => { this.itemsDOM[index] = ref; }}
              >
                <a href={item.url} target="_blank" className={styles.title}>
                  { typeof item.title === 'object' ? item.title[language] : item.title }
                </a>
                {
                  item.details && <div className={styles.detailsWrapper}>
                    <div className={styles.dash} /><div className={styles.details}>{item.details.join(", ")}</div>
                  </div>
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
