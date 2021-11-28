import { nanoid } from 'nanoid';

export interface RowColumnValue {
  columnId: string;
  value: any;
}

export interface RowColumnsValuesIndex {
  [columnId: string]: RowColumnValue;
}

class Row {
  private readonly _id: string;
  private readonly _tableId: string;
  private readonly _columnsValuesIndex: RowColumnsValuesIndex;

  constructor({
    id,
    tableId,
    columnsValuesIndex,
  }: {
    id?: string;
    tableId: string;
    columnsValuesIndex: RowColumnsValuesIndex;
  }) {
    this._id = id || nanoid();
    this._tableId = tableId;
    this._columnsValuesIndex = columnsValuesIndex;
  }

  public get id(): string {
    return this._id;
  }

  public get tableId(): string {
    return this._tableId;
  }

  public get columnsValuesIndex(): RowColumnsValuesIndex {
    return this._columnsValuesIndex;
  }

  public getRowColumnValue(columnId: string): any {
    return this._columnsValuesIndex[columnId];
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
