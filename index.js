const axios = require('axios');
const Owlbot = require('owlbot-js');

const client = Owlbot(YOUR_TOKEN);

client.define('owl').then(function(result){
   console.log(result);
});