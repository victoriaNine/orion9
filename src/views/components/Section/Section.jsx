import { h, Component } from 'preact';

import Title from 'Components/Title';
import List from 'Components/List';

import styles from './Section.css';

class Section extends Component {
  state = {
    active: false,
    backgroundColor: ''
  };

  onItemSelect = (item) => {
    this.setState({ isActive: true });
    item && item.color && this.setState({ backgroundColor: item.color });
  };

  onItemDeselect = () => {
    this.setState({
      isActive: false,
      backgroundColor: ''
    });
  };

  render () {
    const listDOM = this.props.items && <List items={this.props.items} onSelect={this.onItemSelect} onDeselect={this.onItemDeselect} />;
    const textDOM = this.props.text &&
      <div className={styles.text} onMouseEnter={this.onItemSelect} onMouseLeave={this.onItemDeselect}>
        { typeof this.props.text === 'object' ? this.props.text['fr'] : this.props.text }
      </div>;

    return (
      <div className={styles.Section}>
        <div className={styles.title}>
          <Title backgroundColor={this.state.backgroundColor} isActive={this.state.isActive}>{this.props.title['fr']}</Title>
        </div>
        <div className={styles.contents}>
          {listDOM || textDOM}
        </div>
      </div>
    );
  }
}

export default Section;
