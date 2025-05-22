import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import PublisherPortalPage from "./pages/publisherPortalPage/PublisherPortalPage";
import LoginPage from "./pages/loginPage/LoginPage";
import UserHomePage from "./pages/userHomePage/UserHomePage";
import RequestManagerPage from "./pages/requestManager/RequestManagerPage";
import UserManagerPage from "./pages/userManagerPage/UserManagerPage";
import DeveloperManagerPage from "./pages/developerManagerPage/DeveloperManagerPage";
import ApplicationsManagerPage from "./pages/aplicationsManagerPage/AplicationsManagerPage";
import CategoryManagerPage from "./pages/categoryManagerPage/CategoryManagerPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/publishers" element={<PublisherPortalPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute allowedUserTypes={["STAFF", "PUBLISHER"]} />}>
            <Route path="/home" element={<UserHomePage />} />
            <Route path="/request-manager" element={<RequestManagerPage />} />
          </Route>
          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedUserTypes={["STAFF"]} />}>
            <Route path="/user-manager" element={<UserManagerPage />} />
            <Route path="/developer-manager" element={<DeveloperManagerPage />} />
            <Route path="/aplication-manager" element={<ApplicationsManagerPage />} />
            <Route path="/category-manager" element={<CategoryManagerPage />} />
          </Route>
          {/* Publisher routes */}
          <Route element={<ProtectedRoute allowedUserTypes={["PUBLISHER"]} />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
