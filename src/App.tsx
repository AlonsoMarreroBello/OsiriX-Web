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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publishers" element={<PublisherPortalPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/request-manager" element={<RequestManagerPage />} />
          <Route path="/user-manager" element={<UserManagerPage />} />
          <Route path="/developer-manager" element={<DeveloperManagerPage />} />
          <Route path="/aplication-manager" element={<ApplicationsManagerPage />} />
          <Route path="/category-manager" element={<CategoryManagerPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
