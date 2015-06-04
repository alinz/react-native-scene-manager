'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Component,
  View
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

function noop() { }

class SceneManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      views: []
    };

    this.isAnimating = false;
  }

  transitTo(name, component, props) {
    var state = this.state;

    if (!this.isAnimationg) {
      state.views.push({
        name: name,
        component: component,
        props: props,
        opacity: 0
      });

      this.props.onLoading(name);
      this.startAnimation();

      return true;
    }

    return false;
  }

  startAnimation() {
    var props = this.props;

    this.isAnimating = true;

    var loop = () => {
      var state = this.state,
          viewFront, viewBack;

      switch(state.views.length) {
        case 0:
          //no views yet so cancel the animation
          this.isAnimating = false;
          return;

        case 1:
          //check the opacity value
          viewFront = state.views[0];
          if (viewFront.opacity < 1) {
            viewFront.opacity += props.opacityStep;
            this.setState(state);
          } else {
            props.onLoaded(viewFront.name);
            this.isAnimating = false;
            return;
          }
          break;

        case 2:
          viewBack = state.views[0];
          viewFront = state.views[1];

          if (viewFront.opacity < 1) {
            //viewFront is displaying,
            viewFront.opacity += props.opacityStep;
            viewBack.opacity -= props.opacityStep;

            this.setState(state);
          } else {
            //we need to remove the view from stack
            state.views.shift();
            props.onLoaded(viewFront.name);

            this.setState(state);
            return;
          }
          break;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  genScene(key, opacity, Component, props) {
    return (
      <View key={key} style={[styles.fill, {opacity: opacity}]}>
        <Component {...props}/>
      </View>
    );
  }

  render() {
    var state = this.state;

    var views = state.views.map((view, index) => {
      return this.genScene(index, view.opacity, view.component, view.props);
    });

    //this is the initial view
    if (views.length == 0) {
      //injecting init view into the stack
      views.push(
        this.genScene(-1, 1, this.props.initView, this.props.initViewProps)
      );
    }

    return (
      <View style={styles.container}>
        {views}
      </View>
    );
  }
}

SceneManager.propTypes = {
  initView: React.PropTypes.func.isRequired,
  initViewProps: React.PropTypes.object,
  opacityStep: React.PropTypes.number,
  onLoading: React.PropTypes.func,
  onLoaded: React.PropTypes.func
};

SceneManager.defaultProps = {
  initViewProps: {},
  opacityStep: 0.05,
  onLoading: noop,
  onLoaded: noop
};

module.exports = SceneManager;
