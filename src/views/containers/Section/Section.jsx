import { h, Component } from 'preact';

import Title from 'Components/Title';
import List from 'Components/List';

import styles from './Section.css';

class Section extends Component {
  state = {
    active: false,
    color: ''
  };

  onItemSelect = (item) => {
    this.setState({ isActive: true });
    item && item.color && this.setState({ color: item.color });

    item && item.visuals && this.props.setAppState({ visuals: item.visuals });
  };

  onItemDeselect = () => {
    const { appState, setAppState } = this.props;
    this.setState({
      isActive: false,
      color: ''
    });

    if (appState) {
      if (appState.currentWork && appState.currentWork.visuals) {
        setAppState({ visuals: appState.currentWork.visuals });
      } else if (!appState.currentWork || !appState.currentWork.visuals) {
        setAppState({ visuals: null });
      }
    }
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
          <Title backgroundColor={this.state.color} isActive={this.state.isActive}>
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
