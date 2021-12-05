import { nanoid } from 'nanoid';
import { normalize } from '@utils/normalization.helper';
import Column from '@models/dbms/column';

export interface ColumnsIndex {
  [columnId: string]: Column;
}

class Table {
  private readonly _id: string;
  private _name: string;
  private readonly _databaseId: string;
  private _columnsIndex: ColumnsIndex;

  constructor({
    id,
    name,
    databaseId,
    columns,
  }: {
    id?: string;
    name: string;
    databaseId: string;
    columns?: Column[];
  }) {
    this._id = id || nanoid();
    this._name = name;
    this._databaseId = databaseId;
    this._columnsIndex = normalize(columns || []);
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get databaseId() {
    return this._databaseId;
  }

  public get columnsIds(): string[] {
    return Object.keys(this._columnsIndex);
  }

  public get columns(): Column[] {
    return Object.values(this._columnsIndex);
  }

  public get columnsIndex(): ColumnsIndex {
    return this._columnsIndex;
  }

  public getColumn(id: string): Column | undefined {
    return this._columnsIndex[id];
  }

  public get columnsAmount(): number {
    return this.columnsIds.length;
  }

  public setColumns(columns: Column[]) {
    this._columnsIndex = {};
    columns.map((column) => {
      const { id: columnId } = column;
      this._columnsIndex[columnId] = column;
    });
  }

  public removeColumns(columnsIds: string[]) {
    columnsIds.map((columnId) => delete this._columnsIndex[columnId]);
  }
}

export default Table;
