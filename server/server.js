const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));

const tasksRoute = require('./routes/tasks.routes.js');
app.use('/tasks', tasksRoute);

app.use(express.static('server/public'));

// Start listening for requests on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server running on', PORT);
})