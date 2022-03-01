const express = require('express');
const path = require('path');
const app = express();
app.use(express.static('public'))
const port = process.env.PORT || 8080;

app.get('/HomePage', function(req, res) {
    res.sendFile(path.join(__dirname, './Public/Home.html'));
});
app.get('/planing_ui_5',function(req,res){
    res.sendFile(path.join(__dirname,'./Public/planing_ui_5.html'))
})

app.listen(port);

console.log('Server started at http://localhost:' + port)