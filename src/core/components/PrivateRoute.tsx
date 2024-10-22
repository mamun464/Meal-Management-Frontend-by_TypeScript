import { Navigate, Route, RouteProps } from "react-router";
import { useAuth } from "../../auth/contexts/AuthProvider";

type PrivateRouteProps = {
  roles?: string[];
} & RouteProps;

const PrivateRoute = ({
  children,
  roles,
  ...routeProps
}: PrivateRouteProps) => {
  const { userInfo } = useAuth();

  const isAdminOrManager = () => {
    if (userInfo) {
      return userInfo.is_superuser || userInfo.is_manager;
    }
    return false;
  };

  if (userInfo) {
    if (!isAdminOrManager()) {
      return <Navigate to={`${process.env.PUBLIC_URL}/403`} />;
    }
    return <Route {...routeProps}>{children}</Route>;
  } else {
    return <Navigate to={`/${process.env.PUBLIC_URL}/login`} />;
  }
};

export default PrivateRoute;

// -----------------------------------------------------------------------------------------------

// import { Navigate, Route, RouteProps } from "react-router";
// import { useAuth } from "../../auth/contexts/AuthProvider";

// type PrivateRouteProps = {
//   roles?: string[];
// } & RouteProps;

// const PrivateRoute = ({
//   children,
//   roles,
//   ...routeProps
// }: PrivateRouteProps) => {
//   const { hasRole, userInfo } = useAuth();

//   if (userInfo) {
//     if (!hasRole(roles)) {
//       return <Navigate to={`/${process.env.PUBLIC_URL}/403`} />;
//     }
//     return <Route {...routeProps} />;
//   } else {
//     return <Navigate to={`/${process.env.PUBLIC_URL}/login`} />;
//   }
// };

// export default PrivateRoute;
