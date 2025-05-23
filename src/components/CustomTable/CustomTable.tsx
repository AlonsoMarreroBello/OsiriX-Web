import { useCallback, useMemo, useState } from "react";
import {
  BaseDataRow,
  CustomTableProps,
  SortConfig,
  TableColumn,
} from "../../interfaces/CustomTable.interface";
import styles from "./CustomTable.module.css";
const IconSortAsc = () => <>▲</>;
const IconSortDesc = () => <>▼</>;
const IconSortDefault = () => <>↕</>;

const CustomTable = <T extends BaseDataRow>({
  columns,
  data,
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 20],
  onRowClick,
}: CustomTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: "ascending",
  });

  /**
   * Fetches the paginated data from the data array
   * @returns the paginated data
   */
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  /**
   * Sorted data from the paginated data
   */
  const sortedData = useMemo(() => {
    const sortableItems = [...paginatedData];
    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      sortableItems.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA == null && valB == null) return 0;
        if (valA == null) return direction === "ascending" ? 1 : -1;
        if (valB == null) return direction === "ascending" ? -1 : 1;
        if (typeof valA === "string" && typeof valB === "string") {
          return direction === "ascending" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === "number" && typeof valB === "number") {
          return direction === "ascending" ? valA - valB : valB - valA;
        }
        if (typeof valA === "boolean" && typeof valB === "boolean") {
          const boolValA = valA ? 1 : 0;
          const boolValB = valB ? 1 : 0;
          return direction === "ascending" ? boolValA - boolValB : boolValB - boolValA;
        }
        const strA = String(valA);
        const strB = String(valB);
        return direction === "ascending" ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }
    return sortableItems;
  }, [paginatedData, sortConfig]);

  /**
   * Requests a sort on the data
   * @param key the key of the column to be sorted
   * @returns void
   */
  const requestSort = useCallback(
    (key: keyof T) => {
      let direction: "ascending" | "descending" = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.key === key && sortConfig.direction === "descending") {
        setSortConfig({ key: null, direction: "ascending" });
        return;
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  /**
   * Gets the sort icon for a column
   * @param columnKey the key of the column
   * @returns the sort icon
   */
  const getSortIcon = (columnKey: keyof T) => {
    if (sortConfig.key !== columnKey) return <IconSortDefault />;
    if (sortConfig.direction === "ascending") return <IconSortAsc />;
    return <IconSortDesc />;
  };

  /**
   * Handles the click on a row
   * @param rowId the id of the row
   * @returns void
   */
  const handleEffectiveRowClick = (rowId: string | number) => {
    if (onRowClick) {
      onRowClick(rowId);
    }
  };

  /**
   * Gets the value of a cell
   * @param row the row
   * @param col the column
   * @returns the value of the cell
   */
  const getCellValue = (row: T, col: TableColumn<T>): React.ReactNode => {
    if (col.type === "actions") {
      return col.renderActions(row);
    }
    const value = row[col.field];
    if (col.renderCell) {
      return col.renderCell(value, row);
    }
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    return String(value);
  };

  const colSpanNoRows = columns.length;

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScrollContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.type === "actions" ? `action-col-header-${index}` : String(col.field)}
                  onClick={() => {
                    if (col.type === "data" && col.sortable !== false) {
                      requestSort(col.field);
                    }
                  }}
                  style={{ width: col.width || "auto" }}
                  className={
                    col.type === "data" && col.sortable !== false ? styles.sortableHeader : ""
                  }
                  scope="col"
                  aria-sort={
                    col.type === "data" && sortConfig.key === col.field
                      ? sortConfig.direction
                      : "none"
                  }
                >
                  {col.headerName || (col.type === "actions" ? "Acciones" : "")}
                  {col.type === "data" && col.sortable !== false && (
                    <span className={styles.sortIcon}>{getSortIcon(col.field)}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr
                  key={row.id}
                  className={styles.tableRow}
                  onClick={onRowClick ? () => handleEffectiveRowClick(row.id!) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter") handleEffectiveRowClick(row.id!);
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                >
                  {columns.map((col, index) => (
                    <td
                      key={`${row.id}-${col.type === "actions" ? `action-cell-${index}` : String(col.field)}`}
                    >
                      {getCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={colSpanNoRows} className={styles.noRows}>
                  No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages >= 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            aria-label="Página anterior"
          >
            Anterior
          </button>
          <span>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            aria-label="Página siguiente"
          >
            Siguiente
          </button>
          <select
            value={pageSize}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            aria-label="Items por página"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
