import { View, Text, StyleSheet } from "react-native";
import {Link} from 'expo-router'

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.boxMid}>
        {/* trecho temporario, apenas pra conseguir visualizar no cell a tela de login */}
        <Link href="/login" style= {styles.button}> go to login screen</Link>
        </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxMid: {
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'red',
    borderRadius: 15,
    padding:5
  },
  button: {
    fontSize: 20,
    textDecorationColor: 'underline',
    color: '#f0f0f0',
  }
})