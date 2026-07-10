import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainApp from "./pages/MainPage";
import SettingPage from "./pages/SettingPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/setting" element={<SettingPage />}> </Route>
        <Route path="/*" element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App;
