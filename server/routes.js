const request = require('request');

module.exports = function(app, express) {
  const api = express.Router();

  api.route('/create_account')
    // create an account
    .post(function(req, res) {
    	console.log(req.body);
	    request({
	       url: 'http://localhost:8545',
	       method: 'POST',
	       json: req.body
	   	}, function(error, response, body) {
	   		console.log(error);
		       if (error) {
		         res.send({
		             status: "failure",
		             data : body
		         });
		       } else {
		           res.send({
		               status: "success",
		               data: body
		           });
		       }
	   });

    });

    return api;
}