import io from "socket.io-client";

import {
    Chart as ChartJS,
    CategoryScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LinearScale,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const socket = io("http://localhost:5000");
type ResponseType = {
    price: number;
    day: number;
};

function App() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <h2>Real-time stock price visualizer</h2>
            <RealTimeChart />
        </div>
    );
}

const RealTimeChart = () => {
    const [dataPoints, setDataPoints] = useState<ResponseType[]>([]);

    // only first time get the data from server
    useEffect(() => {
        // server sends data at the interval of 2 seconds
        socket.on("stockData", (data) => {
            setDataPoints((cur) => [
                ...cur,
                { price: data.price, day: data.day },
            ]);
        });
    }, []);

    // create data object that chart will expect
    const chartData = {
        labels: dataPoints.map((point) => point.day),
        datasets: [
            {
                label: "Stock Price",
                data: dataPoints.map((points) => points.price),
                fill: false,
                borderColor: "rgba(38,123,23,1)",
            },
        ],
    };

    return (
        <div style={{ width: "1000px", height: "500px" }}>
            <Line data={chartData} />
        </div>
    );
};

export default App;
