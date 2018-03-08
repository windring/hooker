var http = require('http')
var crypto = require('crypto')
var config = require('./config.json')

console.log(crypto.createHash('sha1').update('12138').digest('hex'))

var server = http.createServer((req, res) => {
  console.log(req.headers)
  console.log(req.url)
  if (req.headers['x-github-event']) {
    console.log(req.headers['x-github-event'])
  }
  if (req.url) {
    var exec = require('child_process')
    exec.execFile('./sh/main.sh', (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        throw error
      }
      console.log(stdout)
    })
  }
  res.end('get')
})
server.listen(config.port, () => {
  console.log('listening ' + config.port)
})
