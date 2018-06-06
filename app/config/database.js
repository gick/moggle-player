// config/database.js
module.exports = [{

    'url': 'mongodb://conception:reveriesConception@conception.reveries-project.fr/test?autSource=test' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

},{server: {
    socketOptions: {
      socketTimeoutMS: 0,
      connectTimeoutMS: 0
    }}
  }, { 'url': 'mongodb://localhost/game' }];

