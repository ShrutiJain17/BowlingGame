'use strict';

import { isNil } from "lodash";
import { bowlingService } from "./bowling.service";

const db = require('./api/config/PGDBConnection');

async function getAllPlayerScore(event, context, callback) {
  const connectionManager = await db.getConnection();
  const bowlingServiceObj = new bowlingService();
  try {
    const result = await bowlingServiceObj.getAllPlayerDetail(connectionManager);
    if (!isNil(result)) {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } else {
      return {
        statusCode: 404,
        body: 'No data found!'
      }
    }
  }
  catch (e) {
    console.log(e);
    return {
      statusCode: e.statusCode || 500,
      body: 'Error: Could not find Players: ' + e
    }
  }
};

async function getPlayerScore(event, context, callback) {
  const connectionManager = await db.getConnection();
  const bowlingServiceObj = new bowlingService();
  try {
    const result = await bowlingServiceObj.getPlayerDetailByID(connectionManager, event.pathParameters.id);
    if (!isNil(result)) {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } else {
      return {
        statusCode: 404,
        body: 'No data found!'
      }
    }
  }
  catch (e) {
    console.log(e);
    return {
      statusCode: e.statusCode || 500,
      body: 'Error: Could not find Player by id: ' + event.pathParameters.id + e
    }
  }
};

async function getWinnerData(event, context, callback) {
  const connectionManager = await db.getConnection();
  const bowlingServiceObj = new bowlingService();
  try {
    const result = await bowlingServiceObj.getWinner(connectionManager);
    if (!isNil(result)) {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } else {
      return {
        statusCode: 404,
        body: 'No data found!'
      }
    }
  }
  catch (e) {
    console.log(e);
    return {
      statusCode: e.statusCode || 500,
      body: 'Error: Could not find Winner' + e
    }
  }
};

async function getTotalScore(event, context, callback) {
  const connectionManager = await db.getConnection();
  const bowlingServiceObj = new bowlingService();
  try {
    const player = await bowlingServiceObj.getPlayerDetailByID(connectionManager, event.pathParameters.id);
    const result = await bowlingServiceObj.calculateTotalScore(player);
    if (!isNil(result)) {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } else {
      return {
        statusCode: 404,
        body: 'No data found!'
      }
    }
  }
  catch (e) {
    console.log(e);
    return {
      statusCode: e.statusCode || 500,
      body: 'Error: Could not find Total score' + e
    }
  }
};

module.exports.getAllPlayerScore = getAllPlayerScore;
module.exports.getPlayerScore = getPlayerScore;
module.exports.getWinnerData = getWinnerData;
module.exports.getTotalScore = getTotalScore;
