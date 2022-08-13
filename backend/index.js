require('dotenv').config();
const express = require('express')
const app = express();
const PORT = 3000;
const socketIO = require ('socket.io');
const axios = require ('axios');

app.use(express.json()) // middlware 

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})
const io = socketIO(server); // or call it socketHandler

// io.on('connection', () =>{
//     console.log('Client Connected');

//     setInterval(() =>{
//         io.emit('crypto', 'Hello Client')
//     }, 1000)
//     // after connection, emiting a message 
//     //       pass in event (so that front end can listen to)+ content of message 
//     // every 5 seconds fetch data from server and then send to client 
// })

io.on('connection', (socket) => {
    socket.on('disconnect', () =>{
        console.log('Client DisConnected')
    });
    console.log('Client Connected')
    io.emit('crypto', 'Hello Client!')

})

const getPrices = () => {
    axios
    .get(process.env.LIST_URL, {
        headers: {
            'x-messari-api-key': process.env.API_KEY,
        }
    })
    .then ((response) => {
        // console.log(response.data.data)
        const priceList = response.data.data.map((item)=>{
            return {
                id: item.id,
                name: item.symbol,
                price: item.metrics.market_data.price_usd
            }

        })
        io.emit('crypto', priceList)
    })
    .catch((err) => {
        console.log(err);
        io.emit('crypto', {
            error: true,
            message: 'Error Fetching Price Data'
        })
    })
}

setInterval(()=> {
    getPrices()
}, 10000)

// for profile info about a single crypto 
app.get('/cryptos/profile/:id', (req, res) =>{
    const cryptoId = req.params.id; // id is an url parameter (get from user)
    if (!cryptoId){ // if user did not pass in id 
        res.json({
            error:true, 
            message:'missing crypto id'
        })
    }

    axios
        .get(`${process.env.BASE_URL_V2}/${cryptoId}/profile`, {
        headers: {
            'x-messari-api-key': process.env.API_KEY,
        }
    }).then((responseData) => {
        res.json(responseData.data.data)

    }).catch((err) => {
        res.json({
            error: true,
            message: 'Error Fetching Price Data',
            errorDetails: err,
        })
    })
   
})

// for market data about a single crypto 
app.get('/cryptos/market-data/:id', (req, res) =>{
    const cryptoId = req.params.id; // id is an url parameter (get from user)
    if (!cryptoId){ // if user did not pass in id 
        res.json({
            error:true, 
            message:'missing crypto id'
        })
    }

    axios
        .get(`${process.env.BASE_URL_V1}/${cryptoId}/metrics/market-data`, {
        headers: {
            'x-messari-api-key': process.env.API_KEY,
        }
    }).then((responseData) => {
        res.json(responseData.data.data)

    }).catch((err) => {
        res.json({
            error: true,
            message: 'Error Fetching Price Data',
            errorDetails: err,
        })
    })
   
})