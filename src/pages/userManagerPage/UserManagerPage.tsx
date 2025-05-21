import React, { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { TableColumn } from "../../interfaces/CustomTable.interface";
import InputField from "../../components/InputField/InputField";
import styles from "./UserManagerPage.module.css";
import { Role } from "../../services/AuthService";
import userService from "../../services/UserService";
import { NewUserForm, UserData, UserType } from "../../interfaces/UserData.interface";

const initialNewUserState: NewUserForm = {
  username: "",
  email: "",
  password: "",
  isEnabled: true,
  userType: UserType.user,
  publisherName: "",
  nif: "",
  address: "",
  assignedStaffId: 0,
  roleIds: [],
};

const UserManagerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>(initialNewUserState);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [staffList, setStaffList] = useState<UserData[]>([]);
  const [roleOptions, setRoleOptions] = useState<Role[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);

  const userColumns: TableColumn<UserData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 50, sortable: true },
    { type: "data", field: "username", headerName: "Usuario/Nombre", width: 180, sortable: true },
    { type: "data", field: "email", headerName: "Correo", width: "auto", sortable: false },
    {
      type: "data",
      field: "userType",
      headerName: "Tipo",
      width: 100,
      sortable: true,
      renderCell(_value, row) {
        return row.userType === null ? "USER" : row.userType;
      },
    },
    { type: "data", field: "isEnabled", headerName: "Habilitado", width: 100, sortable: true },
    {
      type: "actions",
      headerName: "Acciones",
      width: 130,
      renderActions: (row) => (
        <div className={styles.actionButtonsContainer}>
          <button
            className={`${styles.actionButton} ${styles.actionButtonEdit}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log(row);
              handleEditUser(row);
            }}
          >
            Editar
          </button>
          <button
            className={`${styles.actionButton} ${styles.actionButtonDelete}`}
            onClick={(e) => {
              e.stopPropagation();
              userService.togleUserEnabled(row.id).then(() => {
                fetchAllUsers();
              });
            }}
          >
            {row.isEnabled ? "Desactivar" : "Activar"}
          </button>
        </div>
      ),
    },
  ];

  const fetchAllUsers = async () => {
    try {
      setUserData([]);
      const [normalUsersResult, publishersResult, staffResult, rolesResult] = await Promise.all([
        userService.getAllNormalUsers(),
        userService.getAllPublishers(),
        userService.getAllStaffs(),
        userService.getStaffRoles(),
      ]);

      let combinedData: UserData[] = [];
      if (normalUsersResult) {
        combinedData = [...combinedData, ...normalUsersResult];
      }
      if (publishersResult) {
        combinedData = [...combinedData, ...publishersResult];
      }
      if (staffResult) {
        combinedData = [...combinedData, ...staffResult];
        setStaffList(staffResult);
      }
      if (rolesResult) {
        setRoleOptions(rolesResult);
      }

      setUserData(combinedData.sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error("Error al obtener todos los usuarios:", err);
      setUserData([]);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleGlobalRowClick = (id: string | number) => {
    console.log("Clic en fila (global), ID:", id);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setNewUserForm(initialNewUserState);
    setIsModalOpen(true);
  };

  const handleEditUser = (userToEdit: UserData) => {
    setEditingUser(userToEdit);
    const staffMember = staffList.find((s) => s.username === userToEdit.assignedStaff);

    let formUserType: UserType = UserType.user;

    if (userToEdit.userType != null) {
      const incomingUserType = userToEdit.userType;

      if (typeof incomingUserType === "string") {
        const typeKey = (incomingUserType as string).toLowerCase() as keyof typeof UserType;
        if (UserType[typeKey] !== undefined && typeof UserType[typeKey] === "number") {
          formUserType = UserType[typeKey];
        } else {
          console.warn(`Tipo de usuario (string) desconocido desde datos: ${incomingUserType}`);
          const numericValue = parseInt(incomingUserType, 10);
          if (!isNaN(numericValue) && UserType[numericValue] !== undefined) {
            formUserType = numericValue as UserType;
          }
        }
      } else if (typeof incomingUserType === "number") {
        const numericEnumValues = Object.values(UserType).filter(
          (value) => typeof value === "number"
        ) as UserType[];

        if (numericEnumValues.includes(incomingUserType as UserType)) {
          formUserType = incomingUserType as UserType;
        } else {
          console.warn(
            `Valor numérico de tipo de usuario inválido desde datos: ${incomingUserType}`
          );
        }
      } else {
        console.warn(`Tipo de dato no esperado para userType: ${typeof incomingUserType}`);
      }
    }

    setNewUserForm({
      id: userToEdit.id,
      username: userToEdit.username,
      email: userToEdit.email,
      password: "",
      isEnabled: userToEdit.isEnabled,
      userType: formUserType,
      publisherName: userToEdit.publisherName || "",
      nif: userToEdit.nif || "",
      address: userToEdit.address || "",
      assignedStaffId: staffMember ? staffMember.id : 0,
      roleIds:
        userToEdit.userType === UserType.staff && userToEdit.roles
          ? userToEdit.roles.map((role) => role.id)
          : [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setNewUserForm(initialNewUserState);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name || target.id;
    let processedValue: string | boolean | number | number[] | "" | UserType; // Renombrado para claridad

    if (target.type === "checkbox") {
      processedValue = (target as HTMLInputElement).checked;
    } else if (target.type === "select-multiple") {
      const options = (target as HTMLSelectElement).options;
      const selectedValues: number[] = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          selectedValues.push(Number(options[i].value));
        }
      }
      processedValue = selectedValues;
    } else {
      processedValue = target.value;
      if (name === "userType") {
        processedValue = Number(target.value) as UserType;
      }
    }

    setNewUserForm((prev) => {
      const updatedForm = { ...prev, [name]: processedValue };

      if (name === "userType" && !editingUser) {
        const newType = processedValue as UserType;
        if (newType !== UserType.publisher) {
          updatedForm.publisherName = "";
          updatedForm.nif = "";
          updatedForm.address = "";
          updatedForm.assignedStaffId = 0;
        }
        if (newType !== UserType.staff) {
          updatedForm.roleIds = [];
        }
      }
      console.log(updatedForm);
      return updatedForm;
    });
  };

  const getRolesFromForm = (): string[] => {
    const roleIds = newUserForm.roleIds;
    if (roleIds) {
      const roleNamesWithPossibleUndefined = roleIds.map(
        (id) => roleOptions.find((r) => r.id === id)?.roleName
      );

      // Filtrar los undefined y decirle a TypeScript que el resultado es string[]
      return roleNamesWithPossibleUndefined.filter(
        (roleName): roleName is string => roleName !== undefined
      );
    }
    return [];
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      console.log("EDITANDO");
      if (newUserForm.userType === UserType.user) {
        userService
          .updateUser(newUserForm.id!, {
            username: newUserForm.username,
            email: newUserForm.email,
            password: newUserForm.password!,
          })
          .then(() => {
            fetchAllUsers();
          });
      } else if (newUserForm.userType === UserType.staff) {
        userService
          .updateStaff(newUserForm.id!, {
            username: newUserForm.username,
            email: newUserForm.email,
            password: newUserForm.password!,
            assgnedPublisherIds: [],
            roleNames: getRolesFromForm(),
          })
          .then(() => {
            fetchAllUsers();
          });
      } else {
        userService
          .updatePublisher(newUserForm.id!, {
            username: newUserForm.username,
            email: newUserForm.email,
            password: newUserForm.password!,
            nif: newUserForm.nif!,
            publisherName: newUserForm.publisherName!,
            address: newUserForm.address!,
            assignedAdminId: newUserForm.assignedStaffId!,
          })
          .then(() => {
            fetchAllUsers();
          });
      }
    } else {
      console.log("CREANDO");
      if (newUserForm.userType === UserType.user) {
        userService
          .createUser({
            username: newUserForm.username,
            email: newUserForm.email,
            password: newUserForm.password!,
          })
          .then(() => {
            fetchAllUsers();
          });
      } else if (newUserForm.userType === UserType.staff) {
        userService
          .createStaff({
            username: newUserForm.username,
            email: newUserForm.email,
            password: newUserForm.password!,
            assgnedPublisherIds: [],
            roleNames: getRolesFromForm(),
          })
          .then(() => {
            fetchAllUsers();
          });
      } else {
        userService
          .createPublisher({
            username: newUserForm.username,
            email: newUserForm.email,
            password: newUserForm.password!,
            nif: newUserForm.nif!,
            publisherName: newUserForm.publisherName!,
            address: newUserForm.address!,
            assignedAdminId: newUserForm.assignedStaffId!,
          })
          .then(() => {
            fetchAllUsers();
          });
      }
    }
    closeModal();
  };

  const userTypeOptions: { value: NewUserForm["userType"]; label: string }[] = [
    { value: UserType.user, label: "User" },
    { value: UserType.publisher, label: "Publisher" },
    { value: UserType.staff, label: "Staff" },
  ];

  return (
    <>
      <div className={styles.container}>
        <CustomHeader />
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Usuarios</h2>
            <button onClick={openCreateModal} className={styles.buttonOpenModal}>
              Crear Nuevo Usuario
            </button>
          </div>
          <div className={styles.tableCard}>
            <CustomTable columns={userColumns} data={userData} onRowClick={handleGlobalRowClick} />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </h3>
              <button onClick={closeModal} className={styles.modalCloseButton}>
                ×
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className={styles.userForm}>
              <InputField
                id="username"
                label="Nombre de Usuario"
                placeholder="Ej: juanperez"
                value={newUserForm.username}
                onChange={handleFormInputChange}
                required
              />
              <InputField
                id="email"
                label="Correo Electrónico"
                type="email"
                placeholder="Ej: correo@ejemplo.com"
                value={newUserForm.email}
                onChange={handleFormInputChange}
                required
              />
              <InputField
                id="password"
                label={`Contraseña ${editingUser ? "(dejar vacío para no cambiar)" : ""}`}
                type="password"
                placeholder={
                  editingUser ? "Nueva contraseña (opcional)" : "Introduce una contraseña segura"
                }
                value={newUserForm.password || ""}
                onChange={handleFormInputChange}
                required={!editingUser}
              />

              <div className={styles.formField}>
                <label htmlFor="userType" className={styles.formLabel}>
                  Tipo de Usuario <span className={styles.requiredIndicator}>*</span>
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={newUserForm.userType as number}
                  onChange={handleFormInputChange}
                  required
                  className={styles.formSelect}
                  disabled={!!editingUser}
                >
                  {userTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {newUserForm.userType === UserType.publisher && (
                <>
                  <InputField
                    id="publisherName"
                    label="Nombre del Publisher"
                    placeholder="Ej: Editorial XYZ"
                    value={newUserForm.publisherName || ""}
                    onChange={handleFormInputChange}
                    required
                  />
                  <InputField
                    id="nif"
                    label="NIF/CIF"
                    placeholder="Ej: B12345678"
                    value={newUserForm.nif || ""}
                    onChange={handleFormInputChange}
                    required
                  />
                  <InputField
                    id="address"
                    label="Dirección"
                    placeholder="Ej: Calle Principal 123, Ciudad"
                    value={newUserForm.address || ""}
                    onChange={handleFormInputChange}
                    required
                  />
                  <div className={styles.formField}>
                    <label htmlFor="assignedStaffId" className={styles.formLabel}>
                      Staff Encargado
                    </label>
                    <select
                      id="assignedStaffId"
                      name="assignedStaffId"
                      value={newUserForm.assignedStaffId}
                      onChange={handleFormInputChange}
                      className={styles.formSelect}
                    >
                      <option value="">-- Seleccionar Staff --</option>
                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.username} (ID: {staff.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {newUserForm.userType === UserType.staff && (
                <div className={styles.formField}>
                  <label htmlFor="roleIds" className={styles.formLabel}>
                    Roles <span className={styles.requiredIndicator}>*</span>
                  </label>
                  <select
                    id="roleIds"
                    name="roleIds"
                    multiple
                    value={newUserForm.roleIds?.map(String) || []}
                    onChange={handleFormInputChange}
                    required
                    className={`${styles.formSelect} ${styles.formSelectMultiple}`}
                    size={5}
                  >
                    {roleOptions.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.roleName} ( {role.roleDescription})
                      </option>
                    ))}
                  </select>
                  <small className={styles.formHelperText}>
                    Mantén Ctrl (o Cmd en Mac) para seleccionar múltiples roles.
                  </small>
                  {(newUserForm.roleIds?.length ?? 0) > 0 && (
                    <p className={styles.formHelperText}>
                      Seleccionados:{" "}
                      {newUserForm.roleIds
                        ?.map((id) => roleOptions.find((r) => r.id === id)?.roleName)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}
              <div className={styles.formActions}>
                <button type="button" onClick={closeModal} className={styles.buttonFormSecondary}>
                  Cancelar
                </button>
                <button type="submit" className={styles.buttonFormPrimary}>
                  {editingUser ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagerPage;
