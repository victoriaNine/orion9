import classnames from 'classnames';
import { h, Component } from 'preact';

import styles from './List.css';

class List extends Component {
  state = {
    currentGif: ''
  };

  itemsDOM = [];

  onSelect = (item, index) => {
    this.itemsDOM[index].querySelector(`.${styles.title}`).style.color = item.color;

    item.gif && this.setState({
      currentGif: item.gif,
      showGif: true,
    });

    this.props.onSelect(item);
  };

  onDeselect = (item, index) => {
    this.itemsDOM[index].querySelector(`.${styles.title}`).style.color = '';

    !this.state.showGif && setTimeout(() => {
      this.setState({
        currentGif: ''
      });
    }, 200);

    this.setState({ showGif: false });
    this.props.onDeselect(item);
  };

  render () {
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
                  { typeof item.title === 'object' ? item.title['fr'] : item.title }
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
        <div
          className={classnames(styles.gifContainer, {
            [styles['is--active']]: this.state.showGif
          })}
        >
          {
            this.state.currentGif && <img src={this.state.currentGif} className={styles.gif} />
          }
        </div>
      </div>
    );
  }
}

export default List;
