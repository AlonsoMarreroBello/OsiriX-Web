import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./UserManagerPage.module.css";

const UserManagerPage = () => {
  interface UserData extends BaseDataRow {
    id: number;
    user: string;
    email: string;
    userType: string;
    userStatus: string;
  }

  const userColumns: TableColumn<UserData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    { type: "data", field: "user", headerName: "Usuario", width: 130, sortable: true },
    {
      type: "data",
      field: "email",
      headerName: "Correo",
      width: "auto",
      sortable: false,
    },
    { type: "data", field: "userType", headerName: "Tipo", width: 80, sortable: true },
    { type: "data", field: "userStatus", headerName: "Estado", width: 80, sortable: true },
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
            Desactivar
          </button>
        </div>
      ),
    },
  ];

  const userData: UserData[] = [
    {
      id: 1,
      user: "Alonso",
      email: "correo@correo.com",
      userType: "Admin",
      userStatus: "Enabled",
    },
    {
      id: 2,
      user: "Alonso",
      email: "correo@correo.com",
      userType: "Publisher",
      userStatus: "Enabled",
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
            <h2 className={styles.title}>Usuarios</h2>
          </div>
          <div className={styles.tableCard}>
            <CustomTable columns={userColumns} data={userData} onRowClick={handleGlobalRowClick} />
          </div>
        </main>
      </div>
    </>
  );
};

export default UserManagerPage;
