const axios = require('axios');
const Owlbot = require('owlbot-js');
require("dotenv").config();

const test = document.getElementById("test");

const client = Owlbot(process.env.OWL_TOKEN);

client.define('owl')
  .then(result => {
    console.log(result);
    test.innerHTML = result.definitions[0].type;
  })
  .catch(error => console.error(`Error: ${error.message}`));

axios({
   method: "get",
   url: `https://api.api-ninjas.com/v1/thesaurus?word=owl`,
   headers: {
      'X-Api-Key': process.env.SYNONYMS_TOKEN,
   },
 }).then((response) => {
   console.log(response.data);
 });