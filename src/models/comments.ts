import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import Post from './posts';
import User from './users';

class Comment extends Model {
  id!: number
  content!: string;
  postId!: number;
  userId!: number;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: DataTypes.TEXT,
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    indexes: [
      {
          fields: ['postId']
      },
      {
          fields: ['createdAt']
      },
  ],
  }
);


export default Comment;
