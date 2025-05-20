import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./RequestManagerPage.module.css";
import NewRequestModal from "../../components/NewRequestModal/NewRequestModal";
import { useState } from "react";
import { RequestType } from "../../enum/RequestType.enum";
import { FullRequestData } from "../../interfaces/RequestData.interface";

const RequestManagerPage = () => {
  const defaultRequest: FullRequestData = {
    id: 0,
    user: 0,
    requestTitle: "",
    requestBody: "",
    requestType: RequestType.Standard,
  };

  const [isOpenNewRequestModal, setIsOpenNewRequestModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [requestToManage, setRequestToManage] = useState<FullRequestData>(defaultRequest);
  const [requestType, setRequestType] = useState<RequestType>(RequestType.Standard);

  const userColumns: TableColumn<FullRequestData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    {
      type: "data",
      field: "requestTitle",
      headerName: "Solicitud",
      width: "auto",
      sortable: false,
      renderCell(_value, row) {
        return row.requestType === RequestType.AppUpload ? row.appTitle : row.requestTitle;
      },
    },
    { type: "data", field: "requestType", headerName: "Tipo", width: 130, sortable: false },
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
              activateNewRequestModal(row.id!);
              setRequestType(row.requestType);
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

  const userData: FullRequestData[] = [
    {
      id: 1,
      user: 1,
      requestTitle: "Solicitud 1",
      requestBody: "Solicitud 1",
      requestStatus: "Pendiente",
      requestDate: "2023-01-01",
      requestType: RequestType.Standard,
    },
    {
      id: 2,
      user: 1,
      requestTitle: "Solicitud 2.1",
      appTitle: "Solicitud 2",
      appDescription: "Solicitud 2",
      publishApp: false,
      downloadableNow: true,
      appZipFile: new File([], ""),
      appIconFile: new File([], ""),
      appImageFile: new File([], ""),
      selectedCategories: [
        {
          id: 1,
          name: "FPS",
          categoryType: "game",
        },
      ],
      selectedDeveloperId: 1,
      requestStatus: "Pendiente",
      requestDate: "2023-01-02",
      requestType: RequestType.AppUpload,
    },
    {
      id: 3,
      user: 1,
      requestTitle: "Solicitud 3",
      requestBody: "Solicitud 3",
      requestStatus: "Aceptada",
      requestDate: "2023-01-03",
      requestType: RequestType.Standard,
    },
    {
      id: 4,
      user: 1,
      requestTitle: "Solicitud 4",
      requestBody: "Solicitud 4",
      requestStatus: "Aceptada",
      requestDate: "2023-01-04",
      requestType: RequestType.Standard,
    },
    {
      id: 5,
      user: 1,
      requestTitle: "Solicitud 5",
      requestBody: "Solicitud 5",
      requestStatus: "Aceptada",
      requestDate: "2023-01-05",
      requestType: RequestType.Standard,
    },
    {
      id: 6,
      user: 1,
      requestTitle: "Solicitud 6",
      requestBody: "Solicitud 6",
      requestStatus: "Aceptada",
      requestDate: "2023-01-06",
      requestType: RequestType.Standard,
    },
    {
      id: 7,
      user: 1,
      requestTitle: "Solicitud 7",
      requestBody: "Solicitud 7",
      requestStatus: "Aceptada",
      requestDate: "2023-01-07",
      requestType: RequestType.Standard,
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
        setRequestType(request.requestType ? request.requestType : RequestType.Standard);
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
    setRequestType(RequestType.Standard);
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
