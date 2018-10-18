import classnames from 'classnames';
import { h, Component } from 'preact';

import Title from 'Components/Title';
import List from 'Components/List';

import styles from './Section.css';

class Section extends Component {
  state = {
    active: false,
    color: ''
  };

  itemDeselectTimeout = null;

  onItemSelect = (item) => {
    // Cancel item deselection
    clearTimeout(this.itemDeselectTimeout);

    this.setState({
      isActive: true,
      color: (item && item.color) || ''
    });

    item && item.visuals && this.props.setAppState({ visuals: item.visuals });
  };

  onItemDeselect = () => {
    const { appState, setAppState } = this.props;

    // Debounce item deselection
    clearTimeout(this.itemDeselectTimeout);

    this.itemDeselectTimeout = setTimeout(() => {
      this.itemDeselectTimeout = null;
      this.setState({
        isActive: false,
        color: ''
      });
    }, 250);

    if (appState) {
      if (appState.currentWork && appState.currentWork.visuals) {
        setAppState({ visuals: appState.currentWork.visuals });
      } else if (!appState.currentWork || !appState.currentWork.visuals) {
        setAppState({ visuals: null });
      }
    }
  };

  render () {
    const { language, noLowercase } = this.props;

    const listDOM = this.props.items && <List
      language={language}
      items={this.props.items}
      onSelect={this.onItemSelect}
      onDeselect={this.onItemDeselect}
    />;

    const textDOM = this.props.text &&
      <p className={classnames(styles.text, { [styles.noLowercase]: noLowercase })} onMouseEnter={this.onItemSelect} onMouseLeave={this.onItemDeselect}>
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
