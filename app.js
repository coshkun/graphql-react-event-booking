let http = require('http')
  , https = require('https')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser');

app.use(bodyParser.json())


app.get('/', (req, res, next) => {
    res.status(200).send('Welcome, API v.1.0.0')
})


//app.listen(3000)

http.createServer(app).listen(3000);
//https.createServer({ }, app).listen(443)

