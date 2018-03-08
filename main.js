var http = require('http')
var server = http.createServer((req, res) => {
  console.log(req.headers)
  console.log(req.url)
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
server.listen(1141, () => {
  console.log('listening 1141')
})
