import { Link } from "react-router-dom";
import DashboardStatCard from "../components/DashboardStatCard";
import type { Application, ApplicationStatus } from "../types/application";
import { getJobs } from "../api/jobApi";
import { useQuery } from "@tanstack/react-query";

// 어떤 props가 필요한가 생각
type DashboardProps = {
    applications: Application[]
    bookmarks: number[]
}

function Dashboard({ applications, bookmarks }: DashboardProps) {
    const {
        data: jobs = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs
    })
    
    const statuses: ApplicationStatus[] = [
        "지원완료",
        "서류합격",
        "면접",
        "최종합격"
    ];

    function getStatusCount(status: ApplicationStatus) {
        return applications.filter((application) => {
            return application.status === status;
        }).length
    }

    const sortedApplications = [...applications].sort((a, b) => {
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
    }); // applications 복사해서 날짜 비교해서 최근 순으로 정렬

    const recentApplications = sortedApplications.slice(0, 3);

    const recentBookmarkIds = bookmarks.slice(-3).reverse(); //최근 북마크 id찾기

    const recentBookmarkJobs = recentBookmarkIds.map((id) => {
        return jobs.find((job) => {
            return job.id === id;
        })
    })

    if (isLoading) {
        return <p>대시보드 데이터를 불러오는 중입니다...</p>
    }
    if (isError) {
        return <p>대시보드 데이터를 불러오지 못했습니다...</p>
    }
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold">
                대시보드
            </h1>
            <div className="grid grid-cols-3 gap-4 mt-6">
                <DashboardStatCard
                    label="총 지원"
                    count={applications.length}
                />
                <DashboardStatCard
                    label="북마크"
                    count={bookmarks.length}
                />
                {statuses.map((status) => {
                    return (
                        <DashboardStatCard
                            key={status}
                            label={status}
                            count={getStatusCount(status)}
                        />
                    )
                })}
            </div>

            <section className="mt-10">

                <h2 className="text-xl font-bold mb-4">
                    최근 지원
                </h2>
                {recentApplications.length === 0 && (
                    <p>최근 지원한 공고가 없습니다...</p>
                )}
                <div className="space-y-3">
                    {recentApplications.map((application) => {
                        const job = jobs.find((job) => {
                            return job.id === application.jobId;
                        });
                        if (!job) {
                            return null;
                        }
                        return (
                            <div
                                key={application.jobId}
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

                <h2 className="text-xl font-bold mb-4">
                    최근 북마크 공고
                </h2>
                {recentBookmarkJobs.length === 0 && (
                    <div>
                        <p>북마크한 공고가 없습니다...</p>
                    </div>
                )}
                <div className="space-y-3">
                    {recentBookmarkJobs.map((job) => {
                        if (!job) {
                            return null;
                        }

                        return (
                            <div
                                key={job.id}
                                className="border border-gray-300 rounded-xl p-5">
                                <Link
                                    to={`/jobs/${job.id}`}
                                    className="text-sm text-gray-500 hover:underline cursor-pointer"
                                >
                                    {job.company}
                                </Link>
                                <p className="font-bold mt-1">
                                    {job.title}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

        </div>
    )
}
export default Dashboard;