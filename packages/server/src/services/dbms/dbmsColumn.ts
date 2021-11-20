import { nanoid } from 'nanoid';

class DbmsColumn {
  public id: string;
  public name: string;
  public type: string;
  private validationFunction: (value: unknown) => boolean;

  constructor(name: string, type: string) {
    this.id = nanoid();
    this.name = name;
    this.type = type;
    this.validationFunction = () => true;
  }

  public validate(value: unknown): boolean {
    return this.validationFunction(value);
  }
}

export default DbmsColumn;
