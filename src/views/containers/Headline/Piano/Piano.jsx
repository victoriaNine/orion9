import { h, Component } from 'preact';

import styles from './Piano.css';

class Piano extends Component {
  componentDidMount() {
    this.props.onMount(this.DOM);
  }

  setDOM = (ref) => {
    this.DOM = ref;
  };

  render () {
    return (
      <div className={styles.Piano} ref={this.setDOM} onClick={this.props.onClick}>
        <i className="fa fa-times-circle" aria-hidden="true" />
      </div>
    );
  }
}

export default Piano;
