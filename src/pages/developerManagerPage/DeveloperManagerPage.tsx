import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./DeveloperManagerPage.module.css";

const DeveloperManagerPage = () => {
  interface DeveloperData extends BaseDataRow {
    id: number;
    developer: string;
  }

  const developerColumns: TableColumn<DeveloperData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    { type: "data", field: "developer", headerName: "Developer", width: "auto", sortable: true },
    {
      type: "actions",
      headerName: "Acciones",
      width: 10,
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

  const developerData: DeveloperData[] = [
    {
      id: 1,
      developer: "Alonso",
    },
    {
      id: 2,
      developer: "Alonso",
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
            <h2 className={styles.title}>Desarolladores</h2>
          </div>
          <div className={styles.tableCard}>
            <CustomTable
              columns={developerColumns}
              data={developerData}
              onRowClick={handleGlobalRowClick}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default DeveloperManagerPage;
