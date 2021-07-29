
// ============================================================================
// LOAD THIRD PARTY LIBRARIES
// ============================================================================
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const schedule = require('node-schedule');
const db = require('./sql/queries.js')
const jwtutil = require('./routes/jwtutil.js');

const port = process.env.PORT

if (port === undefined) {
  console.log('Missing environment variables, cannot run app. Exiting...');
  process.exit(-1);
}
 

// ============================================================================
// UPGRADE DATABASE VERY EARLY
// ============================================================================
db.upgradeDB();
 
// ============================================================================
// EXPRESS CONFIGURATION
// ============================================================================
let app = express();

app.options('*', cors());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use(bodyParser.json());

app.use(helmet()); // adding Helmet to enhance your API's security
app.use(morgan('combined')); // adding morgan to log HTTP requests

// ============================================================================
// JOB SCHEDULER
// ============================================================================
 
/*

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

*/

// Periodic scan IMAP mails every 30 minutes (*/30)
const cronJob = schedule.scheduleJob('*/30 * * * *', function(){
//    getActionsFromImapServer();
});



// ============================================================================
// ROUTES, ORDER OF DECLARATION IS IMPORTANT
// ============================================================================
app.all('*', function (req, res, next) {
  console.log('Requested: ' + req.url);
  next(); // pass control to the next handler
});


const ApiRoot           = '/api/v1';
const dashboard_root    = require('./routes/dashboard/dashboard.js');
const auth_root         = require('./routes/auth/auth.js');
const servers_root      = require('./routes/servers/servers.js');

app.use(ApiRoot + '/dashboard', dashboard_root);
app.use(ApiRoot + '/auth', auth_root);
app.use(ApiRoot + '/servers', servers_root);

// ============================================================================
// 404 CUSTOM ERROR PAGE
// ============================================================================
// catch 404 and forward to error handler
// Please call this function after all defined routes, as this is the default one!
app.use(function(req, res) {
  console.log('bad url: ' + req.url);
  res.status(404);
});

// ============================================================================
// START APPLICATION
// ============================================================================
app.listen(port, function () {
  console.log('[HTTP] TarotClub web server is started on port: ' + port);
});
