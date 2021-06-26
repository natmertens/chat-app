import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      image: null,
      location: null
    }

    var firebaseConfig = {
      apiKey: "AIzaSyDtMcBvbzrMoPYZ74taVilBZNwl_xAWoZE",
      authDomain: "chat-app-56f42.firebaseapp.com",
      projectId: "chat-app-56f42",
      storageBucket: "chat-app-56f42.appspot.com",
      messagingSenderId: "620833809956",
      appId: "1:620833809956:web:96ef8f0dc3ad2ed094dab1",
      measurementId: "G-DGHVW1GCCZ"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    /* Initialize firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();*/

    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true
        });
        console.log('online');
        this.referenceChatMessages = firebase.firestore().collection('messages');

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      }
      else {
        this.getMessages();
        console.log('offline');
        this.setState({
          isConnected: false
        });
      }
    });
  }

  componentWillUnmount() {
    //stop listening for authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text || '',
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null
      });
    });
    this.setState({
      messages
    })
  }

  //event handler for sending messages
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    })
  }


  //render chat bubble with custom color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0088ff'
          }
        }}
      />
    )
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar
        {...props}
      />;
    }
  }

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({
      title: name
    })
    return (
      <View style={{ backgroundColor: color, flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>

    );
  }
}
