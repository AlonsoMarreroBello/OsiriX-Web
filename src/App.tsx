import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import PublisherPortalPage from "./pages/publisherPortalPage/PublisherPortalPage";
import LoginPage from "./pages/loginPage/LoginPage";
import UserHomePage from "./pages/userHomePage/UserHomePage";
import RequestManagerPage from "./pages/requestManager/RequestManagerPage";
import UserManagerPage from "./pages/userManagerPage/UserManagerPage";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
