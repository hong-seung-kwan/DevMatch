import { Link } from "react-router-dom";
import DashboardStatCard from "../components/DashboardStatCard";
import type { ApplicationStatus } from "../types/application";
import { getJobs } from "../api/jobApi";
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../api/applicationApi";
import useBookmarks from "../hooks/useBookmarks";
import { APPLICATION_STATUSES } from "../types/application";



function Dashboard() {
    const {
        data: jobs = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs
    });

    const {
        data: applications = [],
        isLoading: isApplicationsLoading,
        isError: isApplicationsError
    } = useQuery({
        queryKey: ["applications"],
        queryFn: getApplications
    })

    const {
        bookmarks: serverBookmarks,
        isLoading: isBookmarksLoading,
        isError: isBookmarksError
    } = useBookmarks();

    function getStatusCount(status: ApplicationStatus) {
        return applications.filter(
            (application) => application.status === status
        ).length;
    }

    const sortedApplications = [...applications].sort(
        (a, b) =>
            new Date(b.appliedAt).getTime() -
            new Date(a.appliedAt).getTime()
    );

    const recentApplications = sortedApplications.slice(0, 3);

    const recentBookmarks = serverBookmarks.slice(-3).reverse(); //최근 북마크 id찾기

    const recentBookmarkJobs = recentBookmarks.map((bookmark) =>
        jobs.find((job) => job.id === bookmark.jobId)
    );

    if (isLoading || isApplicationsLoading || isBookmarksLoading) {
        return <p>대시보드 데이터를 불러오는 중입니다...</p>
    }
    if (isError || isApplicationsError || isBookmarksError) {
        return <p>대시보드 데이터를 불러오지 못했습니다...</p>
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold">
                    대시보드
                </h1>
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <DashboardStatCard
                        label="총 지원"
                        count={applications.length}
                    />
                    <DashboardStatCard
                        label="지원완료"
                        count={getStatusCount("지원완료")}
                    />
                    <DashboardStatCard
                        label="북마크"
                        count={serverBookmarks.length}
                    />
                </div>
                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">
                        지원 현황
                    </h2>

                    <div className="grid grid-cols-4 gap-4">
                        {APPLICATION_STATUSES.map((status) => {
                            return (
                                <DashboardStatCard
                                    key={status}
                                    label={status}
                                    count={getStatusCount(status)}
                                />
                            )
                        })}
                    </div>
                </section>



                <section className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">
                            최근 지원
                        </h2>
                        <Link
                            to="/applications"
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            전체보기 <span> → </span>
                        </Link>
                    </div>
                    {recentApplications.length === 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white py-10 text-center">
                            <p className="font-medium text-gray-700">
                                아직 지원한 공고가 없습니다.
                            </p>
                            <p className="mt-2 text-sm text-gray-400">
                                관심 있는 채용공고에 지원해보세요.
                            </p>
                        </div>
                    )}
                    <div className="space-y-3">
                        {recentApplications.map((application) => {
                            const job = jobs.find(
                                (job) => job.id === application.jobId
                            );
                            if (!job) {
                                return null;
                            }
                            return (
                                <div
                                    key={application.id}
                                    className="flex justify-between border border-gray-300 rounded-xl p-5">
                                    <div>
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="text-sm text-gray-500 hover:underline cursor-pointer">
                                            {job.company}
                                        </Link>
                                        <p className="font-bold mt-1">{job.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <p>{application.status}</p>
                                        <p className="text-sm text-gray-500 mt-1">{application.appliedAt.split("T")[0]}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">
                            최근 북마크 공고
                        </h2>
                        <Link
                            to="/bookmarks"
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            전체보기 <span> → </span>
                        </Link>
                    </div>
                    {recentBookmarkJobs.length === 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white py-10 text-center">
                            <p className="font-medium text-gray-700">
                                아직 북마크한 공고가 없습니다.
                            </p>
                            <p className="mt-2 text-sm text-gray-400">
                                관심 있는 공고를 저장해보세요.
                            </p>
                        </div>
                    )}
                    <div className="space-y-3">
                        {recentBookmarkJobs.map((job) => {
                            if (!job) {
                                return null;
                            }

                            return (
                                <Link
                                    key={job.id}
                                    to={`/jobs/${job.id}`}
                                    className="block border border-gray-300 rounded-xl p-5 transition hover:border-gray-400 hover:shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        {job.company}
                                    </p>
                                    <p className="font-bold mt-1">
                                        {job.title}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                </section>

            </div>
        </div>
    )
}
export default Dashboard;