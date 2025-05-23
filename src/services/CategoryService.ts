import axios from "axios";
import { CategoryData, CategoryRequestDto, CategoryType } from "../interfaces/Category.interface";
import authService from "./AuthService";
import { toast } from "react-toastify";

interface CategoryResponseDto {
  categoryId: number;
  categoryName: string;
  categoryType: CategoryType;
}

/**
 * Fetches all categories from the API
 * @returns an Array of CategoryResponseDto objects or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getAllCategories = async (): Promise<CategoryResponseDto[] | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as CategoryResponseDto[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todas las categorías:", err);
    throw err;
  }
};

/**
 * Creates a new category in the API
 * @param {CategoryRequestDto} categoryData - The data to be sent in the request body.
 *
 * @returns the data of the created category or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const createCategory = async (categoryData: CategoryRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post(
      "http://localhost:8080/api/v1/categories",
      { ...categoryData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      toast.success("Categoría creada correctamente.");
      return response.data.data as CategoryData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al crear categoría:", err);
    toast.error("No se pudo crear la categoría. Inténtalo de nuevo.");
    throw err;
  }
};

/**
 * Deletes a category from the API
 * @param id the id of the category to be deleted
 * @returns the data of the deleted category or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const deleteCategory = async (id: number) => {
  try {
    const token = authService.getToken();
    const response = await axios.delete("http://localhost:8080/api/v1/categories/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      toast.success("Categoría eliminada correctamente.");
      return response.data.data as CategoryData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudo eliminar la categoría. Inténtalo de nuevo.");
    console.error("Error al eliminar categoría:", err);
    throw err;
  }
};

/**
 * Updates a category in the API
 * @param id the id of the category to be updated
 * @param categoryData  the data to be sent in the request body
 * @returns the data of the updated category or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const updateCategory = async (
  id: number,
  categoryData: CategoryRequestDto
): Promise<CategoryData | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.put(
      `http://localhost:8080/api/v1/categories/${id}`,
      { ...categoryData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      toast.success("Categoría actualizada correctamente.");
      return response.data.data as CategoryData;
    } else {
      console.warn(
        "La respuesta de la API (update) no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error(`Error al actualizar categoría con ID ${id}:`, err);
    throw err;
  }
};

const categoryService = {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
};

export default categoryService;
