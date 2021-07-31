// ============================================================================
// LOAD THIRD PARTY LIBRARIES
// ============================================================================
const fastify = require('fastify')({ logger: true })
fastify.register(require('fastify-cors'), { 
// put your options here
});

fastify.setErrorHandler(function (error, request, reply) {
    console.log("[APP] Error: " + error);
    // Send error response
  })

const port = process.env.PORT

if (port === undefined) {
  console.log('Missing environment variables, cannot run app. Exiting...');
  process.exit(-1);
}

// ============================================================================
// ROUTES, ORDER OF DECLARATION IS IMPORTANT
// ============================================================================
const ApiRoot           = '/api/v1';

fastify.register(require('./routes/dashboard/user.js'), { prefix: ApiRoot + '/dashboard/user' });
fastify.register(require('./routes/auth/auth.js'), { prefix: ApiRoot + '/auth' });
fastify.register(require('./routes/servers/servers.js'), { prefix: ApiRoot + '/servers' });
fastify.register(require('./routes/docs/docs.js'), { prefix: ApiRoot + '/docs' });

// ============================================================================
// START APPLICATION
// ============================================================================
fastify.listen(port, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(fastify.printRoutes())
    console.log(`Server running, navigate to  https://localhost:${port}`)
  }
})
