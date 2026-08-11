import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Browse from "./pages/Browse"
import Report from "./pages/Report"
import Login from "./pages/Login"
import ItemDetails from "./pages/ItemDetails"
import Register from "./pages/Register"


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
          element={<Report />}
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