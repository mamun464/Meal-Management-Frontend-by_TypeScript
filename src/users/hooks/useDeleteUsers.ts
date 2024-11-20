import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
// import { removeMany } from "../../core/utils/crudUtils";
import { User } from "../types/user";
import { getAuthToken } from "../../core/utils/crudUtils";
import { log } from "console";


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

  let URL = '';

  if (userIds.length === 1) {
    // Single user deletion endpoint
    URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/delete/${userIds[0]}/`;
  } else if (userIds.length > 1) {
    // Bulk user deletion endpoint
    URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/delete-bulk/`;
  } else {
    throw new Error("No user IDs provided for deletion.");
  }

  const key = getAuthToken();
  // console.log("key: ", key);
  // console.log(user);

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // Set Content-Type to application/json
      'Authorization': `Bearer ${key}`, // Use key as the token in the Authorization header
    },
    body: JSON.stringify(userIds),
    credentials: 'include', // Include cookies like csrftoken and sessionid
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear(); // Clear local storage if unauthorized
    }
    const errorData = await response.json();

    throw new Error(errorData.message || `Error: ${response.status}`); // Throw specific error message
  }

  const response_data = await response.json(); // Parse the response JSON

  return response_data.deleted_ids;
};
// const deleteUsers = async (userIds: string[]): Promise<string[]> => {
//   const { data } = await axios.delete("/api/users", { data: userIds });
//   console.log("response_data: ", data);
//   return data;
// };

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
