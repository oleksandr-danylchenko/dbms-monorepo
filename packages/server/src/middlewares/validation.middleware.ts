import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Request } from 'express-serve-static-core';

const collectErrorMessage = (errors: ValidationError[], property?: string): string => {
  const message = errors
    .flatMap((error: ValidationError) => Object.values(error.constraints || {}))
    .filter(Boolean)
    .join('\n ');
  if (message) {
    const topLevelPropertyStr = property ? `Property: ${property} ` : '';
    return topLevelPropertyStr + message;
  }
  return errors
    .map((error) =>
      error.children
        ? collectErrorMessage(error.children, property ? `${property} ${error.property}` : error.property)
        : ''
    )
    .filter(Boolean)
    .join('\n ');
};

const validationMiddleware =
  (
    type: any,
    value: keyof Request = 'body',
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true
  ): RequestHandler =>
  (req, res, next) => {
    validate(plainToClass(type, req[value]), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = collectErrorMessage(errors);
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };

export default validationMiddleware;
