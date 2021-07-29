import { Reviver } from './json-parse-reviver';

export interface ISerializer {
  parse<T>(json: string, reviver?: Reviver): T;
  stringify<T>(object: T): string;
}
