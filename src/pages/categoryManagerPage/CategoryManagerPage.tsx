import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./CategoryManagerPage.module.css";

const CategoryManagerPage = () => {
  interface CategoryData extends BaseDataRow {
    id: number;
    category: string;
  }

  const categoryColumns: TableColumn<CategoryData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    { type: "data", field: "category", headerName: "Categoria", width: "auto", sortable: true },
    {
      type: "actions",
      headerName: "Acciones",
      width: 80,
      renderActions: (row) => (
        <div>
          <button
            className={styles.actionButtonEdit}
            onClick={(e) => {
              e.stopPropagation();
              console.log(" Edit ", row);
            }}
          >
            Editar
          </button>
          <button
            className={styles.actionButtonDelete}
            onClick={(e) => {
              e.stopPropagation();
              console.log(" Delete ", row);
            }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const categoryData: CategoryData[] = [
    {
      id: 1,
      category: "FPS",
    },
    {
      id: 2,
      category: "TPS",
    },
  ];

  const handleGlobalRowClick = (id: string | number) => {
    console.log("Clic en fila (global), ID:", id);
  };

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Categorias</h2>
          </div>
          <div className={styles.tableCard}>
            <CustomTable
              columns={categoryColumns}
              data={categoryData}
              onRowClick={handleGlobalRowClick}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default CategoryManagerPage;
