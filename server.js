const app = require('express')();
const fs = require('fs');

app.get('/helloWorld', function(req, res) {
 res.send({'message': 'helloWorld'});
});


const server = app.listen(8080);