import { Model, DataTypes, Sequelize } from 'sequelize';

export class totalScore extends Model{
    id: number;
    name: string;
    total: number;

    public static initialize(sequelize: Sequelize) {
        totalScore.init({
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            total: {
                type: DataTypes.NUMBER,
                allowNull: true
            }
        }, {
            sequelize: sequelize,
            tableName: 'totalScore',
            timestamps: false,
        });
    }
}