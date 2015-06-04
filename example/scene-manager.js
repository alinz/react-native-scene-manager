'use strict';

var React = require('react-native');

var Dimensions = require('Dimensions');
var window = Dimensions.get('window');

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
  },
  frontView: {
    backgroundColor: 'white'
  },
  backView: {
    backgroundColor: 'black'
  }
});

class ViewExample1 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('ViewExample1 is created');
  }

  componentWillUnmount() {
    console.log('ViewExample1 is destroyed');
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'red' }}/>
    );
  }
}

class ViewExample2 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('ViewExample2 is created');
  }

  componentWillUnmount() {
    console.log('ViewExample2 is destroyed');
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'yellow' }}/>
    );
  }
}

class SceneManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      views: []
    };

    this.animation = null;
  }

  transitTo(name, component, props) {
    var state = this.state;

    state.views.push({
      name: name,
      component: component,
      props: props,

      opacity: 0
    });

    this.startAnimation();
  }

  startAnimation() {
    var loop = () => {
      var state = this.state,
          viewFront, viewBack;

      switch(state.views.length) {
        case 0:
          //no views yet so cancel the animation
          return;

        case 1:
          //check the opacity value
          viewFront = state.views[0];
          if (viewFront.opacity < 1) {
            viewFront.opacity += 0.05;
          } else {
            return;
          }
          break;

        case 2:
          viewBack = state.views[0];
          viewFront = state.views[1];

          if (viewFront.opacity < 1) {
            //viewFront is displaying,
            viewFront.opacity += 0.05;
            viewBack.opacity -= 0.05;
          } else {
            //we need to remove the view from stack
            state.views.shift();

            //we have to test whether we need this or not.
            viewBack.componentWillUnMount && viewBack.componentWillUnMount();
          }
          break;
      }

      this.setState(state);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  componentDidMount() {
    setTimeout(() => {
      this.transitTo('front1', ViewExample1, {});

      console.log('####');
    }, 1000);

    setTimeout(() => {
      this.transitTo('front2', ViewExample2, {});
      console.log('####');
    }, 3000);

    setTimeout(() => {
      this.transitTo('front1', ViewExample1, {});
      console.log('####');
    }, 5000);
  }

  render() {
    var state = this.state;

    var views = state.views.map((view, index) => {
      var Component = view.component,
          props = view.props;

      return (
        <View key={index} style={[styles.fill, {opacity: view.opacity}]}>
          <Component {...props}/>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        {views}
      </View>
    );
  }
}

module.exports = SceneManager;
