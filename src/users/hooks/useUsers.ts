// import axios from "axios";
import { useQuery } from "react-query";
import { AllUsersResponse } from "../../auth/types/userInfo";
import { useLocalStorage } from "../../core/hooks/useLocalStorage";
import { User } from "../types/user";

// const fetchUsers = async (): Promise<User[]> => {
//   const { data } = await axios.get("/api/users");
//   return data;
// };

const fetchUsers = async (token?: string): Promise<User[]> => {
  const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/user-list/`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`, // Use key as the token in the Authorization header
    },
    credentials: 'include', // Include cookies like csrftoken and sessionid
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`); // Handle error response
  }

  const response_object = await response.json(); // Parse the response JSON
  const user_list = response_object.data
  console.log("User: ", user_list);

  return user_list;
};

export function useUsers() {
  const [token] = useLocalStorage<string>("authkey", "");
  console.log("Token: ", token);

  return useQuery("users", () => fetchUsers(token));
}