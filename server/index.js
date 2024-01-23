/**
 *
 * Making a realtime stock price visualization
 * where server send a socket message to client
 * client receice data in realtime and show it in form of graph or chart
 *
 */

const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = socketIo(server, {
    // called whitelisting || allowing some client to make requests
    cors: {
        origin: "http://localhost:5173", // allowed client to connect with server
        methods: ["GET", "POST"], // allowed http methods
    },
});

// a random start price between 50 to 150
let lastPrice = Math.random() * 100 + 50;
let day = 0;

io.on("connection", (socket) => {

    // server sends data at the interval of 2 seconds
    const interval = setInterval(() => {
        const changePercentage = 2 * Math.random(); // Max change of 2%
        let changeAmount = lastPrice * (changePercentage / 100);

        // set changeAmount in negative and positive
        changeAmount *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;

        lastPrice += changeAmount; // increment or decrement last price

        // send stockData to client on every 2 seconds
        socket.emit("stockData", { price: lastPrice, day: ++day });
    }, 2000);

    // clear the interval when client is disconnected
    socket.on("disconnect", () => {
        clearInterval(interval);
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log("Server is listening on PORT", PORT));
