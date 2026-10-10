import { Route, Routes } from "react-router-dom"
import Jobs from "./pages/Jobs"
import JobDetail from "./pages/JobDetail"
import Bookmarks from "./pages/Bookmarks";
import Header from "./components/Header";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import JobCreate from "./pages/JobCreate";



function App() {

  return (
    <div>
      <Header />
      <Routes>

        <Route
          path="/jobs"
          element={<Jobs/>}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetail/>}
        />

        <Route
          path="/bookmarks"
          element={<Bookmarks/>}
        />

        <Route
          path="/applications"
          element={
            <Applications/>
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard/>}
        />

        <Route
          path="/jobs/new"
          element={<JobCreate/>}
        />

      </Routes>
    </div>
  )
}

export default App
