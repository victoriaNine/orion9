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
    const { language } = this.props;

    const listDOM = this.props.items && <List
      language={language}
      items={this.props.items}
      onSelect={this.onItemSelect}
      onDeselect={this.onItemDeselect}
    />;
    
    const textDOM = this.props.text &&
      <p className={styles.text} onMouseEnter={this.onItemSelect} onMouseLeave={this.onItemDeselect}>
        { typeof this.props.text === 'object' ? this.props.text[language] : this.props.text }
      </p>;

    return (
      <div className={styles.Section}>
        <div className={styles.title}>
          <Title backgroundColor={this.state.backgroundColor} isActive={this.state.isActive}>
            { typeof this.props.title === 'object' ? this.props.title[language] : this.props.title }
          </Title>
        </div>
        <div className={styles.contents}>
          {listDOM || textDOM}
        </div>
      </div>
    );
  }
}

export default Section;
