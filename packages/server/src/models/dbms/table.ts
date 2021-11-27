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
  private readonly _columnsIndex: ColumnsIndex;
  private _columnsOrderIndex: string[];

  constructor({
    id,
    name,
    databaseId,
    columns,
    columnsOrderIndex,
  }: {
    id?: string;
    name: string;
    databaseId: string;
    columns?: Column[];
    columnsOrderIndex?: string[];
  }) {
    this._id = id || nanoid();
    this._name = name;
    this._databaseId = databaseId;
    this._columnsIndex = normalize(columns || []);
    this._columnsOrderIndex = columnsOrderIndex || [];
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

  public get columnsOrderIndex(): string[] {
    return this._columnsOrderIndex;
  }

  public set columnsOrderIndex(value: string[]) {
    this._columnsOrderIndex = value;
  }

  public getColumn(id: string): Column | undefined {
    return this._columnsIndex[id];
  }

  public get columnsAmount(): number {
    return this.columnsIds.length;
  }

  public addColumn(column: Column) {
    const { id: columnId } = column;
    this._columnsIndex[columnId] = column;
    this._columnsOrderIndex.push(columnId);
  }

  public removeColumn(column: Column) {
    const { id: columnId } = column;
    delete this._columnsIndex[columnId];
    this._columnsOrderIndex = this._columnsOrderIndex.filter((savedColumnId) => savedColumnId !== columnId);
  }
}

export default Table;
