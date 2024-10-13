import { sequelize } from "../config/db";
import { Model, DataTypes } from "sequelize";
import Post from "./posts";


class User extends Model {
    id!: number;
    name!: string;
    email!: string;
    password!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
},
    {
        sequelize,
        tableName: 'users',
        timestamps: true
    }
);

// Associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });

export default User;