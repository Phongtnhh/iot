import './Home.css';
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { URL } from '../../Components/Helper/URL';
import HightChart from '../../Components/LineChart/Chart1';
import Chart1 from '../../Components/LineChart/Chart1';

// Hàm lưu và lấy trạng thái thiết bị từ localStorage
const getDeviceStateFromLocalStorage = (device) => JSON.parse(localStorage.getItem(device)) || false;
const saveDeviceStateToLocalStorage = (device, state) => localStorage.setItem(device, JSON.stringify(state));

function Home() {
  const [lightState, setLightState] = useState(getDeviceStateFromLocalStorage('lightState'));
  const [temperatureState, setTemperatureState] = useState(getDeviceStateFromLocalStorage('temperatureState'));
  const [airConditionerState, setAirConditionerState] = useState(getDeviceStateFromLocalStorage('airConditionerState'));
  const [homeData, setHomeData] = useState({
    temperature: '',
    humidity: '',
    light: '',
    wind: '',
    warning: '0',
    count: 0,
  });

  // Lưu trạng thái thiết bị vào localStorage khi thay đổi
  useEffect(() => {
    saveDeviceStateToLocalStorage('lightState', lightState);
    saveDeviceStateToLocalStorage('temperatureState', temperatureState);
    saveDeviceStateToLocalStorage('airConditionerState', airConditionerState);
  }, [lightState, temperatureState, airConditionerState]);

  // Lấy dữ liệu lịch sử hành động
  const fetchActionHistory = async () => {
    try {
      const response = await fetch(`${URL}/actionhistory/check`);
      const data = await response.json();
      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.error('Failed to fetch action history:', error);
    }
  };

  // Gửi trạng thái bật/tắt thiết bị tới API
  const postDeviceState = async (device, state, turn) => {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const action = state ? 'Off' : 'On';

    const payload = {
      stt: '',
      device,
      action,
      turn,
      time: currentTime,
    };

    try {
      const response = await fetch(`${URL}/putAction`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.error(`Failed to post ${device} state:`, error);
    }
  };

  // Hàm bật/tắt đèn
  const toggleLight = () => {
    postDeviceState('light', lightState, 'turn1');
    setLightState((prevState) => !prevState);
    // let interval;
    //     interval = setInterval(() => {
    //         fetch(`${URL}/actionhistory/check`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if(data && data.type === "light"){
    //                 console.log(data);
    //                 clearInterval(interval);
    //                 setTurnOn(turnOn => !turnOn);

    //             }
    //         })
    //     },1000);
  };

  // Hàm bật/tắt nhiệt độ
  const toggleTemperature = () => {
    postDeviceState('temperature', temperatureState, 'turn2');
    setTemperatureState((prevState) => !prevState);
  };

  // Hàm bật/tắt điều hòa
  const toggleAirConditioner = () => {
    postDeviceState('air', airConditionerState, 'turn3');
    setAirConditionerState((prevState) => !prevState);
  };

  // Cập nhật dữ liệu mới
  const handleDataUpdate = (data) => {
    setHomeData({
      ...homeData,
      temperature: data.temperature,
      humidity: data.humidity,
      light: parseInt(data.light),
      windspeed: data.windspeed,
      warning: `${data.windspeed > 50 ? '1' : '0'}`,
      count: data.count,
    });
  };

  return (
    <div className="main">
      <div className="section">
        <div className="section-one">
          <div className="meter">
              <div className="hightChart">
              <h1>Ứng dụng Biểu đồ Line Chart</h1>
              <Chart1 onDataUpdate={handleDataUpdate}/>
              </div>
            <ul className="meter-list">
              <li
                className="meter-item meter-one"
                style={{ backgroundImage: 'linear-gradient(to bottom, white, white)' }}
              >
                <div className="div">
                   <i className="fa-regular fa-sun"></i>
                </div>
                <div className="sort">
                  <div className="light">Lights</div>
                  <div className="meter-digit">{homeData.light * 10} Lux</div>
                </div>
              </li>
              <li
                className="meter-item"
                style={{ backgroundImage: 'linear-gradient(to bottom, white, white)' }}
              >
                <div className="">
                  <i className="fa-solid fa-temperature-three-quarters"></i>
                </div>
                <div className="sort">
                <div className="temperature">Temperature</div>
                  <div className="meter-digit">{homeData.temperature}°C</div>
                </div>
              </li>
              <li
                className="meter-item"
                style={{ backgroundImage: 'linear-gradient(to bottom, white, white)' }}
              >
                <div className="">
                  <i className="fa-solid fa-droplet"></i>
                </div>
                <div className="sort">
                  <div className="humidity">Humidity</div>
                  <div className="meter-digit">{homeData.humidity}%</div>
                </div>
              </li>
            </ul>
          
          </div>
          <div className="electric">
            <ul className="electric-list">
              <li className={lightState ? 'electric-item activeLight' : 'electric-item'}>
                <div className="electric-box">
                  <input
                    checked={lightState}
                    type="checkbox"
                    className="electric-input"
                    id="electric-input1"
                  />
                  <label
                    htmlFor="electric-input1"
                    className="electric-label"
                     onClick={toggleLight}
                  ></label>
                </div>
                <div className="on-off">{lightState ? 'On' : 'Off'}</div>
                <i
                  className={lightState ? 'fa-regular fa-lightbulb electric-light show' : 'fa-regular fa-lightbulb electric-light'}
                  style={{ fontSize: '60px' }} // Áp dụng kích thước font 60px
                ></i>
                <p className="light">Lights</p>
              </li>
              <li className={temperatureState ? 'electric-item activeTemperature' : 'electric-item'} >
                <div className="electric-box">
                  <input
                    checked={temperatureState}
                    type="checkbox"
                    className="electric-input"
                    id="electric-input2"
                  />
                  <label
                    htmlFor="electric-input2"
                    className="electric-label"
                    onClick={toggleTemperature}
                  ></label>
                </div>
                <div className="on-off">{temperatureState ? 'On' : 'Off'}</div>
                <i
                  className={temperatureState ? 'fa-solid fa-temperature-three-quarters electric-temperature show' : 'fa-solid fa-temperature-three-quarters electric-temperature'}
                ></i>
                <p className="temperature">Temperature</p>
              </li>
              <li className={airConditionerState ? 'electric-item activeHumidity' : 'electric-item'} > 
                <div className="electric-box">
                  <input
                    checked={airConditionerState}
                    type="checkbox"
                    className="electric-input"
                    id="electric-input3"
                  />
                  <label
                    htmlFor="electric-input3"
                    className="electric-label"
                    onClick={toggleAirConditioner}
                  ></label>
                </div>
                <div className="on-off">{airConditionerState ? 'On' : 'Off'}</div>
                <i
                  className={airConditionerState ? 'fa-solid fa-fan electric-air show' : 'fa-solid fa-fan electric-air'}
                ></i>
                <p className="air-conditioner">Air conditioner</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
