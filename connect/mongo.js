const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = async ({ uri }) => {
  //database connection
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }



  // When successfully connected
  mongoose.connection.on('connected', function () {
    console.log('💾  Mongoose default connection open to ' + uri.substring(0, 40) + '...');
  });

  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    console.log('💾  Mongoose default connection error: ' + err);
    console.log('=> if using local mongodb: make sure that mongo server is running \n' +
      '=> if using online mongodb: check your internet connection \n');
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('💾  Mongoose default connection disconnected');
  });

  await mongoose.connect(uri,
    //  options 
  );

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('💾  Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
}
