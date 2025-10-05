import { Navigate } from "react-router-dom";

export interface routerType {
  path: string;
  component: any;
}

export const RouterData: routerType[] = [
  {
    path: "/",
    component: <Navigate to="/dsd" />,
  },
 
];
