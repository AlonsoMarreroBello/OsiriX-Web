/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./DeveloperManagerPage.module.css";
import InputField from "../../components/InputField/InputField";

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

  const [developerData, setDeveloperData] = useState<DeveloperData[]>([
    {
      id: 1,
      developer: "Alonso",
    },
    {
      id: 2,
      developer: "Maria",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeveloperName, setNewDeveloperName] = useState("");

  const handleGlobalRowClick = (id: string | number) => {
    console.log("Clic en fila (global), ID:", id);
  };

  const openModal = () => {
    setNewDeveloperName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveDeveloper = () => {
    if (newDeveloperName.trim() === "") {
      alert("El nombre del desarrollador no puede estar vacío.");
      return;
    }
    console.log("Nuevo desarrollador a guardar:", newDeveloperName);
    closeModal();
  };

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Desarolladores</h2>
            <button onClick={openModal} className={styles.titleActionButton}>
              Añadir
            </button>
          </div>
          <div className={styles.tableCard}>
            <CustomTable
              columns={developerColumns}
              data={developerData} // Usar el estado para que la tabla se actualice si añades la lógica de guardado
              onRowClick={handleGlobalRowClick}
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Añadir Nuevo Desarrollador</h3>
            <div className={styles.modalFormField}>
              <InputField
                id="developerNameInput"
                label="Nombre del Desarrollador"
                placeholder="Ej: Juan Perez"
                value={newDeveloperName}
                onChange={(e) => setNewDeveloperName(e.target.value)}
                className={styles.modalInput}
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSaveDeveloper} className={styles.modalButtonSave}>
                Guardar
              </button>
              <button onClick={closeModal} className={styles.modalButtonCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperManagerPage;
