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
} = React;


var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
  }
});

var example = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <SceneManager/>
      </View>
    );
  }
});



AppRegistry.registerComponent('example', () => example);
