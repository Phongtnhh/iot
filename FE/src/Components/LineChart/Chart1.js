import React, { useEffect, useState } from 'react';
const { URL } = require('../Helper/URL');  // Đảm bảo bạn có URL cho API

const Chart1 = ({ onDataUpdate }) => {
    const [chartData, setChartData] = useState({
        categories: [],
        temperature: [],
        humidity: [],
        light: [],
        windspeed: []
    });

    // Hàm fetch dữ liệu từ API
    const fetchData = () => {
        fetch(URL + '/load')
            .then(res => res.json())
            .then(data => {
                if (data && data.results) {
                    const time = data.results.map(item => item.time);
                    const temperature = data.results.map(item => item.temperature);
                    const humidity = data.results.map(item => item.humidity);
                    const light = data.results.map(item => item.light / 10); // Chia ánh sáng cho 10 theo yêu cầu
                    const windspeed = data.results.map(item => item.windspeed);
                    const count = data.count || [0];

                    // Cập nhật dữ liệu cho biểu đồ
                    setChartData({
                        categories: time,
                        temperature: temperature,
                        humidity: humidity,
                        light: light,
                        windspeed: windspeed,
                    });

                    // Tạo dữ liệu gửi lên phần tử cha (lấy giá trị mới nhất)
                    const option = {
                        temperature: temperature[0], // Lấy giá trị mới nhất
                        humidity: humidity[0],
                        light: light[0],
                        windspeed: windspeed[0],
                        count: count
                    };

                    // Gửi dữ liệu lên phần tử cha
                    onDataUpdate(option);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    // Gọi API khi component mount và làm mới mỗi 5 giây
    useEffect(() => {
        fetchData();
        // const interval = setInterval(() => {
        //     fetchData();
        // }, 5000);

        // return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }, []);

    // Cấu hình biểu đồ
    useEffect(() => {
        if (window.Highcharts) {
            window.Highcharts.chart('container', {
                chart: {
                    type: 'line',
                    height: 400,
                },
                title: {
                    text: 'Biểu đồ Line Chart với 3 đường'
                },
                xAxis: {
                    categories: chartData.categories,
                    title: {
                        text: 'Thời gian'
                    }
                },
                yAxis: {
                    min: 0,
                    max: 120, // Đảm bảo trục Y có giá trị tối đa là 120
                    title: {
                        text: 'Giá trị'
                    }
                },
                series: [
                    {
                        name: 'Nhiệt độ (°C)',
                        data: chartData.temperature,
                        color: '#FF5733',
                    },
                    {
                        name: 'Độ ẩm (%)',
                        data: chartData.humidity,
                        color: '#33FF57',
                    },
                    {
                        name: 'Ánh sáng (Lux * 10)',
                        data: chartData.light,
                        color: '#FFEB3B',
                    },
                    // {
                    //     name: 'Tốc độ gió (Km/h)',
                    //     data: chartData.windspeed,
                    //     color: '#1976D2',
                    // }
                ],
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true,
                        },
                        enableMouseTracking: true,
                    }
                }
            });
        }
    }, [chartData]);  // Tái sử dụng effect khi chartData thay đổi

    return (
        <div
            id="container"
            style={{
                width: '100%',      // Tự động thay đổi chiều rộng theo container
                height: '420px',    // Chiều cao cố định
                margin: '0 auto',   // Căn giữa
            }}
        ></div>
    );
};

export default Chart1;
