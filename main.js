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
  if (req.url !== config.url) {
    req.end('illegal request')
    console.log(req.url + 'is illegal')
    return
  }
  req.on('data', (data) => {
    if (!req.headers['x-github-event']) return
    console.log(req.headers['x-github-event'])
    if (!~config.event.indexOf(req.headers['x-github-event'])) return
    console.log('to get hash')
    var [alg, reqhash] = req.headers['x-hub-signature'].split('=')
    var pashash = getHash(alg, data)
    console.log('reqhash=' + reqhash)
    console.log('pashash=' + pashash)
    if (pashash !== reqhash) return
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
