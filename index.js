const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const Objectrouter = require('./routes/Objectrouter')

mongoose.connect(`mongodb+srv://shankarsddvv:BOGl8Ahh6TkuWPaZ@cluster0.n1g2l8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then((res) => console.log('connected'))
.catch((err) => console.log(err))
app.use('/public/images', express.static(path.join('public', 'images')))
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
const PORT = 3001
app.listen(PORT, () => {
    console.log('Server started');
})


app.use('/Object',Objectrouter);