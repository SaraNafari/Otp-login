import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhonePage from "./pages/PhonePage";
import OtpPage from "./pages/OtpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PhonePage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
