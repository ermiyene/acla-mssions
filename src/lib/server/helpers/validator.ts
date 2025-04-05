import { validate as cvValidate, ValidationError } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { NextApiRequest, NextApiResponse } from "next";

export function validate<T extends ClassConstructor<any>>(
  type: T,
  key: "body" | "query"
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const value = req[key];
    const plain = stringValuesToPrimitives(value);
    console.log({
      value,
      plain,
    });
    const transformedObject = plainToInstance(type, plain);

    const parseInnerValidationError = (errors: ValidationError[]): any => {
      if (errors.length > 0) {
        const messages = [];

        for (const error of errors) {
          if (error.constraints) {
            messages.push(...Object.values(error.constraints || {}));
          } else if (error.children) {
            return parseInnerValidationError(error.children);
          }
        }

        res.status(400).json({ message: messages.join(", ") });
        return false;
      }

      return true;
    };

    const result = await cvValidate(transformedObject, {
      enableDebugMessages: process.env.NODE_ENV === "development",
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    return parseInnerValidationError(result);
  };
}

export const stringValuesToPrimitives = (object: {
  [key: string]: any;
}): any => {
  return Object.keys(object).reduce((newObj, key) => {
    const value = object[key];

    // if value is not string, skip it
    if (typeof value !== "string") {
      newObj[key] = value;
      return newObj;
    }

    if (value === "true" || value === "false") {
      newObj[key] = value === "false" ? false : true;
    } else if (value === "undefined") {
      newObj[key] = undefined;
    } else if (value === "null") {
      newObj[key] = null;
    } else if (value?.startsWith("+")) {
      newObj[key] = value;
    } else if (!isNaN(+value)) {
      newObj[key] = Number(value);
    } else {
      newObj[key] = value;
    }

    return newObj;
  }, {} as any);
};
