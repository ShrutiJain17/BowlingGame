import { bool } from "aws-sdk/clients/signer";
import { Sequelize } from "sequelize/dist";
import { player } from "./models/player";
import { totalScore } from "./models/totalScore";

export class bowlingService {

    /**
     * Get details of all players
     * @param connectionManager : DB Connection
     * @returns : Promise of player data
     */
    public async getAllPlayerDetail(connectionManager: Sequelize): Promise<player[]> {
        try {
            player.initialize(connectionManager);
            const result = await player.findAll();
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
     * Get total of all players
     * @param connectionManager : DB Connection
     * @returns : Promise of total Score of players data
     */
    public async getAllPlayerTotal(connectionManager: Sequelize) : Promise<totalScore[]>{
        try {
            totalScore.initialize(connectionManager);
            const result = await totalScore.findAll();
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
     * Get detail of 1 player
     * @param connectionManager : DB Connection
     * @param Id : Id of the player 
     * @returns : Player detail
     */
    public async getPlayerDetailByID(connectionManager: Sequelize, id: number): Promise<player> {
        try {
            player.initialize(connectionManager);
            const result = await player.findByPk(id, { raw: true });
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * To find the winner of game
     * @param connectionManager : DB Connection
     * @returns : Total score
     */
    public async getWinner(connectionManager: Sequelize): Promise<totalScore> {
        try {
            const players = await this.getAllPlayerDetail(connectionManager);
            // Iterate through each player and calculate total score
            players.forEach(async player => {
                let totalScore = await this.calculateTotalScore(player);
                let playerData = {
                    id: player.id,
                    name: player.name,
                    total: totalScore
                };
                // Insert the total score of each player in totalScore table
                this.insertTotal(connectionManager, playerData);
            });
            // Get all the players with total score
            const playersTotal = await this.getAllPlayerTotal(connectionManager);
            // Find the player with max score
            const winnerPlayer = playersTotal.find(x => x.total === Math.max.apply(Math, playersTotal.map(function (o) { return o.total; })))
            return Promise.resolve(winnerPlayer);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Calculate total score of player
     * @param playerData : Data of single player
     * @returns : total score
     */
    public async calculateTotalScore(playerData: player): Promise<number> {
        try {
            let score = 0;
            // Convert the chances into array of chances
            let frame: any[] = playerData.chances.split(' ');
            // For perfect score check strikes in all chances
            if (playerData.chances.replace(/\s/g, "") === 'XXXXXXXXXXXX') {
                score = 300;
            } else {
                // For each frame iterate and check spare and strike
                for (let i = 0; i < frame.length; i++) {
                    if (i === frame.length - 1) {
                        // For 10th chance calculate extra chance given for strike and spare
                        frame = frame[i].split('')
                        for (let j = 0; j < frame.length; j++) {
                            !isNaN(frame[j]) && frame[j + 1] !== '/' ? score = score + parseInt(frame[j])
                                : frame[j] === 'X' || frame[j] === '/' ? score = score + 10
                                    : null
                        }
                    } else {
                        !isNaN(frame[i]) ? score = score + parseInt(frame[i][0]) + parseInt(frame[i][1])
                            : frame[i].includes('X') && !isNaN(frame[i + 1]) ? score = score + 10 + parseInt(frame[i + 1][0]) + parseInt(frame[i + 1][1])
                                : frame[i].includes('/') && !isNaN(frame[i + 1])  ? score = score + 10 + parseInt(frame[i + 1][0])
                                    : null

                        // need to add more conditions based on complex scenarios
                    }
                }
            }
            return Promise.resolve(score);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * inserts total value of player in the db
     * @param connectionManager : DB Connection
     * @param playerData : data of player 
     * @returns : Player with total score
     */
    public async insertTotal(connectionManager: Sequelize, playerData): Promise<totalScore | {}> {
        try {
            totalScore.initialize(connectionManager);
            const result = await totalScore.create(playerData);
            return Promise.resolve(result);
        } catch (err) {
            if (err.original.message === 'duplicate key value violates unique constraint "pk_opportunity"') {
                return {};
            } else {
                return Promise.reject(err.original.message);
            }
        }
    }

}
