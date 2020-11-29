const express = require('express')
const next = require('next')
const cors = require('cors')
const gitApi = require('@tinacms/api-git')


const port = parseInt(process.env.PORT, 10) || 1337
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(cors())
  server.use('/___tina', gitApi.router({
    pathToRepo: process.cwd(),
    pathToContent: '',

  }))

  server.all('*', (req, res) => handle(req, res))

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
