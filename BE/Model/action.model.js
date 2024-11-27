const mongoose = require("mongoose");


const actionSchema = new mongoose.Schema(
    {
        stt:String,
        device:String,
        action:String,
        time:String
    }
);

const action = mongoose.model("action",actionSchema);

module.exports = action;

