import { h, Component } from 'preact';

function withAppState (WrappedComponent, state, setAppState) {
  class AppState extends Component {
    render () {
      return (
        <WrappedComponent appState={state} setAppState={setAppState} {...this.props} />
      );
    }
  }

  return AppState;
}

export default withAppState;
