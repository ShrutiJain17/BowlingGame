import { Model, DataTypes, Sequelize } from 'sequelize';

export class player extends Model{
    id: number;
    name: string;
    chances: string

    public static initialize(sequelize: Sequelize) {
        player.init({
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            chances: {
                type: DataTypes.STRING(300),
                allowNull: true
            }
        }, {
            sequelize: sequelize,
            tableName: 'player',
            timestamps: false,
        });
    }
}