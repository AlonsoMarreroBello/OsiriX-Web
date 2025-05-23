import { useState, useEffect, useCallback } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./DeveloperManagerPage.module.css";
import InputField from "../../components/InputField/InputField";
import { DeveloperData, DeveloperRequestDto } from "../../interfaces/Developer.interface";
import developerService from "../../services/DeveloperService";

const DeveloperManagerPage = () => {
  const [developerData, setDeveloperData] = useState<DeveloperData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeveloperName, setNewDeveloperName] = useState("");
  const [editingDeveloper, setEditingDeveloper] = useState<DeveloperData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevelopers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await developerService.getAllDevelopers();
      setDeveloperData(data || []);
    } catch (err) {
      console.error("Error al cargar desarrolladores:", err);
      setError("No se pudieron cargar los desarrolladores. Inténtalo de nuevo más tarde.");
      setDeveloperData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  const handleEdit = (developer: DeveloperData) => {
    setEditingDeveloper(developer);
    setNewDeveloperName(developer.name);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (developerToDelete: DeveloperData) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${developerToDelete.developer}?`)) {
      setIsLoading(true);
      setError(null);
      try {
        await developerService.deleteDeveloper(developerToDelete.id);
        await fetchDevelopers();
      } catch (err) {
        console.error("Error al eliminar desarrollador:", err);
        setError("Error al eliminar el desarrollador. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const developerColumns: TableColumn<DeveloperData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    { type: "data", field: "name", headerName: "Developer", width: "auto", sortable: true },
    {
      type: "actions",
      headerName: "Acciones",
      width: 30,
      renderActions: (row) => (
        <div>
          <button
            className={styles.actionButtonEdit}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            disabled={isLoading}
          >
            Editar
          </button>
          <button
            className={styles.actionButtonDelete}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            disabled={isLoading}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const handleGlobalRowClick = (id: string | number) => {
    console.log("Clic en fila (global), ID:", id);
  };

  const openModalForCreate = () => {
    setEditingDeveloper(null);
    setNewDeveloperName("");
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewDeveloperName("");
    setEditingDeveloper(null);
    setError(null);
  };

  const handleSaveDeveloper = async () => {
    if (newDeveloperName.trim() === "") {
      setError("El nombre del desarrollador no puede estar vacío.");
      return;
    }

    const developerPayload: DeveloperRequestDto = {
      name: newDeveloperName.trim(),
    };

    setIsLoading(true);

    try {
      if (editingDeveloper) {
        const updatedDeveloper = await developerService.updateDeveloper(
          editingDeveloper.id,
          developerPayload
        );
        if (updatedDeveloper) {
          await fetchDevelopers();
          closeModal();
        } else {
          setError("No se pudo actualizar el desarrollador, la respuesta no fue la esperada.");
        }
      } else {
        const createdDeveloper = await developerService.createDeveloper(developerPayload);
        if (createdDeveloper) {
          await fetchDevelopers();
          closeModal();
        } else {
          setError("No se pudo crear el desarrollador, la respuesta no fue la esperada.");
        }
      }
    } catch (err) {
      console.error("Error al guardar/actualizar desarrollador:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle = editingDeveloper ? "Editar Desarrollador" : "Añadir Nuevo Desarrollador";
  const saveButtonText = editingDeveloper
    ? isLoading
      ? "Actualizando..."
      : "Actualizar"
    : isLoading
      ? "Guardando..."
      : "Guardar";

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Desarrolladores</h2>
            <button
              onClick={openModalForCreate}
              className={styles.titleActionButton}
              disabled={isLoading}
            >
              {isLoading && !isModalOpen ? "Cargando..." : "Añadir"}
            </button>
          </div>
          {error && !isModalOpen && <p className={styles.errorMessageGlobal}>{error}</p>}
          {isLoading && !isModalOpen && <p>Cargando datos...</p>}

          {!isLoading && developerData.length === 0 && !error && (
            <p>No hay desarrolladores para mostrar.</p>
          )}

          <div className={styles.tableCard}>
            <CustomTable
              columns={developerColumns}
              data={developerData}
              onRowClick={handleGlobalRowClick}
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{modalTitle}</h3>
            {error && <p className={styles.errorMessageModal}>{error}</p>}
            <div className={styles.modalFormField}>
              <InputField
                id="developerNameInput"
                label="Nombre del Desarrollador"
                placeholder="Ej: Juan Perez"
                value={newDeveloperName}
                onChange={(e) => setNewDeveloperName(e.target.value)}
                className={styles.modalInput}
                disabled={isLoading}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={handleSaveDeveloper}
                className={styles.modalButtonSave}
                disabled={isLoading}
              >
                {saveButtonText}
              </button>
              <button
                onClick={closeModal}
                className={styles.modalButtonCancel}
                disabled={isLoading}
              >
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
