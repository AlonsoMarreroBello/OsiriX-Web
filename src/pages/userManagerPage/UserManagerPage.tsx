import React, { useState } from "react";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { BaseDataRow, TableColumn } from "../../interfaces/CustomTable.interface";
import InputField from "../../components/InputField/InputField";
import styles from "./UserManagerPage.module.css";

interface Role {
  id: number;
  name: string;
  description: string;
}

interface UserData extends BaseDataRow {
  id: number;
  user: string;
  email: string;
  userType: UserRoleType;
  userStatus: string;
  publisherName?: string;
  nif?: string;
  address?: string;
  assignedStaff?: string;
  roles?: Role[];
}

type UserRoleType = "user" | "publisher" | "staff";

interface NewUserForm {
  username: string;
  email: string;
  password?: string;
  enabled: boolean;
  type: UserRoleType;
  publisherName?: string;
  nif?: string;
  address?: string;
  assignedStaffId?: number | "";
  roleIds?: number[];
}

const initialNewUserState: NewUserForm = {
  username: "",
  email: "",
  password: "",
  enabled: true,
  type: "user",
  publisherName: "",
  nif: "",
  address: "",
  assignedStaffId: "",
  roleIds: [],
};

interface StaffMember {
  id: number;
  username: string;
}
const mockStaffList: StaffMember[] = [
  { id: 101, username: "StaffManagerAna" },
  { id: 102, username: "StaffSupportJuan" },
  { id: 103, username: "StaffTechPedro" },
];

const mockRoleOptions: Role[] = [
  { id: 1, name: "Admin", description: "Full access to all system features." },
  { id: 2, name: "Editor", description: "Can create and manage content." },
  { id: 3, name: "Support", description: "Assists users with issues." },
  { id: 4, name: "Content Reviewer", description: "Reviews and approves content." },
  { id: 5, name: "Account Manager", description: "Manages publisher accounts." },
];

const UserManagerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>(initialNewUserState);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const [userData, setUserData] = useState<UserData[]>([
    {
      id: 1,
      user: "AlonsoSimpleUser",
      email: "alonso.user@correo.com",
      userType: "user",
      userStatus: "Enabled",
    },
    {
      id: 2,
      user: "EditorialSol",
      email: "contacto@editorialsol.com",
      userType: "publisher",
      userStatus: "Enabled",
      publisherName: "Editorial Sol S.L.",
      nif: "B12345678",
      address: "Calle Falsa 123, Ciudad",
      assignedStaff: "StaffManagerAna",
    },
    {
      id: 3,
      user: "StaffManagerAna",
      email: "ana.manager@correo.com",
      userType: "staff",
      userStatus: "Enabled",
      roles: [
        mockRoleOptions.find((r) => r.id === 5) as Role,
        mockRoleOptions.find((r) => r.id === 4) as Role,
      ],
    },
  ]);

  const userColumns: TableColumn<UserData>[] = [
    { type: "data", field: "id", headerName: "ID", width: 50, sortable: true },
    { type: "data", field: "user", headerName: "Usuario/Nombre", width: 180, sortable: true },
    { type: "data", field: "email", headerName: "Correo", width: "auto", sortable: false },
    {
      type: "data",
      field: "userType",
      headerName: "Tipo",
      width: 100,
      sortable: true,
    },
    { type: "data", field: "userStatus", headerName: "Estado", width: 100, sortable: true },
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
              handleEditUser(row);
            }}
          >
            Editar
          </button>
          <button
            className={`${styles.actionButton} ${styles.actionButtonDelete}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log(" Delete/Deactivate ", row);
            }}
          >
            Desactivar
          </button>
        </div>
      ),
    },
  ];

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
    const staffMember = mockStaffList.find((s) => s.username === userToEdit.assignedStaff);

    setNewUserForm({
      username: userToEdit.user,
      email: userToEdit.email,
      password: "",
      enabled: userToEdit.userStatus === "Enabled",
      type: userToEdit.userType,
      publisherName: userToEdit.publisherName || "",
      nif: userToEdit.nif || "",
      address: userToEdit.address || "",
      assignedStaffId: staffMember ? staffMember.id : "",
      roleIds:
        userToEdit.userType === "staff" && userToEdit.roles
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
    let value: string | boolean | number | number[] | "";

    if (target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    } else if (target.type === "select-multiple") {
      const options = (target as HTMLSelectElement).options;
      const selectedValues: number[] = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          selectedValues.push(Number(options[i].value));
        }
      }
      value = selectedValues;
    } else {
      value = target.value;
    }

    setNewUserForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "type" && !editingUser) {
        const newType = value as UserRoleType;
        if (newType !== "publisher") {
          updatedForm.publisherName = "";
          updatedForm.nif = "";
          updatedForm.address = "";
          updatedForm.assignedStaffId = "";
        }
        if (newType !== "staff") {
          updatedForm.roleIds = [];
        }
      }
      return updatedForm;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      setUserData((prevData) =>
        prevData.map((user) => {
          if (user.id === editingUser.id) {
            const updatedUser: UserData = {
              ...user,
              user: newUserForm.username,
              email: newUserForm.email,
              userStatus: newUserForm.enabled ? "Enabled" : "Disabled",
              publisherName:
                newUserForm.type === "publisher" ? newUserForm.publisherName : undefined,
              nif: newUserForm.type === "publisher" ? newUserForm.nif : undefined,
              address: newUserForm.type === "publisher" ? newUserForm.address : undefined,
              assignedStaff:
                newUserForm.type === "publisher" && newUserForm.assignedStaffId
                  ? mockStaffList.find((s) => s.id === Number(newUserForm.assignedStaffId))
                      ?.username
                  : undefined,
              roles:
                newUserForm.type === "staff" && newUserForm.roleIds
                  ? (newUserForm.roleIds
                      .map((id) => mockRoleOptions.find((r) => r.id === id))
                      .filter((role) => role !== undefined) as Role[])
                  : undefined,
            };
            return updatedUser;
          }
          return user;
        })
      );
    } else {
      const newId = userData.length > 0 ? Math.max(...userData.map((u) => u.id)) + 1 : 1;
      const userToAdd: UserData = {
        id: newId,
        user: newUserForm.username,
        email: newUserForm.email,
        userType: newUserForm.type,
        userStatus: newUserForm.enabled ? "Enabled" : "Disabled",
      };

      if (newUserForm.type === "publisher") {
        userToAdd.publisherName = newUserForm.publisherName;
        userToAdd.nif = newUserForm.nif;
        userToAdd.address = newUserForm.address;
        const staff = mockStaffList.find((s) => s.id === Number(newUserForm.assignedStaffId));
        userToAdd.assignedStaff = staff ? staff.username : undefined;
      }

      if (newUserForm.type === "staff" && newUserForm.roleIds && newUserForm.roleIds.length > 0) {
        userToAdd.roles = newUserForm.roleIds
          .map((selectedId) => mockRoleOptions.find((role) => role.id === selectedId))
          .filter((role) => role !== undefined) as Role[];
      }
      setUserData((prevData) => [...prevData, userToAdd]);
    }
    closeModal();
  };

  const userTypeOptions: { value: NewUserForm["type"]; label: string }[] = [
    { value: "user", label: "User" },
    { value: "publisher", label: "Publisher" },
    { value: "staff", label: "Staff" },
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
                <label htmlFor="type" className={styles.formLabel}>
                  Tipo de Usuario <span className={styles.requiredIndicator}>*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={newUserForm.type}
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

              {newUserForm.type === "publisher" && (
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
                      {mockStaffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.username} (ID: {staff.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {newUserForm.type === "staff" && (
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
                    {mockRoleOptions.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
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
                        ?.map((id) => mockRoleOptions.find((r) => r.id === id)?.name)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}

              <div className={`${styles.formField} ${styles.checkboxContainer}`}>
                <input
                  type="checkbox"
                  id="enabled"
                  name="enabled"
                  checked={newUserForm.enabled}
                  onChange={handleFormInputChange}
                  className={styles.formCheckbox}
                />
                <label htmlFor="enabled" className={styles.checkboxLabel}>
                  Habilitado
                </label>
              </div>

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
