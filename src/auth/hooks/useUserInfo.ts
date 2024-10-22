// import axios from "axios";
import { useQuery } from "react-query";
import { UserInfo } from "../types/userInfo";

// const fetchUserInfo = async (key?: string): Promise<UserInfo> => {
//   const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/profile/`
//   const { data } = await axios.get(URL, { params: { key } });
//   return data;
// };
const fetchUserInfo = async (key?: string): Promise<UserInfo> => {
  const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/profile/`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${key}`, // Use key as the token in the Authorization header
    },
    credentials: 'include', // Include cookies like csrftoken and sessionid
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`); // Handle error response
  }

  const data = await response.json(); // Parse the response JSON
  return data;
};



export function useUserInfo(key?: string) {
  return useQuery(["user-info", key], () => fetchUserInfo(key), {
    enabled: !!key,
  });
}
