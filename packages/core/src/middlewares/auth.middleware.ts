import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken } from '@interfaces/auth.interface';
import userModel from '@models/users.model';

const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const Authorization = req.cookies['Authorization'] || req.header('Authorization')?.split('Bearer ')[1] || null;

    if (Authorization) {
      const secretKey = 'secretKey';
      const verificationResponse = jwt.verify(Authorization, secretKey) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = userModel.find((user) => user.id === userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
