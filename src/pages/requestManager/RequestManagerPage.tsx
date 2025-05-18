import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./RequestManagerPage.module.css";
import NewRequestModal from "../../components/NewRequestModal/NewRequestModal";
import { useState } from "react";

const RequestManagerPage = () => {
  const [isOpenNewRequestModal, setIsOpenNewRequestModal] = useState(false);
  const [requestToManage, setRequestToManage] = useState<RequestData>({
    id: 0,
    user: "",
    requestTitle: "",
    requestStatus: "",
    requestDate: "",
  });

  interface RequestData extends BaseDataRow {
    id: number;
    user: string;
    requestTitle: string;
    requestStatus: string;
    requestDate: string;
  }

  const userColumns: TableColumn<RequestData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    {
      type: "data",
      field: "requestTitle",
      headerName: "Solicitud",
      width: "auto",
      sortable: false,
    },
    { type: "data", field: "user", headerName: "Usuario", width: 130, sortable: true },
    { type: "data", field: "requestStatus", headerName: "Estado", width: 80, sortable: true },
    { type: "data", field: "requestDate", headerName: "Fecha", width: 80, sortable: true },
    {
      type: "actions",
      headerName: "Acciones",
      width: 80,
      renderActions: (row) => (
        <div>
          <button
            className={row.requestStatus !== "Aceptada" ? styles.actionButtonEdit : styles.disabled}
            disabled={row.requestStatus === "Aceptada"}
            onClick={(e) => {
              e.stopPropagation();
              console.log(" Ver ", row);
              activateNewRequestModal(row.id);
              if (row.requestStatus === "Aceptada") {
                setIsOpenNewRequestModal(false);
              }
            }}
          >
            Gestionar
          </button>
        </div>
      ),
    },
  ];

  const userData: RequestData[] = [
    {
      id: 1,
      user: "Alonso",
      requestTitle: "Solicitud 1",
      requestStatus: "Pendiente",
      requestDate: "2023-01-01",
    },
    {
      id: 2,
      user: "Alonso",
      requestTitle: "Solicitud 2",
      requestStatus: "Pendiente",
      requestDate: "2023-01-02",
    },
    {
      id: 3,
      user: "Alonso",
      requestTitle: "Solicitud 3",
      requestStatus: "Aceptada",
      requestDate: "2023-01-03",
    },
    {
      id: 4,
      user: "Alonso",
      requestTitle: "Solicitud 4",
      requestStatus: "Aceptada",
      requestDate: "2023-01-04",
    },
    {
      id: 5,
      user: "Alonso",
      requestTitle: "Solicitud 5",
      requestStatus: "Aceptada",
      requestDate: "2023-01-05",
    },
    {
      id: 6,
      user: "Alonso",
      requestTitle: "Solicitud 6",
      requestStatus: "Aceptada",
      requestDate: "2023-01-06",
    },
    {
      id: 7,
      user: "Alonso",
      requestTitle: "Solicitud 7",
      requestStatus: "Aceptada",
      requestDate: "2023-01-07",
    },
  ];

  const handleGlobalRowClick = (id: string | number) => {
    console.log("Clic en fila (global), ID:", id);
  };

  const activateNewRequestModal = (id?: string | number) => {
    setIsOpenNewRequestModal(true);
    if (id) {
      const request = userData.find((request) => request.id === id);
      if (request) {
        setRequestToManage(request);
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Solicitudes</h2>
            <button onClick={() => activateNewRequestModal()} className={styles.newRequestButton}>
              Nueva solicitud
            </button>
          </div>
          <div className={styles.tableCard}>
            <CustomTable columns={userColumns} data={userData} onRowClick={handleGlobalRowClick} />
          </div>
          {isOpenNewRequestModal && <NewRequestModal requestToManage={requestToManage} />}
        </main>
      </div>
    </>
  );
};

export default RequestManagerPage;
