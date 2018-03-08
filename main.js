var http = require('http')
var server = http.createServer((req, res) => {
  console.log(req.headers)
  res.end()
})
server.listen(1141, '0.0.0.0')
