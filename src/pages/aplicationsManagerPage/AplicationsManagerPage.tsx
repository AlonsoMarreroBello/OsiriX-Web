import { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { ApplicationData } from "../../interfaces/AplicationData.interface";
import { TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./AplicationsManagerPage.module.css";
import appService from "../../services/AppService";

const ApplicationsManagerPage = () => {
  const [applicationData, setApplicationData] = useState<ApplicationData[]>([]);

  const fetchApplications = async () => {
    const tmp_data = await appService.getAllApps();
    const data = tmp_data!.map((app: ApplicationData) => ({
      id: Number(app.appId),
      name: app.name,
      publisher: app.publisher,
      developer: app.developer,
      isDownloadable: app.isDownloadable,
      isVisible: app.isVisible,
      isPublished: app.isPublished,
      downloads: app.downloads,
    }));
    console.log(data);

    setApplicationData(data || []);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const applicationColumns: TableColumn<ApplicationData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    {
      type: "data",
      field: "name",
      headerName: "Nombre",
      width: "auto",
      sortable: true,
    },
    {
      type: "data",
      field: "publsher",
      headerName: "Publisher",
      width: 100,
      sortable: true,
      renderCell(_value, row) {
        return row.publisher.publisherName;
      },
    },
    {
      type: "data",
      field: "developer",
      headerName: "Developer",
      width: 100,
      sortable: true,
      renderCell(_value, row) {
        return row.developer.name;
      },
    },
    {
      type: "data",
      field: "isPublished",
      headerName: "Publicado",
      width: 100,
      sortable: true,
    },
    {
      type: "data",
      field: "isDownloadable",
      headerName: "Descargable",
      width: 100,
      sortable: true,
    },
    {
      type: "data",
      field: "isVisible",
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
              handleToggleVisibility(row.id);
            }}
          >
            {row.isVisible ? "Ocultar" : "Mostrar"}
          </button>
          <button
            className={styles.actionButtonEdit}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDownloadable(row.id);
            }}
          >
            Alternar descarga
          </button>
          <button
            className={styles.actionButtonDelete}
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePublicate(row.id);
            }}
          >
            {row.isPublished ? "Publicar" : "Desactivar"}
          </button>
        </div>
      ),
    },
  ];

  const handleTogglePublicate = async (id: number) => {
    await appService.togglePublicateApp(id);
    await fetchApplications();
  };

  const handleToggleVisibility = async (id: number) => {
    await appService.toggleAppVisibility(id);
    await fetchApplications();
  };

  const handleToggleDownloadable = async (id: number) => {
    await appService.toggleAppDownloadable(id);
    await fetchApplications();
  };

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
