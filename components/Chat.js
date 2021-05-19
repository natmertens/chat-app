import React from 'react';
import { View, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({
      title: name
    })
    return (
      <View style={{ backgroundColor: color, flex: 1 }}>
        <Text>Chat Screen</Text>
      </View>
    );
  }
}
