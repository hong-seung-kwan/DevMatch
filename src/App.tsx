import { Route, Routes } from "react-router-dom"
import Jobs from "./pages/Jobs"
import JobDetail from "./pages/JobDetail"
import Bookmarks from "./pages/Bookmarks";
import Header from "./components/Header";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";



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

      </Routes>
    </div>
  )
}

export default App
