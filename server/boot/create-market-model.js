//var disableModelAllMethods = require('../ModelMethodsEraser.js').disableAllMethods;

module.exports = function(app) {
  app.models.Market.create(function(err) {
    if (err) throw err;
    console.log('> Market model created');

    //disableModelAllMethods(app.models.User);
  });
};
