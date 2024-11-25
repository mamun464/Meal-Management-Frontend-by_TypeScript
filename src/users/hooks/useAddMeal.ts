import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { User } from "../types/user";
import { getAuthToken } from "../../core/utils/crudUtils";

// const addMeal = async (user: User): Promise<User> => {
//   const { data } = await axios.post("/api/users", user);
//   return data;
// };
const addMeal = async (meal_entry_body: any): Promise<any> => {
    const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/hostel/meal-entry/`;
    const key = getAuthToken();
    // console.log("key: ", key);
    // console.log(meal_entry_body);

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', // Set Content-Type to application/json
            'Authorization': `Bearer ${key}`, // Use key as the token in the Authorization header
        },
        body: JSON.stringify(meal_entry_body),
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
    // const raw_new_meal_entry_body = response_data.new_meal_entry_body;

    return response_data;
};

export function useAddMeal() {
    const { isLoading, mutateAsync } = useMutation(addMeal);

    return { isAddingMeal: isLoading, addMeal: mutateAsync };
}
