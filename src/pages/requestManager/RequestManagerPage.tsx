import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./RequestManagerPage.module.css";
import NewRequestModal from "../../components/NewRequestModal/NewRequestModal";
import { useEffect, useState } from "react";
import { RequestType } from "../../enum/RequestType.enum";
import { FullRequestData } from "../../interfaces/RequestData.interface";
import requestService from "../../services/RequestService";
import { UserType } from "../../interfaces/UserData.interface";
import authService from "../../services/AuthService";

const RequestManagerPage = () => {
  const defaultRequest: FullRequestData = {
    id: 0,
    user: {
      id: 0,
      username: "",
      email: "",
      userType: UserType.user,
      isEnabled: true,
      accountNotLocked: true,
      lastLogin: "",
      registerDate: "",
    },
    requestTitle: "",
    requestBody: "",
    requestType: RequestType.Standard,
  };

  const [isOpenNewRequestModal, setIsOpenNewRequestModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [requestToManage, setRequestToManage] = useState<FullRequestData>(defaultRequest);
  const [requestType, setRequestType] = useState<RequestType>(RequestType.Standard);
  const [requestsList, setRequestsList] = useState<FullRequestData[]>([]);

  const mapRawRequestToFullRequestData = (rawRequest: FullRequestData): FullRequestData => {
    return {
      id: Number(rawRequest.requestId),
      user: rawRequest.user,
      requestTitle: rawRequest.app != undefined ? rawRequest.app.name : rawRequest.requestTitle,
      requestBody:
        rawRequest.app != undefined ? rawRequest.app.description : rawRequest.requestBody,
      requestStatus: rawRequest.requestStatus,
      requestDate: rawRequest.requestDate,
      requestType: rawRequest.app != undefined ? RequestType.AppUpload : RequestType.Standard,
      appTitle: rawRequest.app != undefined ? rawRequest.app.name : rawRequest.requestTitle,
      appDescription:
        rawRequest.app != undefined ? rawRequest.app.description : rawRequest.requestBody,
      publishApp: rawRequest.app != undefined ? rawRequest.app.isVisible : rawRequest.publishApp,
      downloadableNow:
        rawRequest.app != undefined ? rawRequest.app.isDownloadable : rawRequest.downloadableNow,
      appZipFile: rawRequest.appZipFile,
      appIconFile: rawRequest.appIconFile,
      appImageFile: rawRequest.appImageFile,
      selectedCategories:
        rawRequest.app != undefined ? rawRequest.app.categories : rawRequest.selectedCategories,
      selectedDeveloperId: rawRequest.selectedDeveloperId,
      requestId: Number(rawRequest.requestId),
      app: rawRequest.app,
    };
  };

  const fetchRequests = async () => {
    try {
      if (authService.getUserTypeFromToken() === "STAFF") {
        const [tmp_requests_raw, tmp_publicationRequest_raw] = await Promise.all([
          requestService.getAllRequests(),
          requestService.getAllPublicationRequests(),
        ]);

        const mappedRequests = (tmp_requests_raw || []).map(mapRawRequestToFullRequestData);
        const mappedPublicationRequests = (tmp_publicationRequest_raw || []).map(
          mapRawRequestToFullRequestData
        );

        const mergedRequestsMap = new Map<number, FullRequestData>();

        mappedRequests.forEach((req) => {
          mergedRequestsMap.set(req.id!, req);
        });

        mappedPublicationRequests.forEach((pubReq) => {
          mergedRequestsMap.set(pubReq.id!, pubReq);
        });

        const finalCombinedList = Array.from(mergedRequestsMap.values());

        finalCombinedList.sort((a, b) => a.id! - b.id!);

        setRequestsList(finalCombinedList);
      } else {
        const [tmp_requests_raw, tmp_publicationRequest_raw] = await Promise.all([
          requestService.getRequestsByUser(),
          requestService.getPublicationRequestsByUser(),
        ]);

        const mappedRequests = (tmp_requests_raw || []).map(mapRawRequestToFullRequestData);
        const mappedPublicationRequests = (tmp_publicationRequest_raw || []).map(
          mapRawRequestToFullRequestData
        );

        const mergedRequestsMap = new Map<number, FullRequestData>();

        mappedRequests.forEach((req) => {
          mergedRequestsMap.set(req.id!, req);
        });

        mappedPublicationRequests.forEach((pubReq) => {
          mergedRequestsMap.set(pubReq.id!, pubReq);
        });

        const finalCombinedList = Array.from(mergedRequestsMap.values());

        finalCombinedList.sort((a, b) => a.id! - b.id!);

        setRequestsList(finalCombinedList);
      }
    } catch (error) {
      console.error("Error al obtener o procesar las solicitudes:", error);
      setRequestsList([]);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userColumns: TableColumn<FullRequestData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    {
      type: "data",
      field: "requestTitle",
      headerName: "Solicitud",
      width: "auto",
      sortable: false,
      renderCell(_value, row) {
        return row.requestType === RequestType.AppUpload ? row.app?.name : row.requestTitle;
      },
    },
    {
      type: "data",
      field: "requestType",
      headerName: "Tipo",
      width: 130,
      sortable: false,
    },
    {
      type: "data",
      field: "user",
      headerName: "Usuario",
      width: 130,
      sortable: true,
      renderCell(_value, row) {
        return row.user.username;
      },
    },
    { type: "data", field: "requestStatus", headerName: "Estado", width: 80, sortable: true },
    { type: "data", field: "requestDate", headerName: "Fecha", width: 80, sortable: true },
    {
      type: "actions",
      headerName: "Acciones",
      width: 80,
      renderActions: (row) => (
        <div>
          <button
            className={row.requestStatus !== "ACCEPTED" ? styles.actionButtonEdit : styles.disabled}
            disabled={row.requestStatus === "ACCEPTED"}
            onClick={(e) => {
              e.stopPropagation();
              activateNewRequestModal(row.id!);
              setRequestType(row.requestType);
              if (row.requestStatus === "ACCEPTED") {
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

  const handleGlobalRowClick = (id: string | number) => {
    requestsList.forEach((element) => {
      if (element.id === id) {
        console.log("Clic en fila del elemento:", element);
      }
    });
  };

  const activateNewRequestModal = (id?: string | number) => {
    setIsOpenNewRequestModal(true);
    if (id) {
      const request = requestsList.find((request) => request.id === id);
      if (request) {
        setIsEditing(true);
        setRequestType(request.requestType ? request.requestType : RequestType.Standard);
        if (request.app) {
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
    fetchRequests();
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
            {authService.getUserTypeFromToken() !== "STAFF" && (
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
                <button
                  onClick={() => activateNewRequestModal()}
                  className={styles.newRequestButton}
                >
                  Nueva solicitud
                </button>
              </div>
            )}
          </div>
          <div className={styles.tableCard}>
            <CustomTable
              columns={userColumns}
              data={requestsList}
              onRowClick={handleGlobalRowClick}
            />
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
