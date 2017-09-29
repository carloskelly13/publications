const Hapi = require("hapi")
const server = new Hapi.Server()

server.connection({ port: 5055, host: "localhost" })

server.route({
  method: "GET",
  path: "/",
  handler: (request, reply) => reply("Hello Carlos")
})

server.start(err => {
  if (err) {
    throw err
  }
  // eslint-disable-next-line no-console
  console.log(`Publications API running at ${server.info.uri}`)
})
