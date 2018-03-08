var exec = require('child_process')
exec.execFile('./sh/main.sh', (error, stdout, stderr) => {
  if (error) {
    console.log(error)
    throw error
  }
  console.log(stdout)
})
