import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
// import { updateOne } from "../../core/utils/crudUtils";
import { User } from "../types/user";

const updateUser = async (user: User): Promise<User> => {
  const { data } = await axios.put("/api/users", user);
  return data;
};

// Helper function to update one user in the list
const updateOne = (oldUsers: User[] | undefined, updatedUser: User): User[] => {
  if (!oldUsers) return [updatedUser]; // If no previous users exist, return an array with the updated user

  return oldUsers.map(user =>
    user.id === updatedUser.id ? updatedUser : user
  ); // Replace the user with the updated user
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateUser, {
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        updateOne(oldUsers, updatedUser) // Pass the updated user to replace the old one
      );
    },
  });

  return { isUpdating: isLoading, updateUser: mutateAsync };
}