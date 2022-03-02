const express = require('express');
const path = require('path');
const app = express();
const cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '50mb', extended: true })); // support encoded bodies


app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 8080;

app.get('/HomePage', function(req, res) {
    res.sendFile(path.join(__dirname, './Public/Home.html'));
});
app.get('/planing_ui_5',function(req,res){
    res.sendFile(path.join(__dirname,'./Public/planing_ui_5.html'))
})

app.use('/api/v1/planning_ui',require('./routes/planning_ui'))

app.listen(port);

console.log('Server started at http://localhost:' + port)