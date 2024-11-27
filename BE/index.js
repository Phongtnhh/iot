const express = require('express');
const app = express();
const port = 3001;
const cors = require("cors");
const dbConnect = require("./Config/database");
const mqtt = require('mqtt');

dbConnect();
app.use(cors());
app.use(express.json());
const ip = "172.20.10.4";
const dataMGDB = require("./Model/data.model");
const actionDataMGDB = require("./Model/action.model");
const mqttClient = mqtt.connect(`mqtt://${ip}:1994`, {
  username: 'vudanhphong',
  password: 'B21DCCN590'
});

// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   mqttClient.subscribe('datas', (err) => {
//     if (!err) {
//       console.log('Subscribed to newdata topic');
//     }
//   });
// });

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');

  mqttClient.subscribe('datas', (err) => {
    if (!err) {
      console.log('Subscribed to datas topic');
    }
  });

  mqttClient.subscribe('light/status', (err) => {
  console.log('Subscribed to light/status topic');
  });

  mqttClient.subscribe('temperature/status', (err) => {
  console.log('Subscribed to temperature/status topic');
  });

  mqttClient.subscribe('air/status', (err) => {
  console.log('Subscribed to air/status topic');
  });
  mqttClient.subscribe('Led4/status', (err) => {
  console.log('Subscribed to Led4/status topic');
  });
  mqttClient.subscribe('Led5/status', (err) => {
  console.log('Subscribed to Led5/status topic');
  });
  mqttClient.subscribe('Led6/status', (err) => {
  console.log('Subscribed to Led6/status topic');
  });
  
  
 
});

let latestStatus = null; 
mqttClient.on('message', async (topic, message) => {
  const data = message.toString();
  // console.log(`Received data: ${data}`);
  // console.log(latestStatus);
  try {
    if(topic ==="light/status"){
      console.log("light in action");
      latestStatus = { type: 'light', message: `${data}` };
    }else if(topic === "temperature/status"){
      console.log("temperature in action");
      latestStatus = { type: 'temperature', message: `${data}` };
      console.log(latestStatus);
    }else if(topic === "air/status"){
      console.log("air in action");
      latestStatus = { type: 'air', message: `${data}` };
    }else if(topic === "Led4/status"){
      latestStatus = { type: 'Led4', message: `${data}` };
    }else if(topic === "Led5/status"){
      latestStatus = { type: 'Led5', message: `${data}` };
    }else if(topic === "Led6/status"){
      latestStatus = { type: 'Led6', message: `${data}` };
    }else if(topic === "datas"){
      try {
        const parsedData = JSON.parse(data); // Phân tích chuỗi JSON
    
        // Tạo đối tượng mới từ model và lưu vào MongoDB
        const datas = new dataMGDB({
          stt: "", // hoặc một giá trị nào đó
          temperature: parsedData.temperature,
          humidity: parsedData.humidity,
          light: parsedData.light,
          time: formatDate(new Date()) // Sử dụng thời gian đã định dạng
      });
    
        await datas.save();
        // console.log('Data saved to MongoDB');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
    // console.log('Data saved to MongoDB');
  } catch (error) {
    console.error('Error saving data:', error);
    
  }
});

app.get('/check' ,async(req, res) => {
  try{
    if(latestStatus){
      res.json(latestStatus);
      latestStatus = null;
    }else
      res.json({
        code:400,
        status:"khong nhan dc phan hoi mqtt actionHistory"
      })
  }catch{
    res.json({
      code:400,
      status:"khong truy cap duoc api actionHistory"
    })
  }
})



function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



app.get('/function',async(req,res) => {
  try{
    
    console.log(req.query);
    const query ={};
    const  sort1 = {};
    const searchKey = req.query.searchKey;
    const searchValue = req.query.searchValue;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1)* limit;   
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    if(sortValue === 'asc'){
      sort1[sortKey] = 1;
    }else if(sortValue === 'desc'){
      sort1[sortKey] = -1;
    }

    if (startTime && endTime) {
        const formattedStartTime = startTime.replace('T', ' ');
        const formattedEndTime = endTime.replace('T', ' ');
        query.time = {
            $gte: formattedStartTime,
            $lte: formattedEndTime
        };
    }

    if(searchKey && searchValue){
      query[searchKey]=searchValue;
    }

    console.log(query);
    const data = await dataMGDB.find(query).sort(sort1).skip(skip).limit(limit);
    const total1 = await dataMGDB.find(query);
    let totalPages = Math.ceil(total1.length / limit);
    console.log(totalPages);
    if(!data){
      return res.status(400).json("không lấy được data");
    }else{
      return res.json({
        code:200,
        results:data,
        totalPages:totalPages,
      })
    }
  }catch(err){
    return res.status(404).json("Không truy cập vào api đc");
  }
})

app.get('/action',async (req,res) => {
  try{
    const query = ({});
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1)* limit;  
    const searchKey = req.query.searchKey;
    const searchValue = req.query.searchValue;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    if (startTime && endTime) {
      const formattedStartTime = startTime.replace('T', ' ');
      const formattedEndTime = endTime.replace('T', ' ');
      query.time = {
          $gte: formattedStartTime,
          $lte: formattedEndTime
      };
    }
    if(searchKey && searchValue){
      query[searchKey] = searchValue;
    }
    const data = await actionDataMGDB.find(query).sort({ time: -1 }).skip(skip).limit(limit);
    const total1 = await actionDataMGDB.find(query);
    const totalPages = Math.ceil(total1.length / limit);

    console.log(totalPages);
    if(!data){
      return res.status(400).json("không lấy được data");
    }else{
      return res.json({
        code:200,
        results:data,
        totalPages:totalPages,
      })
    }

  }catch(err)
  {
    return res.json({
      code:404,
      status:"khong truy cap api duoc"
    })
  }
})

app.post('/putAction',async (req,res) => {
    try{
      const option = req.body;
      console.log("----------------------");
      
      if(!option){
        return res.json({
          code:404,
          status:"khong co option gui len"
        })
      }else{
        const newAction = new actionDataMGDB({
          stt:option?.stt,
          device:option?.device,
          action:option?.action,
          time:option?.time,
        })
        console.log(newAction)

        await newAction.save();


        const message = option.action === "On" ? "on" : "off"; // Chọn nội dung tin nhắn tùy theo action
        mqttClient.publish(`${option.turn}`, message, { qos: 1 }, (error) => {
        if (error) {
          console.error('Error publishing to MQTT:', error);
        } else {
          console.log('Message published to MQTT:', message);
        }
        });

        return res.json({
          code:200,
          status:"Da luu action vao csdl",
        })
      }
    }catch{
      return res.json({
        code:404,
        status:"khong truy cap duoc api"
      })
    }
    
});


app.get('/load',async (req,res) => {
  try{
    const data = await dataMGDB.find({}).sort({time : -1 }).limit(10);
    if(!data){
      return res.json({
        code:404,
        status:"khong co data tra ve",
      })
    }else{
      return res.json({
        code:200,
        results:data,
      })
    }
  }catch(err){
    return res.json({
      code:404,
      status:"Khong truy cap duoc api"
    })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
