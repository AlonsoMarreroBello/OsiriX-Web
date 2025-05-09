import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import PublisherPortalPage from "./pages/publisherPortalPage/PublisherPortalPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publishers" element={<PublisherPortalPage />} />
          <Route path="/login" element={<h1> Login </h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
