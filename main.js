var http = require('http')
var crypto = require('crypto')
var config = require('./config.json')

function getHash (alg, str, secret) {
  var hmac = crypto.createHmac(alg, secret)
  hmac.update(str)
  return hmac.digest('hex').toString()
}

function exec (file) {
  var exec = require('child_process')
  exec.execFile(file, (error, stdout, stderr) => {
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
  var selected = 1
  for (var index in config.projects) {
    if (config.projects[index].url === req.url) {
      selected = config.projects[index]
      console.log('selected ' + req.url)
    }
  }
  if (selected === 1) {
    res.end('illegal request')
    console.log(req.url + ' is illegal')
    return
  }
  req.on('data', (data) => {
    if (!req.headers['x-github-event']) return
    console.log('event:' + req.headers['x-github-event'])
    if (!~selected.event.indexOf(req.headers['x-github-event'])) return
    console.log('to get hash')
    var [alg, reqhash] = req.headers['x-hub-signature'].split('=')
    var pashash = getHash(alg, data, selected.secret)
    console.log('reqhash=' + reqhash)
    console.log('pashash=' + pashash)
    if (pashash !== reqhash) return
    console.log('exec start')
    exec(selected.execFile)
    console.log('exec end')
  })
  req.on('end', () => {
    console.log('request end')
  })
  res.end('get')
})
server.listen(config.port, () => {
  console.log('listening ' + config.port)
})
