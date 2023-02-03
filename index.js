const Owlbot = require('owlbot-js');
require("dotenv").config();

const client = Owlbot(process.env.OWL_TOKEN);

client.define('owl').then(function(result){
   console.log(result);
});