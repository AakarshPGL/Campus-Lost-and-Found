import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom"

import Navbar from "./components/Navbar"
import MyReports from "./pages/MyReports"
import Home from "./pages/Home"
import Browse from "./pages/Browse"
import Report from "./pages/Report"
import Login from "./pages/Login"
import ItemDetails from "./pages/ItemDetails"
import Register from "./pages/Register"


function ProtectedReport() {
  const location = useLocation()

  const token = localStorage.getItem("token")

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          backgroundLocation: location,
        }}
      />
    )
  }

  return <Report />
}


function AppContent() {
  const location = useLocation()

  const backgroundLocation =
    location.state?.backgroundLocation

  return (
    <>
      <Navbar />

      {/* Main page */}

      <Routes
        location={backgroundLocation || location}
      >

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/browse"
          element={<Browse />}
        />

        <Route
          path="/report"
          element={<ProtectedReport />}
        />
        <Route
          path="/my-reports"
          element={<MyReports />}
        />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/items/:id"
          element={<ItemDetails />}
        />

      </Routes>


      {/* Authentication modals */}

      {backgroundLocation && (
        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Routes>
      )}

    </>
  )
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App