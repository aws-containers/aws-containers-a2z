// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0


import express  from 'express';

//import AWS location services
import { LocationClient, CreatePlaceIndexCommand, SearchPlaceIndexForTextCommand, DescribePlaceIndexCommand } from "@aws-sdk/client-location";

//init Amazon Location Service and create a place Index
var locationParams = {
  apiVersion: '2020-11-19',
  // credentials are collected via the Environment variables
  //https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
};
var client = new LocationClient(locationParams);
var index = 'my_logistics_app';
var params = {
  DataSource: 'Here', /* required */
  IndexName: index, /* required */
  PricingPlan: 'RequestBasedUsage',
  DataSourceConfiguration: {
    IntendedUse: 'SingleUse'
  },
  Description: 'Place index for my_logistics_app'
};

//If the Place Index exists for my_logistics_app, we will reuse it otherwise we create one.
const myLogisticAppIndex = new DescribePlaceIndexCommand({IndexName: index});
// async/await.
var isIndexExist = true;
try {
  await client.send(myLogisticAppIndex);
} catch (error) {
  isIndexExist = false;
  const placeIndexCommand = new CreatePlaceIndexCommand(params);
    // async/await.
    try {
      await client.send(placeIndexCommand);
      // process data.
    } catch (error) {
      console.log(error, error.stack);
    } finally {
      console.log("placeIndex created")
    }
} finally {
  if(isIndexExist) console.log("PlaceIndex already exists")
}

//Create a server
const app = express();

app.listen(3000, () => {
  app.get('/searchplace/:text', async function(req, res) { //look for places
    console.log('Looking for the place '+req.params.text)
  
    var textLocation = req.params.text
    var params = {
      IndexName: index, /* required */
      Text: textLocation, /* required */
    };
    const searchCommand = new SearchPlaceIndexForTextCommand(params);
  
    try {
      var data = await client.send(searchCommand)
    } catch (error) {
      console.log(error, error.stack);
    } finally {
        console.log(data);
        res.statusCode = 200;
        res.send(data)
      }
    
    })
    
});

