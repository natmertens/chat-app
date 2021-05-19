import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, ImageBackground, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: ''
    };
  }

  render() {

    const image = require("../img/background_image.png");

    return (

      <View style={styles.container}>
        <ImageBackground source={image} style={styles.image}>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>App Title</Text>
          </View>
          <View style={styles.containerMain}>
            <View style={styles.input}>
              <TextInput
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder="Your name" />
            </View>
            <View style={styles.colorContainer}>
              <Text style={styles.chooseColor}>Choose Background Color:</Text>
              <View style={styles.colors}>
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#090C08' })}
                  style={styles.colorbox}>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#474056' })}
                  style={[styles.colorbox, styles.colorbox2]}>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#8A95A5' })}
                  style={[styles.colorbox, styles.colorbox3]}>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#B9C6AE' })}
                  style={[styles.colorbox, styles.colorbox4]}>

                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.button}>
              <Button
                title="Start Chatting"
                onPress={() => this.props.navigation.navigate('Chat',
                  {
                    name: this.state.name,
                    color: this.state.color
                  })} />
            </View>
          </View>
        </ImageBackground>
      </View>

    );
  }
}

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '44%',
    width: '88%'
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
    color: '#ffffff'
  },
  containerTitle: {
    flex: 1
  },
  containerMain: {
    flex: 0.5,
    backgroundColor: '#fff',
    paddingTop: 15,
    marginBottom: 60
  },
  button: {
    backgroundColor: '#757083',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '88%',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  input: {
    borderWidth: 2,
    borderColor: '#757083',
    color: '#757083',
    width: '88%',
    marginBottom: 10,
    height: 40,
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 16,
    fontWeight: '300',
    opacity: 50
  },
  chooseColor: {
    color: '#757083',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '300',
    opacity: 100
  },
  colorbox: {
    backgroundColor: '#090C08',
    width: 50,
    height: 40,
    borderRadius: 25,
    marginRight: 10
  },
  colorbox2: {
    backgroundColor: '#474056'
  },
  colorbox3: {
    backgroundColor: '#8A95A5'
  },
  colorbox4: {
    backgroundColor: '#B9C6AE'
  },
  colors: {
    flexDirection: 'row'
  },
  colorContainer: {
    width: '88%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10
  }
})