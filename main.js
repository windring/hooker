var http = require('http')
var crypto = require('crypto')
var config = require('./config.json')

function getHash (alg, str) {
  var hmac = crypto.createHmac(alg, config.secret)
  hmac.update(str)
  return hmac.digest('hex').toString()
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
  console.log('ping!')
  console.log(new Date())
  req.on('data', (data) => {
    console.log(data)
    if (!req.headers['x-github-event']) return
    console.log(req.headers['x-github-event'])
    if (!~config.event.indexOf(req.headers['x-github-event'])) return
    console.log('to get hash')
    var [alg, githash] = req.headers['x-hub-signature'].split('=')
    var hash = getHash(alg, data)
    console.log(hash)
    if (hash !== githash) return
    exec()
  })
  req.on('end', () => {
    console.log('end')
  })
  res.end('get')
})
server.listen(config.port, () => {
  console.log('listening ' + config.port)
})
