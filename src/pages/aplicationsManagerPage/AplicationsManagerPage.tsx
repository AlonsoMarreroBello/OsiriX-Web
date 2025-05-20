import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./AplicationsManagerPage.module.css";

const ApplicationsManagerPage = () => {
  interface ApplicationData extends BaseDataRow {
    id: number;
    name: string;
    publsher: string;
    developer: string;
    isDownloadable: boolean;
    isShown: boolean;
    downloads: number;
  }

  const applicationColumns: TableColumn<ApplicationData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    {
      type: "data",
      field: "name",
      headerName: "Nombre",
      width: "auto",
      sortable: true,
    },
    { type: "data", field: "publsher", headerName: "Publisher", width: 100, sortable: true },
    { type: "data", field: "developer", headerName: "Developer", width: 100, sortable: true },
    {
      type: "data",
      field: "isDownloadable",
      headerName: "Descargable",
      width: 100,
      sortable: true,
    },
    {
      type: "data",
      field: "isShown",
      headerName: "Visible",
      width: 100,
      sortable: true,
    },
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
            {row.isShown ? "Ocultar" : "Mostrar"}
          </button>
          <button
            className={styles.actionButtonEdit}
            onClick={(e) => {
              e.stopPropagation();
              console.log(" Edit ", row);
            }}
          >
            Alternar descarga
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

  const applicationData: ApplicationData[] = [
    {
      id: 1,
      name: "OsiriX",
      publsher: "Alonso",
      developer: "Alonso",
      isDownloadable: true,
      isShown: true,
      downloads: 100,
    },
    {
      id: 2,
      name: "OsiriX",
      publsher: "Alonso",
      developer: "Alonso",
      isDownloadable: false,
      isShown: false,
      downloads: 0,
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
            <h2 className={styles.title}>Aplicaciones</h2>
          </div>
          <div className={styles.tableCard}>
            <CustomTable
              columns={applicationColumns}
              data={applicationData}
              onRowClick={handleGlobalRowClick}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default ApplicationsManagerPage;
