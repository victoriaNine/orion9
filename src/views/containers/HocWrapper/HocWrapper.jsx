import { h, Component } from 'preact';

function withHocWrapper (WrappedComponent, extraProps = {}) {
  class hocWrapper extends Component {
    render () {
      return (
        <WrappedComponent {...extraProps} {...this.props} />
      );
    }
  }

  return hocWrapper;
}

export default withHocWrapper;
