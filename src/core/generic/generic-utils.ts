import _ from 'lodash';

const generateTag = (name: string) => {
  // remplace spaces with underscores
  let cleanedName = name.replace(/\W/g, '_');

  // Convert to lowercase
  cleanedName = cleanedName.toLowerCase();

  // Remove duplicate underscores
  cleanedName = cleanedName.replace(/__+/g, '_');

  return cleanedName;
};

const getPagination = (page: number, pageSize: number) => {
  page--;
  const limit = pageSize ? +pageSize : 3;
  const from = page >= 0 ? page * limit : 0;
  const to = page >= 0 ? from + pageSize - 1 : pageSize - 1;

  return { from, to };
};

const getUnmatchedValues = <T>(obj1: T, obj2: any): Partial<T> => {
  const unmatchedValues: Partial<T> = {};

  _.forOwn(obj1, (value, key) => {
    if (!_.isEqual(value, (obj2 as any)[key])) {
      unmatchedValues[key as keyof T] = value;
    }
  });

  return unmatchedValues;
};

const formatNumber = (number: number) => {
  // Convert to string
  let numStr = number.toString();

  // Insert commas for thousands seperators
  let withCommas = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return withCommas;
};

/**
 * Checks if a child component is null.
 */
const isChildNull = (children: JSX.Element) => {
  return Boolean(children.type() === null);
};

export {
  generateTag,
  getPagination,
  getUnmatchedValues,
  formatNumber,
  isChildNull,
};
