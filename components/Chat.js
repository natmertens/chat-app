import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0
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

  componentDidMount() {

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

  componentWillUnmount() {
    //stop listening for authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
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
      this.addMessage();
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
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>

    );
  }
}
