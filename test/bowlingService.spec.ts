import * as sinon from 'sinon';
import * as chai from 'chai';
import { bowlingService } from '../api/bowling.service';
import { assert } from 'chai';
import { player } from '../api/models/player';
import { totalScore } from '../api/models/totalScore';
import { PlayerAttributeMap } from 'aws-sdk/clients/gamelift';
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const playersMock = require('./mockData/playersResponseMock.json');
const totalScoreMock = require('./mockData/playersTotalScoreResponseMock.json');
var SequelizeMock = require('sequelize-mock');
var dbMock = new SequelizeMock();
dbMock.QueryTypes = { "SELECT": "SELECT" };
var playerModelMock = dbMock.define('player', playersMock[0], { });
var totalScoreModelMock = dbMock.define('totalScore', totalScoreMock[0], { });
describe("Test Handler", () => {
    beforeEach(() => {
      sinon.stub(player, 'initialize').callsFake();
      sinon.stub(totalScore, 'initialize').callsFake();
      sinon.stub(player, 'findAll').callsFake(function results() {
        return Promise.resolve(playersMock);
      });
      sinon.stub(totalScore, 'findAll').callsFake(function results() {
        return Promise.resolve(totalScoreMock);
      });
      sinon.stub(totalScore, 'create').callsFake(() => totalScoreModelMock.create());
    });

    afterEach(() => {
      sinon.restore();
    })

    it("should get the player by id", async () => {
      const bowlingServiceObj = new bowlingService();
      sinon.stub(player, 'findByPk').callsFake(() => playersMock.find((x=> x.id == 3)));	
      try {
          const playerObj = await bowlingServiceObj.getPlayerDetailByID(dbMock, 3);
          console.log(playerObj);
          expect(playerObj.name).to.equal('Gloria Burke');
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should get the score of player by name", async () => {
      const bowlingServiceObj = new bowlingService();
      sinon.stub(player, 'findByPk').callsFake(() => playersMock.find((x=> x.name == 'John Doe')));	
      try {
          const playerValue = playersMock.find((x=> x.name.includes('John')));
          const playerObj = await bowlingServiceObj.getPlayerDetailByID(dbMock, playerValue.id);
          console.log(playerObj);
          expect(playerObj.chances).to.equal('11 11 11 11 11 11 11 11 11 11');
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return no of players playing", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
          const playerObj = await bowlingServiceObj.getAllPlayerDetail(dbMock);
          console.log(playerObj);
          expect(playerObj.length).to.be.greaterThan(1);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return winner based on Total score", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
          const winnerPlayerObj = await bowlingServiceObj.getWinner(dbMock);
          console.log(winnerPlayerObj);
          expect(winnerPlayerObj.name).to.equal('Alexa Vega');
          expect(winnerPlayerObj.total).to.equal(97);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return total score of player if all values are numeric", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = '15 27 81 43 26 05 16 22 13 43';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(66);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return total score of player if all values are numeric with strike", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = 'X 11 11 11 X 11 11 11 11 11';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(40);
      } catch (err) {
          assert.fail(err);
      }
    });

    it.only("should return total score of player if all values are numeric with spare", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = '9/ 9/ 9/ 9/ 9/ 9/ 9/ 9/ 9/ 9/9';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(190);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return total score of player if all values are numeric with strike and last chance as strike", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = 'X 15 17 43 X 17 36 62 00 XXX';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(110);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return total score of player if all values are numeric with strike and spare and last chance as strike", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = 'X 15 17 43 X 17 36 62 45 3/X';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(109);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return total score of player if all values are numeric with strike and spare and last chance as strike and spare", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = 'X 15 17 43 X 17 36 / 62 3/X';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(116);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return total score of player for perfect score", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = 'X X X X X X X X X XXX';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(300);
      } catch (err) {
          assert.fail(err);
      }
    });

    it("should return total score of player if chances are less than 10", async () => {
      const bowlingServiceObj = new bowlingService();
      try {
        playersMock[0].chances = 'X 11 11 11 X 11 11';
          const totalScore = await bowlingServiceObj.calculateTotalScore(playersMock[0]);
          console.log(totalScore);
          expect(totalScore).to.equal(34);
      } catch (err) {
          assert.fail(err);
      }
    });
      
}
);

