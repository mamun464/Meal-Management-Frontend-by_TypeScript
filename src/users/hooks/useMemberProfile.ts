import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { User } from "../types/user";
import { getAuthToken } from "../../core/utils/crudUtils";

// const addMeal = async (user: User): Promise<User> => {
//   const { data } = await axios.post("/api/users", user);
//   return data;
// };
const MemberProfile = async (member_id: number): Promise<any> => {
    const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/member/?member_user_id=${member_id}`;
    const key = getAuthToken();
    // console.log("key: ", key);
    // console.log(member_id);

    const response = await fetch(URL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', // Set Content-Type to application/json
            'Authorization': `Bearer ${key}`, // Use key as the token in the Authorization header
        },
        // body: JSON.stringify(member_id),
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
    // const raw_new_member_id = response_data.new_member_id;

    return response_data.data;
};

export function useMemberProfile() {
    const { isLoading, mutateAsync } = useMutation(MemberProfile);

    return { isMemberProfile: isLoading, getMemberProfile: mutateAsync };
}
