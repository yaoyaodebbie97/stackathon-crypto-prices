import React, {useEffect, useState} from 'react';
import { Text, View, ActivityIndicator, StyleSheet,ScrollView,useWindowDimensions} from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html'; // can click on the text in the overview/background section
import {CryptoMarketDataInit, CryptoProfileInit} from '../models/crypto';


export const DetailScreen = ({route}: {route: any}) => {
    const id = route.params.id // use route to receive data 
    const {width} = useWindowDimensions();
    console.log('this is my id',id)
    const [cryptoProfile, setCryptoProfile] = useState(CryptoProfileInit);
    const [cryptoMarketData, setCryptoMarketData] = useState(CryptoMarketDataInit);
    const [cryptoDataLoading, setCryptoDataLoading] = useState(true); // if loading, show the loading sign 

    useEffect(() => {
      Promise.all([ // combine two calls, making into an array 
        axios.get(`http://192.168.4.220:3000/cryptos/market-data/${id}`),
        axios.get(`http://192.168.4.220:3000/cryptos/profile/${id}`), // can put https/lh:30000 in a envrionment variable  
      ]).then(([resMarketData, resProfile]) => {
        setCryptoMarketData(resMarketData.data); // setcryptomarket data with the reponse market data 
        setCryptoProfile(resProfile.data);
        setCryptoDataLoading(false); // finish loading 
      });
    }, []);

    return (
      <>
      {!cryptoDataLoading && (
         <View style={styles.container}>

           <View style = {styles.header}>
             <View style = {styles.headerInfo}>
                <Text style = {styles.name}>{cryptoProfile.name}</Text> 
                <Text style = {styles.symbol}>{cryptoProfile.symbol}</Text> 
                <Text style = {styles.price}>{`$${Math.round(cryptoMarketData.market_data.price_usd * 100)/ 100}`}</Text> 
             </View>

             <View style = {styles.headerTagLine}>
                <Text style = {styles.line}>{cryptoProfile.profile.general.overview.tagline}</Text> 
             </View>
           </View>

          <View style={styles.priceChanges}>
            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percent Change in last hour</Text>
              <Text style={styles.line}>
                {`${Math.round(cryptoMarketData.market_data.percent_change_usd_last_1_hour * 100)/100} %`}
              </Text>
            </View>

            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percent Change in last 24h</Text>
              <Text style={styles.line}>
                {`${Math.round(cryptoMarketData.market_data.percent_change_usd_last_24_hours * 100)/100} %`}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.cryptoInfo}> 
            <View style ={styles.cryptoInfoRow}>
              <Text style = {styles.cryptoInfoTitle}>Overview</Text>
              {/* <Text style = {styles.cryptoInfoText}>{cryptoProfile.profile.general.overview.project_details}</Text> */}
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.overview.project_details}</p>`,
                }}
              />
            </View>

            <View style ={styles.cryptoInfoRow}>
              <Text style = {styles.cryptoInfoTitle}>Background</Text>
              {/* <Text style = {styles.cryptoInfoText}>{cryptoProfile.profile.general.background.background_details}</Text> */}
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `<p style="color: #fff">${cryptoProfile.profile.general.background.background_details}</p>`,
                }}
              />
            </View>
          </ScrollView>

        </View>
      )}
      {cryptoDataLoading && (
        <ActivityIndicator size = 'large' color = '#00ff00'></ActivityIndicator>

      )}
       
      </>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#272d42',
      padding: 10,
      flex: 1,
    },
    header: {
      backgroundColor: '#000',
      height: 100,
      padding: 10,
      borderRadius: 10,
      marginBottom: 15,
    },
  
    headerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  
    headerTagLine: {
      marginTop: 10,
    },
  
    name: {
      fontSize: 24,
      color: '#fff',
    },
  
    symbol: {
      fontSize: 15,
      padding: 5,
      backgroundColor: '#272d42',
      color: '#fff',
    },
  
    price: {
      fontSize: 28,
      color: '#ffab00',
      width: 150,
      textAlign: 'right',
    },
  
    line: {
      color: '#fff',
      fontSize: 16,
    },
    priceChanges: {
      backgroundColor: '#000',
      height: 70,
      padding: 10,
      borderRadius: 10,
      marginBottom: 15,
    },
    priceChangeRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  
    cryptoInfo: {
      backgroundColor: '#000',
      padding: 10,
      flex: 1,
      borderRadius: 10,
      marginBottom: 15,
    },
    cryptoInfoTitle: {
      color: '#ffab00',// ue;;pw
      fontSize: 22,
      marginBottom: 5,
    },
    cryptoInfoRow: {
      flex: 1,
      marginBottom: 25,
    },
    cryptoInfoText: {
      color:'#fff', //white 
      fontSize: 16,

    }
  });
  
  const convert = (price: number) => {
    return Math.round(price * 100) / 100;
  };
  

