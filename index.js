const Owlbot = require('owlbot-js');
require("dotenv").config();

const client = Owlbot(process.env.OWL_TOKEN);

client.define('owl')
  .then(result => console.log(result))
  .catch(error => console.error(`Error: ${error.message}`));