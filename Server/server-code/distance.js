const express=require('express');

const app=express();
var axios = require('axios');

const latitude=17.330916;
const longitude=78.5298748

var config = {
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=restaurant&key=AIzaSyACxL5Qd3gp4-wYl5tOjiYTlIqXRvQbIAc`,
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(response.data.results[0]);
})
.catch(function (error) {
  console.log(error);
});

app.listen(3000,()=>{
    console.log(`Server running at 3000`);
})