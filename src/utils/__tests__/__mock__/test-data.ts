export const noFunctionString = 'const test = "Hello, World!";';
export const functionString =
  'function testFunction() { return "Hello, World!"; }';

// Multiple functions
export const multipleFunctionString = `
export const isSafeValue = (val: string | number | boolean) => {
  const strVal = String(val);
  return !['', 'undefined', 'NaN', 'null'].includes(strVal);
};
export const isSafeNumber = (val: string | number | boolean) => {
  const num = Number(val);

  return typeof val !== 'boolean' && isSafeValue(val) && isFinite(num);
};
export const convertTo32Fraction = (num: number | string, fractionDigits = 2) => {
  if (!isSafeNumber(num)) return num;
  if (fractionDigits > 32) {
    throw new Error('Fraction digits must be 32 or less');
  }
  return Number(num).toFixed(fractionDigits);
};

export const numberFractionFormat = (num: string | number, maxFractionDigits = 5) => {
  if (!isSafeNumber(num)) return num;
  return num;
};

/**
 * Convert a number to a short string representation of the number.
 * @param v The number to convert
 * @param fractionDigits The number of digits to use after the decimal point.
 * Defaults to 1.
 */
export const formatBigNumber = (v: string | number, fractionDigits = 1) => {
  if (!isSafeNumber(v)) return '';
  if (Number(v) === 0) return convertTo32Fraction(v, fractionDigits);

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const index = Math.floor(Math.log10(Math.abs(Number(v))) / 3);
  const value = Number(v) / Math.pow(1000, index);
  return value;
};

export class TestClass {
  constructor() {
    console.log('Hello, World!');
  }

  private testFunction() {
    console.log('Hello, World!');
  }
}

const testClass = new TestClass();
`;
