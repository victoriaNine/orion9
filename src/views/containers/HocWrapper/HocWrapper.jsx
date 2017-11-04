import { h, Component } from 'preact';

function withHocWrapper (WrappedComponent, extraProps = {}) {
  class HocWrapper extends Component {
    componentWillAppear (callback) {
      if (this.wrappedInstance.componentWillAppear) {
        this.wrappedInstance.componentWillAppear(callback);
      } else {
        callback && callback();
      }
    }

    componentDidAppear () {
      this.wrappedInstance.componentDidAppear
        && this.wrappedInstance.componentDidAppear();
    }

    componentWillEnter (callback) {
      if (this.wrappedInstance.componentWillEnter) {
        this.wrappedInstance.componentWillEnter(callback);
      } else {
        callback && callback();
      }
    }

    componentDidEnter () {
      this.wrappedInstance.componentDidEnter
        && this.wrappedInstance.componentDidEnter();
    }

    componentWillLeave (callback) {
      if (this.wrappedInstance.componentWillLeave) {
        this.wrappedInstance.componentWillLeave(callback);
      } else {
        callback && callback();
      }
    }

    componentDidLeave () {
      this.wrappedInstance.componentDidLeave
        && this.wrappedInstance.componentDidLeave();
    }

    render () {
      return <WrappedComponent {...extraProps} {...this.props} ref={ref => { this.wrappedInstance = ref; }} />;
    }
  }

  return HocWrapper;
}

export default withHocWrapper;
