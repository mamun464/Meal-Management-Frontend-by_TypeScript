import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
// import { updateOne } from "../../core/utils/crudUtils";
import { User } from "../types/user";
import { getAuthToken } from "../../core/utils/crudUtils";

// const updateUser = async (user: User): Promise<User> => {
//   console.log("Body: ", user);

//   const { data } = await axios.put("/api/users", user);
//   return data;
// };

const updateUser = async (user: User): Promise<User> => {
  const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/update/?request_user_id=${user.id}`;
  const key = getAuthToken();
  // console.log("key: ", key);
  // console.log(user);

  const response = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // Set Content-Type to application/json
      'Authorization': `Bearer ${key}`, // Use key as the token in the Authorization header
    },
    body: JSON.stringify(user),
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
  return response_data.data;
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