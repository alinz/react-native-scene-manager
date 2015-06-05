/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SceneManager = require('./scene-manager.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
  }
});

class ViewExample1 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('ViewExample1 created');
  }

  componentWillUnmount() {
    console.log('ViewExample1 destroyed');
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.color }}/>
    );
  }
}

class ViewExample2 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('ViewExample2 created');
  }

  componentWillUnmount() {
    console.log('ViewExample2 destroyed');
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'yellow' }}/>
    );
  }
}

var example = React.createClass({
  componentDidMount() {
    var scene = this.refs.scene;

    setTimeout(() => {
      scene.transitTo('front1', ViewExample1, { color: 'blue'});
    }, 1000);

    setTimeout(() => {
      scene.transitTo('front1', ViewExample2, { color: 'red' });
    }, 3000);

    setTimeout(() => {
      scene.transitTo('front2', ViewExample1, {});
    }, 5000);
  },

  onLoading: function (name) {
    console.log('loading ' + name);
  },

  onLoaded: function (name) {
    console.log(name + ' is loaded');
  },

  render: function() {
    return (
      <View style={styles.container}>
        <SceneManager
          ref="scene"
          initView={ViewExample2}
          onLoading={this.onLoading}
          onLoaded={this.onLoaded}/>
      </View>
    );
  }
});

AppRegistry.registerComponent('example', () => example);
