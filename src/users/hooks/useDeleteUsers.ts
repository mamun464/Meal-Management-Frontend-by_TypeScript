import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
// import { removeMany } from "../../core/utils/crudUtils";
import { User } from "../types/user";

// const deleteUsers = async (userIds: string[]): Promise<string[]> => {
//   const { data } = await axios.delete("/api/users", { data: userIds });
//   return data;
// };

// export function useDeleteUsers() {
//   const queryClient = useQueryClient();

//   const { isLoading, mutateAsync } = useMutation(deleteUsers, {
//     onSuccess: (userIds: string[]) => {
//       queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
//         removeMany(oldUsers, userIds)
//       );
//     },
//   });

//   return { isDeleting: isLoading, deleteUsers: mutateAsync };
// }

// Adjusted function: filters out users based on the provided userIds
const removeMany = (oldUsers: User[] | undefined, userIds: string[]): User[] => {
  if (!oldUsers) return [];
  return oldUsers.filter(user => !userIds.includes(user.id.toString()));
};

const deleteUsers = async (userIds: string[]): Promise<string[]> => {
  const { data } = await axios.delete("/api/users", { data: userIds });
  return data;
};

export function useDeleteUsers() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteUsers, {
    onSuccess: (userIds: string[]) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        removeMany(oldUsers, userIds) // Ensure this returns a full array of User[]
      );
    },
  });

  return { isDeleting: isLoading, deleteUsers: mutateAsync };
}
