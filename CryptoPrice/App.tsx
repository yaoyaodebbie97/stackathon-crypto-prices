/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { Text, View } from 'react-native';
 import { NavigationContainer } from '@react-navigation/native';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import {HomeScreen} from './screens/Home'
 import {DetailScreen} from './screens/Detail'
 import io from 'socket.io-client';

 const Stack = createNativeStackNavigator(); // initialize the stack 

 // for ios devices just do this: http://127.0.0.1:3000, this is the local host 
 // ifconfig for ip address
 export const socket = io('http://192.168.4.220:3000'); // connect to the backend 
 socket.on('connection', ()=>{
   console.log('socket connected')
 })
 
 const App = () => {
   return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
   );
 }
 // STACK.NAVIGATOR CONTAINS multiple screen (i.e., multiple pages)
 
 export default App;



