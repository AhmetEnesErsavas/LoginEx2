import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View,Button } from 'react-native';
import {AuthContext} from '../store/auth-context';

function WelcomeScreen({navigation}) {
  const [fetchedMessage, setFetchedMessage] = useState('');
 
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
 
  useEffect(() => {
    axios.get(
      'https://loginex-23d5d-default-rtdb.firebaseio.com/message.json?auth=' +
       token
    ).then((response) => {
      setFetchedMessage(response.data);
    }).catch((error) => {
      console.error("Axios isteği başarısız oldu:", error);
    });
  },[token]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Hoşgeldiniz!</Text>
      <Text>Başarıyla kimlik doğrulaması yaptınız!</Text>
      <Text>{fetchedMessage}</Text>
      <Button title="Menüye Git" onPress={() => navigation.navigate('Menu')} />
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
