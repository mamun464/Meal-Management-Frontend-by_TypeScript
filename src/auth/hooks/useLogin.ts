// import axios from "axios";
import { useMutation } from "react-query";

export interface LoginResponse {
  success: boolean;
  status: number;
  message: string;
  token: {
    refresh: string;
    access: string;
  };
  user_data: {
    id: number;
    last_login: string; // Consider using Date type if you parse it later
    fullName: string;
    email: string;
    user_profile_img: string | null;
    phone_no: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    is_manager: boolean;
    groups: any[]; // You can define a more specific type if you have group structure
    user_permissions: any[]; // Define this type based on your permission structure
  };
}


// const login = async ({
//   phone,
//   password,
// }: {
//   phone: string;
//   password: string;
// }): Promise<LoginResponse> => {
//   const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/login/`

//   console.log("Login phone in useLogin.ts: ", phone);
//   console.log("Login pass in useLogin.ts: ", password);
//   console.log("Login URL in useLogin.ts: ", URL);

//   const { data } = await axios.post(URL, { phone, password });
//   console.log("Login data in useLogin.ts: ", data);

//   return data;
// };

const login = async ({
  phone,
  password,
}: {
  phone: string;
  password: string;
}): Promise<LoginResponse> => {
  const URL = `${process.env.REACT_APP_BACKEND_PUBLIC_URL}/api/user/login/`;

  // console.log("Constructed Login URL: ", URL);

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_no: phone, // Ensure you are using 'phone_no' as in the backend
        password,
      }),
    });

    if (!response.ok) {
      // If response is not ok, log the status
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    // console.log("Login response data: ", data);

    return data;

  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Re-throw the error for further handling
  }
};


export function useLogin() {
  const { isLoading, mutateAsync } = useMutation(login);

  return { isLoggingIn: isLoading, login: mutateAsync };
}
