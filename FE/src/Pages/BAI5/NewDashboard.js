import './NewDashboard.css';
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { URL } from '../../Components/Helper/URL';


// Hàm lưu và lấy trạng thái thiết bị từ localStorage
const getDeviceStateFromLocalStorage = (device) => JSON.parse(localStorage.getItem(device)) || false;
const saveDeviceStateToLocalStorage = (device, state) => localStorage.setItem(device, JSON.stringify(state));

function NewDashboard() {
  const [Led4, setLed4] = useState(getDeviceStateFromLocalStorage('Led4'));
  const [Led5, setLed5] = useState(getDeviceStateFromLocalStorage('Led5'));
  const [Led6, setLed6] = useState(getDeviceStateFromLocalStorage('Led6'));
 
  // Lưu trạng thái thiết bị vào localStorage khi thay đổi
  useEffect(() => {
    saveDeviceStateToLocalStorage('Led4', Led4);
    saveDeviceStateToLocalStorage('Led5', Led5);
    saveDeviceStateToLocalStorage('Led6', Led6);
  }, [Led4, Led5, Led6]);


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
    postDeviceState('led4', Led4, 'turn4');
    setLed4((prevState) => !prevState);
    // let interval;
    //     interval = setInterval(() => {
    //         fetch(`${URL}/check`)
    //         .then(res => res.json())         
    //         .then(data => {
    //             if(data && data.type === "Led4"){
    //                 console.log(data);
    //                 clearInterval(interval);
    //                 setLed4((prevState) => !prevState);

    //             }
    //         })
    //     },1000);
  };

  // Hàm bật/tắt nhiệt độ
  const toggleTemperature = () => {
    postDeviceState('led5', Led5, 'turn5');
    setLed5(Led5 => !Led5);
    // let interval;
    //     interval = setInterval(() => {
    //         fetch(`${URL}/check`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if(data && data.type === "Led4"){
    //                 console.log(data);
    //                 clearInterval(interval);
    //                 setLed5(Led5 => !Led5);

    //             }
    //         })
    //     },1000);
  };

  // Hàm bật/tắt điều hòa
  const toggleAirConditioner = () => {
    postDeviceState('led6', Led6, 'turn6');
    setLed6(Led6 => !Led6);
    // let interval;
    //     interval = setInterval(() => {
    //         fetch(`${URL}/check`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if(data && data.type === "Led4"){
    //                 console.log(data);
    //                 clearInterval(interval);
    //                 setLed6(Led6 => !Led6);

    //             }
    //         })
    //     },1000);
  };



  return (
    <div className="main">
      <div className="section">
        <div className="section-one">
          <div className="electric">
            <ul className="electric-list">
              <li className={Led4 ? 'electric-item activeLight' : 'electric-item'}>
                <div className="electric-box">
                  <input
                    checked={Led4}
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
                <div className="on-off">{Led4 ? 'On' : 'Off'}</div>
                <i
                  className={Led4 ? 'fa-regular fa-lightbulb electric-light show' : 'fa-regular fa-lightbulb electric-light'}
                  style={{ fontSize: '60px' }} // Áp dụng kích thước font 60px
                ></i>
                <p className="light">Led4</p>
              </li>
              <li className={Led5 ? 'electric-item activeTemperature' : 'electric-item'} >
                <div className="electric-box">
                  <input
                    checked={Led5}
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
                <div className="on-off">{Led5 ? 'On' : 'Off'}</div>
                <i
                  className={Led5 ? 'fa-regular fa-lightbulb electric-temperature show' : 'fa-regular fa-lightbulb electric-temperature'}
                  style={{ fontSize: '60px' }} // Áp dụng kích thước font 60px
                ></i>
                <p className="temperature">Led5</p>
              </li>
              <li className={Led6 ? 'electric-item activeHumidity' : 'electric-item'} > 
                <div className="electric-box">
                  <input
                    checked={Led6}
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
                <div className="on-off">{Led6 ? 'On' : 'Off'}</div>
                <i
                  className={Led6 ? 'fa-solid fa-circle-radiation electric-air show' : 'fa-solid fa-circle-radiation electric-air'}
                  style={{ fontSize: '60px' }} // Áp dụng kích thước font 60px
                ></i>
                <p className="air-conditioner">Led6</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export {NewDashboard};
