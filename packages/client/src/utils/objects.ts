/* eslint-disable @typescript-eslint/ban-types */

export const selectDefinedProperties = (obj: object) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== undefined));

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  }
  if (typeof value !== 'number' && value === '') {
    return true;
  }
  if (typeof value === 'undefined' || value === undefined) {
    return true;
  }
  if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  }
  return false;
};

export const areEmpty = (...values: (string | number | object)[]): boolean => values.every((value) => isEmpty(value));

export const moveArray = <T>(arr: T[], from: number, to: number): T[] => {
  const result = [...arr];
  const element = result[from];
  result.splice(from, 1);
  result.splice(to, 0, element);
  return result;
};
