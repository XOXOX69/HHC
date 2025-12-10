import { Route, Routes } from "react-router-dom";
import GetAllStore from "@/components/store/GetAllStore";
import UserPrivateComponent from "@/components/PrivacyComponent/UserPrivateComponent";

export default function StoreRoutes() {
  return (
    <Routes>
      <Route
        path="/store"
        element={
          <UserPrivateComponent permission="readAll-store">
            <GetAllStore />
          </UserPrivateComponent>
        }
      />
    </Routes>
  );
}
