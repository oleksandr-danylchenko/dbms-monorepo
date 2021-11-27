import { nanoid } from 'nanoid';

export interface RowColumnValue {
  columnId: string;
  value: any;
}

export interface RowColumnValuesIndex {
  [columnId: string]: RowColumnValue;
}

class Row {
  private readonly _id: string;
  private readonly _tableId: string;
  private readonly _columnValuesIndex: RowColumnValuesIndex;

  constructor({ id, tableId, values }: { id: string; tableId: string; values: RowColumnValue[] }) {
    this._id = id || nanoid();
    this._tableId = tableId;
    this._columnValuesIndex = values.reduce((index, value) => {
      index[value.columnId] = value;
      return index;
    }, {} as RowColumnValuesIndex);
  }

  public get id(): string {
    return this._id;
  }

  public get tableId(): string {
    return this._tableId;
  }

  public get columnValuesIndex(): RowColumnValuesIndex {
    return this._columnValuesIndex;
  }

  public getRowColumnValue(columnId: string): any {
    return this._columnValuesIndex[columnId];
  }

  public getColumnValue(columnId: string): any {
    return this.getRowColumnValue(columnId)?.value;
  }

  public setColumnValue(columnId: string, value: any) {
    const rowColumn = this.getRowColumnValue(columnId);
    rowColumn.value = value;
  }
}

export default Row;
