import { useState, useEffect, useCallback } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { TableColumn } from "../../interfaces/CustomTable.interface";
import styles from "./CategoryManagerPage.module.css";
import { CategoryData, CategoryFormData, CategoryType } from "../../interfaces/Category.interface";
import categoryService from "../../services/CategoryService";

const CategoryManagerPage = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<CategoryFormData>({
    id: null,
    name: "",
    categoryType: CategoryType.GAME,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tmp_data = await categoryService.getAllCategories();
      console.log("TEMP DATA", tmp_data);
      const data = tmp_data!.map((category) => ({
        id: category.categoryId,
        name: category.categoryName,
        categoryType: category.categoryType,
      }));
      console.log(data);

      setCategoriesData(data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError("No se pudieron cargar las categorías. Inténtalo de nuevo.");
      setCategoriesData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({
      id: null,
      name: "",
      categoryType: CategoryType.GAME,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryData) => {
    setModalMode("edit");
    setFormData({
      id: category.id,
      name: category.name,
      categoryType: category.categoryType,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryToDelete: CategoryData) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete.name}"?`
      )
    ) {
      setIsLoading(true);
      setError(null);
      try {
        await categoryService.deleteCategory(categoryToDelete.id!);
        await fetchCategories();
      } catch (err) {
        console.error("Error al eliminar categoría:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const categoryTypeDisplayNames: Record<string, string> = {
    [CategoryType.GAME]: "Juego",
    [CategoryType.APP]: "Aplicación",
  };

  const categoryColumns: TableColumn<CategoryData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 10, sortable: true },
    { type: "data", field: "name", headerName: "Categoría", width: "auto", sortable: true },
    {
      type: "data",
      field: "categoryType",
      headerName: "Tipo",
      width: 30,
      sortable: true,
      renderCell(value) {
        return categoryTypeDisplayNames[value as string] || String(value);
      },
    },
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
              handleOpenEditModal(row);
            }}
            disabled={isLoading}
          >
            Editar
          </button>
          <button
            className={styles.actionButtonDelete}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCategory(row);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CategoryFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      setError("El nombre de la categoría no puede estar vacío.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("FormData:", formData);

      if (modalMode === "edit" && formData.id !== null) {
        const updatedCategory = await categoryService.updateCategory(formData.id, {
          categoryName: formData.name.trim(),
          type: formData.categoryType,
        });
        if (updatedCategory) {
          await fetchCategories();
          closeModal();
        } else {
          setError("No se pudo actualizar la categoría, la respuesta no fue la esperada.");
        }
      } else if (modalMode === "add") {
        const createdCategory = await categoryService.createCategory({
          categoryName: formData.name.trim(),
          type: formData.categoryType,
        });
        if (createdCategory) {
          await fetchCategories();
          closeModal();
        } else {
          setError("No se pudo crear la categoría, la respuesta no fue la esperada.");
        }
      }
    } catch (err) {
      console.error(`Error al ${modalMode === "add" ? "crear" : "actualizar"} categoría:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle = modalMode === "add" ? "Añadir Nueva Categoría" : "Editar Categoría";
  const saveButtonText = isLoading ? "Guardando..." : "Guardar";

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Categorías</h2>
            <button
              onClick={handleOpenAddModal}
              className={styles.titleActionButton}
              disabled={isLoading && !isModalOpen}
            >
              {isLoading && !isModalOpen ? "Cargando..." : "Añadir Categoría"}
            </button>
          </div>

          {error && !isModalOpen && <p className={styles.errorMessageGlobal}>{error}</p>}
          {isLoading && !isModalOpen && categoriesData.length === 0 && (
            <p>Cargando categorías...</p>
          )}

          {!isLoading && categoriesData.length === 0 && !error && (
            <p>No hay categorías para mostrar. Intenta añadir una.</p>
          )}

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
        <div className={styles.modalOverlay} onClick={isLoading ? undefined : closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{modalTitle}</h3>
            {error && <p className={styles.errorMessageModal}>{error}</p>}

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
                disabled={isLoading}
              />
            </div>

            <div className={styles.modalFormField}>
              <label htmlFor="categoryType">Tipo de Categoría:</label>
              <select
                id="categoryType"
                name="categoryType"
                value={formData.categoryType}
                onChange={handleInputChange}
                className={styles.modalInput}
                disabled={isLoading}
              >
                <option value={CategoryType.GAME}>Juego</option>
                <option value={CategoryType.APP}>Aplicación</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={handleSaveCategory}
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

export default CategoryManagerPage;
