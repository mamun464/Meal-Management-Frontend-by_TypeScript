export interface User {
  id: number; // Updated to match the backend response (number instead of string)
  last_login: string; // The backend provides a date-time string for the last login
  fullName: string; // Corresponds to "fullName" in the response
  email: string; // Same as before
  user_profile_img?: string | null; // Optional field (string or null)
  phone_no: string; // The phone number field from the response
  is_staff: boolean; // Matches the boolean value from the backend
  is_active: boolean; // Matches the boolean value from the backend
  is_superuser: boolean; // Matches the boolean value from the backend
  is_manager: boolean; // Matches the boolean value from the backend
  role: string; // Matches the boolean value from the backend
  groups: any[]; // Groups field as an array (can be adjusted based on your actual data structure)
  user_permissions: any[]; // Permissions field as an array (can be adjusted as needed)
}



// export interface User {
//   id: string;
//   avatar?: string;
//   disabled: boolean;
//   email: string;
//   firstName: string;
//   gender?: "F" | "M" | "NC";
//   lastName: string;
//   role: string;
// }
