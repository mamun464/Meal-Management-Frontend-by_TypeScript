import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
// import { updateOne } from "../../core/utils/crudUtils";
import { User } from "../types/user";
import { getAuthToken } from "../../core/utils/crudUtils";

// const changeManager = async (user: User): Promise<User> => {
//   console.log("Body: ", user);

//   const { data } = await axios.put("/api/users", user);
//   return data;
// };

const changeManager = async (user: User): Promise<User[]> => {
    const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/managership/?newManager_id=${user.id}`;
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
        // body: JSON.stringify(user),
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

export function useChangeManager() {
    const queryClient = useQueryClient();

    const { isLoading, mutateAsync } = useMutation<User[], unknown, User>(changeManager, {
        onSuccess: (updatedUsers: User[]) => {
            queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
                if (!oldUsers) return []; // Handle case when there are no existing users

                // Update only the users whose IDs match in the response
                const updatedUserMap = new Map(updatedUsers.map(user => [user.id, user]));

                return oldUsers.map(user =>
                    updatedUserMap.has(user.id) ? updatedUserMap.get(user.id)! : user
                );
            });
        },
    });

    return { isChanging: isLoading, changeManager: mutateAsync };
}