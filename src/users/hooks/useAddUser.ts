import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { User } from "../types/user";
import { getAuthToken } from "../../core/utils/crudUtils";

// const addUser = async (user: User): Promise<User> => {
//   const { data } = await axios.post("/api/users", user);
//   return data;
// };
const addUser = async (user: User): Promise<User> => {
  const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/register/`;
  const key = getAuthToken();
  console.log("key: ", key);
  console.log(user);

  const response = await fetch(URL, {
    method: 'POST',
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
  const raw_new_user = response_data.new_user;

  return raw_new_user;
};

export function useAddUser() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addUser, {
    onSuccess: (user: User) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) =>
        addOne(oldUsers, user)
      );
    },
  });

  return { isAdding: isLoading, addUser: mutateAsync };
}
