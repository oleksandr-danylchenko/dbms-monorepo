export interface RowColumnValue {
  columnId: string;
  value: any;
}

export interface RowColumnValuesIndex {
  [columnId: string]: RowColumnValue;
}

class Row {
  private readonly _columnValuesIndex: RowColumnValuesIndex;

  constructor({ values }: { values: RowColumnValue[] }) {
    this._columnValuesIndex = values.reduce((index, value) => {
      index[value.columnId] = value;
      return index;
    }, {} as RowColumnValuesIndex);
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
