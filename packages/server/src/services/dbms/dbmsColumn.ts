import { nanoid } from 'nanoid';
import { FieldType } from '@interfaces/dbms/dbms.interface';

class DbmsColumn {
  public id: string;
  public name: string;
  public type: FieldType;
  private validationFunction: (value: unknown) => boolean;

  constructor({ id, name, type }: { id?: string; name: string; type: FieldType }) {
    this.id = id || nanoid();
    this.name = name;
    this.type = type;
    this.validationFunction = () => true;
  }

  public validate(value: unknown): boolean {
    return this.validationFunction(value);
  }
}

export default DbmsColumn;
