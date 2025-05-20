export interface BaseDataRow {
  id: string | number;
  [key: string]: string | number | boolean | null | undefined | Role[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

export interface DataColumnDefinition<T extends BaseDataRow> {
  type: "data";
  field: keyof T;
  headerName: string;
  width?: number | string;
  sortable?: boolean;
  renderCell?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface ActionColumnDefinition<T extends BaseDataRow> {
  type: "actions";
  headerName?: string;
  width?: number | string;
  renderActions: (row: T) => React.ReactNode;
}

// Tipo Unión para las columnas
export type TableColumn<T extends BaseDataRow> =
  | DataColumnDefinition<T>
  | ActionColumnDefinition<T>;

export interface CustomTableProps<T extends BaseDataRow> {
  columns: TableColumn<T>[];
  data: T[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (id: string | number) => void;
}

export interface SortConfig<T extends BaseDataRow> {
  key: keyof T | null;
  direction: "ascending" | "descending";
}
