var http = require('http')
var crypto = require('crypto')
var config = require('./config.json')

function getHash (str) {
  var hmac = crypto.createHmac('sha1', config.secret)
  hmac.update()
  return hmac.digest('hex')
}

function exec () {
  var exec = require('child_process')
  exec.execFile('./sh/main.sh', (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      throw error
    }
    console.log(stdout)
  })
}

var server = http.createServer((req, res) => {
  req.on('data', (data) => {
    console.log(data)
    //if (!req.headers['x-github-event']) return
    console.log(req.headers['x-github-event'])
    //if (!~config.event.indexOf(req.headers['x-github-event'])) return
    console.log('get hash')
    var hash = getHash(data.toString())
    console.log(hash)
    exec()
  })
  res.end('get')
})
server.listen(config.port, () => {
  console.log('listening ' + config.port)
})
