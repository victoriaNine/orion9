import { h, Component } from 'preact';

import styles from './Note.css';

class Note extends Component {
  render () {
    return (
      <div class={styles.Note}>
        <i class="fa fa-music" aria-hidden="true" />
      </div>
    );
  }
}

export default Note;
