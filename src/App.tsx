import { Route, Routes } from "react-router-dom"
import Jobs from "./pages/Jobs"
import JobDetail from "./pages/JobDetail"
import { useEffect, useState } from "react";
import Bookmarks from "./pages/Bookmarks";
import Header from "./components/Header";
import type { Application, ApplicationStatus } from "./types/application";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";



function App() {

  const [applications, setApplications] = useState<Application[]>(() => {
    const savedApplications = localStorage.getItem("applications");

    if (savedApplications) {
      return JSON.parse(savedApplications)
    }
    return []
  });

  useEffect(() => {
    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    )
  }, [applications]);

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");

    if (savedBookmarks) {
      return JSON.parse(savedBookmarks)
    }
    return []
  });

  useEffect(() => {
    localStorage.setItem(
      "bookmarks",
      JSON.stringify(bookmarks)
    )
  }, [bookmarks]);

  function handleBookmark(id: number) {
    // bookmark id를 저장하는 로직
    const isBookmarked = bookmarks.includes(id);

    if (isBookmarked) {
      setBookmarks(
        bookmarks.filter((bookmarkId) => {
          return bookmarkId !== id;
        })
      )
    } else {
      setBookmarks([...bookmarks, id])
    }
  }

  function handleApply(jobId: number) {
    const isApplied = applications.some((application) => { //some => 조건을 만족하는 요소가 있는지
      return application.jobId === jobId
    })
    if (isApplied) {
      return;
    }

    const newApplication: Application = {
      jobId: jobId,
      status: "지원완료",
      appliedAt: new Date().toISOString()
    }

    setApplications([
      ...applications,
      newApplication
    ])
  }

  function handleDeleteApplication(jobId: number) {
    console.log("삭제요청:", jobId);
    const newApplications = applications.filter((application) => {
      return application.jobId !== jobId;
    })
    setApplications(newApplications);
  }


  function handleStatusChange(
    jobId: number,
    newStatus: ApplicationStatus
  ) {
    const newApplications = applications.map((application) => {
      if (jobId === application.jobId) {
        return {
          ...application,
          status: newStatus
        };

      }
      return application;
    })
    setApplications(newApplications);
  }

  return (
    <div>
      <Header />
      <Routes>

        <Route
          path="/jobs"
          element={
            <Jobs
              bookmarks={bookmarks}
              handleBookmark={handleBookmark}
            />

          }
        />

        <Route
          path="/jobs/:id"
          element={
            <JobDetail
              bookmarks={bookmarks}
              handleBookmark={handleBookmark}
              handleApply={handleApply}
            />}
        />

        <Route
          path="/bookmarks"
          element={
            <Bookmarks
              bookmarks={bookmarks}
              handleBookmark={handleBookmark}
            />}
        />

        <Route
          path="/applications"
          element={
            <Applications
              applications={applications}
              handleDeleteApplication={handleDeleteApplication}
              handleStatusChange={handleStatusChange}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              applications={applications}
              bookmarks={bookmarks}
            />
          }
        />

      </Routes>
    </div>
  )
}

export default App
