import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import User from './users';
import Comment from './comments';

class Post extends Model {
    id!: number
    content!: string;
    userId!: number;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        userId: DataTypes.INTEGER,
    },
    {
        sequelize,
        tableName: 'posts',
        timestamps: true,
        indexes: [
            {
                fields: ['userId']
            },
        ]
    }
);

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });

export default Post;
