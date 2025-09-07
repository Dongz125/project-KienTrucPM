import React from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Bar,
    Line,
} from "recharts";

interface CandleData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface Props {
    data: CandleData[];
}

const CandlestickChart: React.FC<Props> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
                />
                <YAxis yAxisId="left" domain={["auto", "auto"]} />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip
                    labelFormatter={(ts) => new Date(ts).toLocaleString()}
                    formatter={(value: any, name) => [
                        value,
                        name.toUpperCase(),
                    ]}
                />
                {/* Vẽ nến: thân là Bar, giá đóng và mở */}
                <Bar
                    yAxisId="left"
                    dataKey="close"
                    fill="#8884d8"
                    shape={(props) => {
                        const { x, y, width, height, payload } = props;
                        const color =
                            payload.close >= payload.open
                                ? "#22c55e"
                                : "#ef4444";
                        const candleHeight = Math.max(2, height);
                        const candleY =
                            payload.close >= payload.open
                                ? y
                                : y + (height - candleHeight);
                        return (
                            <rect
                                x={x}
                                y={candleY}
                                width={width}
                                height={candleHeight}
                                fill={color}
                                rx={1}
                            />
                        );
                    }}
                />
                {/* Vẽ đường high-low */}
                <Line
                    yAxisId="left"
                    dataKey="high"
                    stroke="#000"
                    dot={false}
                    hide={true}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default CandlestickChart;
