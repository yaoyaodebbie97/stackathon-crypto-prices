import React, {useState, useEffect} from 'react';
import { Text, View, Pressable, FlatList, StyleSheet } from 'react-native';
import {Crypto} from '../models/crypto';
import { socket } from '../App';

// let cryptoList : Crypto[] = []

export const HomeScreen = ({navigation}:{navigation: any})  => { // navigation has type 'any'
  const [cryptoList, setCryptoList] =  useState();
  useEffect(()=>{
    socket.on('crypto', (data) =>{
      console.log(data)
      setCryptoList(data)
    })
  }, [])  // second parameter is an empty array 

  const openCryptoDetail = (id : string) =>{
        console.log('it is pressed')
        navigation.navigate('Detail', {id: id}); // pass the id down to detail screen
  }

  const renderItem = ({item}:{item: Crypto}) => { 
    return (
      <Pressable style = {styles.crypto}
          onPress = {()=>openCryptoDetail(item.id)}> 
        <Text style = {styles.name}> {item.name} </Text>
        <Text style = {styles.price}> {isNaN(item.price*100) ? '' : Math.round(item.price * 1000) /1000}</Text>
      </Pressable>
    )
  }

    return (
      <View style={styles.container}>
        <FlatList
          data = {cryptoList}
          renderItem = {renderItem}
          keyExtractor = {item => item.id}
        > 
        </FlatList>
        {/* <Text>Home Screen</Text>
        <Pressable onPress={navigateToDetail}> 
          <Text> See Details</Text>
        </Pressable> */}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2272d42',
    flex: 1,
    color: '#fff',
  },
  crypto: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#000',
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  name: {
    color: '#fff',
    fontSize: 24,
  },
  price: {
    color: '#fff',
    fontSize: 24,
  },
})


