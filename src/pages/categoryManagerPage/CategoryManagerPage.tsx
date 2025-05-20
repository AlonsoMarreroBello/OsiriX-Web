import { useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./CategoryManagerPage.module.css";
import { CategoryData } from "../../interfaces/Category.interface";

const CategoryManagerPage = () => {
  const initialCategoryData: CategoryData[] = [
    {
      id: 1,
      name: "FPS",
      categoryType: "game",
    },
    {
      id: 2,
      name: "Estrategia",
      categoryType: "game",
    },
    {
      id: 3,
      name: "Productividad",
      categoryType: "app",
    },
  ];

  const [categoriesData, setCategoriesData] = useState<CategoryData[]>(initialCategoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<CategoryData>({
    id: null,
    name: "",
    categoryType: "game",
  });

  const categoryColumns: TableColumn<CategoryData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    { type: "data", field: "name", headerName: "Categoría", width: "auto", sortable: true },
    {
      type: "data",
      field: "categoryType",
      headerName: "Tipo",
      width: 60,
      sortable: true,
    },
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
              handleOpenEditModal(row);
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

  const handleGlobalRowClick = (id: string | number) => {
    console.log("Clic en fila (global), ID:", id);
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({
      id: null,
      name: "",
      categoryType: "game",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryData) => {
    setModalMode("edit");
    setFormData({
      id: category.id,
      name: category.name,
      categoryType: category.categoryType,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }

    if (modalMode === "add") {
      const newCategory: CategoryData = {
        id: null,
        name: formData.name,
        categoryType: formData.categoryType,
      };
      setCategoriesData((prev) => [...prev, newCategory]);
    } else if (modalMode === "edit" && formData.id !== null) {
      setCategoriesData((prev) =>
        prev.map((cat) =>
          cat.id === formData.id
            ? { ...cat, category: formData.name, categoryType: formData.categoryType } // Preserva la descripción original
            : cat
        )
      );
    }
    closeModal();
  };

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Categorías</h2>
            <button onClick={handleOpenAddModal} className={styles.titleActionButton}>
              Añadir Categoría
            </button>
          </div>
          <div className={styles.tableCard}>
            <CustomTable
              columns={categoryColumns}
              data={categoriesData}
              onRowClick={handleGlobalRowClick}
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{modalMode === "add" ? "Añadir Nueva Categoría" : "Editar Categoría"}</h3>

            <div className={styles.modalFormField}>
              <label htmlFor="name">Nombre de la Categoría:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.modalInput}
                autoFocus
              />
            </div>

            <div className={styles.modalFormField}>
              <label htmlFor="categoryType">Tipo de Categoría:</label>
              <select
                id="categoryType"
                name="categoryType"
                value={formData.categoryType}
                onChange={handleInputChange}
                className={styles.modalInput} // Reutilizamos clase, podrías crear una específica para select si necesitas más personalización
              >
                <option value="game">Juego</option>
                <option value="app">Aplicación</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button onClick={handleSaveCategory} className={styles.modalButtonSave}>
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

export default CategoryManagerPage;
