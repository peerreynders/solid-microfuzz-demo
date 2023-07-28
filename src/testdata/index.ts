import { default as data } from './testdata';
import { default as companies } from './companies';
import { firstNames, lastNames } from './usernames';

// Returns a random integer between `min` and `max` (inclusive)
function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[randomNumber(0, array.length - 1)];
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generatePeople(n: number) {
  return Array(n)
    .fill(0)
    .map(() => {
      const firstName = capitalize(randomElement(firstNames));
      const lastName = capitalize(randomElement(lastNames));

      return `${firstName} ${lastName}`;
    });
}

const people = generatePeople(2137);

const testdata = new Map([
  ['companies', companies],
  ['people', people],
  ...Object.entries(data),
]);

export { testdata as default };
