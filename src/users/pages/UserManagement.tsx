import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import SelectToolbar from "../../core/components/SelectToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import UserDialog from "../components/UserDialog";
import MealDialog from "../components/MealDialog";
import UserTable from "../components/UserTable";
import { useAddUser } from "../hooks/useAddUser";
import { useAddMeal } from "../hooks/useAddMeal";
import { useDeleteUsers } from "../hooks/useDeleteUsers";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useUsers } from "../hooks/useUsers";
import { User } from "../types/user";

const UserManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [openMealDialog, setOpenMealDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [userDeleted, setUserDeleted] = useState<string[]>([]);
  const [userUpdated, setUserUpdated] = useState<User | undefined>(undefined);

  const { addUser, isAdding } = useAddUser();
  const { addMeal, isAddingMeal } = useAddMeal();
  const { deleteUsers, isDeleting } = useDeleteUsers();
  const { isUpdating, updateUser } = useUpdateUser();
  const { data } = useUsers();


  // console.log("UserManagement: ", data);


  const processing = isAdding || isDeleting || isUpdating || isAddingMeal;


  const handleAddUser = async (user: Partial<User>) => {

    addUser(user as User)
      .then((new_user) => {
        snackbar.success(
          t("userManagement.notifications.addSuccess", {
            user: `${new_user.fullName}`,
          })
        );
        setOpenUserDialog(false);
      })
      .catch((error) => {
        // Check if the error contains a specific message
        const errorMessage = error.message || t("common.errors.unexpected.subTitle");

        // Show error message using snackbar
        snackbar.error(errorMessage);
      });
  };
  const handleAddMeal = async (body: any) => {
    console.log("handleAddMeal: ", body);
    addMeal(body)
      .then(() => {
        snackbar.success(
          t("userManagement.notifications.mealAddSuccess", {
            user: `${body.name}`,
          })
        );
        setOpenMealDialog(false);
      })
      .catch((error) => {
        // Check if the error contains a specific message
        const errorMessage = error.message || t("common.errors.unexpected.subTitle");

        // Show error message using snackbar
        snackbar.error(errorMessage);
      });
  };

  const handleDeleteUsers = async () => {
    deleteUsers(userDeleted)
      .then(() => {
        snackbar.success(t("userManagement.notifications.deleteSuccess"));
        setSelected([]);
        setUserDeleted([]);
        setOpenConfirmDeleteDialog(false);
      })
      .catch((error) => {
        // Check if the error contains a specific message
        const errorMessage = error.message || t("common.errors.unexpected.subTitle");

        // Show error message using snackbar
        snackbar.error(errorMessage);
      });
  };

  const handleUpdateUser = async (user: User) => {
    // console.log("handleUpdateUser:", user);

    updateUser(user)
      .then(() => {
        snackbar.success(
          t("userManagement.notifications.updateSuccess", {
            user: `${user.fullName}`,
          })
        );
        setOpenUserDialog(false);
      })
      .catch((error) => {
        // Display the specific error message from the thrown error
        const errorMessage = error instanceof Error ? error.message : t("common.errors.unexpected.subTitle");
        snackbar.error(errorMessage);
      });
  };

  const handleCancelSelected = () => {
    setSelected([]);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleCloseUserDialog = () => {
    setUserUpdated(undefined);
    setOpenUserDialog(false);
  };
  const handleCloseMealDialog = () => {
    setUserUpdated(undefined);
    setOpenMealDialog(false);
    setEditMode(true);
  };

  const handleOpenConfirmDeleteDialog = (userIds: string[]) => {
    setUserDeleted(userIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenUserDialog = (user?: User) => {
    setUserUpdated(user);
    setOpenUserDialog(true);
  };
  const handleOpenMealDialog = (user?: User) => {
    setUserUpdated(user);
    setOpenMealDialog(true);
    setEditMode(false);
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar title={t("userManagement.toolbar.title")}>
            <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenUserDialog()}
              size="small"
            >
              <AddIcon />
            </Fab>
          </AdminToolbar>
        ) : (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        )
        }
      </AdminAppBar>
      <UserTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenUserDialog}
        onAddMeal={handleOpenMealDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        users={data}
      />
      <ConfirmDialog
        description={t("userManagement.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteUsers}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />
      {openUserDialog && (
        <UserDialog
          onAdd={handleAddUser}
          onClose={handleCloseUserDialog}
          onUpdate={handleUpdateUser}
          open={openUserDialog}
          processing={processing}
          user={userUpdated}
        />
      )}
      {openMealDialog && (
        <MealDialog
          editMode={editMode}
          onClose={handleCloseMealDialog}
          onMealAdd={handleAddMeal}
          open={openMealDialog}
          processing={processing}
          user={userUpdated}
        />
      )}

    </React.Fragment>
  );
};

export default UserManagement;
