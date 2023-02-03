const Owlbot = require('owlbot-js');
require("dotenv").config();

const client = Owlbot(process.env.OWL_TOKEN);

client.define('owl').then((result) => console.log(result)).catch(function (error) {
   console.log('Error:', error.message);
});