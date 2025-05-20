import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./RequestManagerPage.module.css";
import NewRequestModal from "../../components/NewRequestModal/NewRequestModal";
import { useState } from "react";
import { RequestType } from "../../enum/RequestType.enum";

const RequestManagerPage = () => {
  const defaultRequest: RequestData = {
    id: 0,
    user: 0,
    requestTitle: "",
    requestBody: "",
  };

  const [isOpenNewRequestModal, setIsOpenNewRequestModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [requestToManage, setRequestToManage] = useState<RequestData>(defaultRequest);
  const [requestType, setRequestType] = useState<RequestType>(RequestType.Standard);

  interface RequestData extends BaseDataRow {
    id: number;
    user: number;
    requestDate?: string;
    requestStatus?: string;
    adminComments?: string;
    requestTitle: string;
    requestBody: string;
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
      user: 1,
      requestTitle: "Solicitud 1",
      requestBody: "Solicitud 1",
      requestStatus: "Pendiente",
      requestDate: "2023-01-01",
    },
    {
      id: 2,
      user: 1,
      requestTitle: "Solicitud 2",
      requestBody: "Solicitud 2",
      requestStatus: "Pendiente",
      requestDate: "2023-01-02",
    },
    {
      id: 3,
      user: 1,
      requestTitle: "Solicitud 3",
      requestBody: "Solicitud 3",
      requestStatus: "Aceptada",
      requestDate: "2023-01-03",
    },
    {
      id: 4,
      user: 1,
      requestTitle: "Solicitud 4",
      requestBody: "Solicitud 4",
      requestStatus: "Aceptada",
      requestDate: "2023-01-04",
    },
    {
      id: 5,
      user: 1,
      requestTitle: "Solicitud 5",
      requestBody: "Solicitud 5",
      requestStatus: "Aceptada",
      requestDate: "2023-01-05",
    },
    {
      id: 6,
      user: 1,
      requestTitle: "Solicitud 6",
      requestBody: "Solicitud 6",
      requestStatus: "Aceptada",
      requestDate: "2023-01-06",
    },
    {
      id: 7,
      user: 1,
      requestTitle: "Solicitud 7",
      requestBody: "Solicitud 7",
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
        setIsEditing(true);
        if (request.appId) {
          setRequestType(RequestType.AppUpload);
        } else {
          setRequestType(RequestType.Standard);
        }
        setRequestToManage(request);
      }
    } else {
      setIsEditing(false);
    }
  };

  const deactivateNewRequestModal = () => {
    setIsOpenNewRequestModal(false);
    setIsEditing(false);
    setRequestToManage(defaultRequest);
  };

  const handleRequestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequestType(e.target.value as RequestType);
  };

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Solicitudes</h2>
            <div className={styles.actionsHeader}>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={requestType}
                  onChange={handleRequestTypeChange}
                >
                  <option value={RequestType.Standard}>Solicitud estándar</option>
                  <option value={RequestType.AppUpload}>Solicitud de carga de aplicación</option>
                </select>
              </div>
              <button onClick={() => activateNewRequestModal()} className={styles.newRequestButton}>
                Nueva solicitud
              </button>
            </div>
          </div>
          <div className={styles.tableCard}>
            <CustomTable columns={userColumns} data={userData} onRowClick={handleGlobalRowClick} />
          </div>
          {isOpenNewRequestModal && (
            <NewRequestModal
              requestType={requestType}
              requestToManage={requestToManage}
              isEditing={isEditing}
              handleClose={deactivateNewRequestModal}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default RequestManagerPage;
