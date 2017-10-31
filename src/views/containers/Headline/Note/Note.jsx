import { h, Component } from 'preact';

import styles from './Note.css';

class Note extends Component {
  componentDidMount() {
    this.props.onMount(this.DOM);
  }

  setDOM = (ref) => {
    this.DOM = ref;
  };

  render () {
    return (
      <div class={styles.Note} ref={this.setDOM}>
        <i class="fa fa-music" aria-hidden="true" />
      </div>
    );
  }
}

export default Note;
