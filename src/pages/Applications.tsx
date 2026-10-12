import ApplicationStatusCard from "../components/ApplicationStatusCard";
import type { ApplicationStatus } from "../types/application";
import ApplicationCard from "../components/ApplicationCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";
import { deleteApplication, getApplications, updateApplicationStatus } from "../api/applicationApi";
import { APPLICATION_STATUSES } from "../types/application";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

type StatusFilter = "전체" | ApplicationStatus;

const STATUS_FILTERS: StatusFilter[] = [
    "전체",
    ...APPLICATION_STATUSES
];


function Applications() {

    const {
        data: jobs = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs
    });

    const {
        data: serverApplications = [],
        isLoading: isApplicationsLoading,
        isError: isApplicationsError
    } = useQuery({
        queryKey: ["applications"],
        queryFn: getApplications
    });

    const queryClient = useQueryClient();

    const statusMutation = useMutation({
        mutationFn: ({
            id,
            status
        }: {
            id: number;
            status: ApplicationStatus;
        }) => updateApplicationStatus(id, status),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"]
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteApplication,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"]
            });
        }
    });

    function handleStatusChange(
        id: number,
        newStatus: ApplicationStatus
    ) {
        statusMutation.mutate({
            id,
            status: newStatus
        })
    }

    function handleDelete(id: number) {
        deleteMutation.mutate(id);
    }

    function getStatusCount(status: StatusFilter) {
        if (status === "전체") {
            return serverApplications.length
        }
        return serverApplications.filter(
            (application) => application.status === status
        ).length;
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const statusFilter = (searchParams.get("status") as StatusFilter) ?? "전체";
    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const urlSearch = params.get("search") ?? "";

            setSearchInput(urlSearch);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const filteredApplications = serverApplications.filter((application) => {

        const job = jobs.find((job) => {
            return job.id === application.jobId;
        })
        if (!job) {
            return false;
        }

        const matchesSearch =
            job.company.toLowerCase().includes(search.toLowerCase()) ||
            job.title.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "전체" ||
            application.status === statusFilter;

        return matchesSearch && matchesStatus;
    })

    const sortedApplications = [...filteredApplications].sort((a, b) => {
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
    });

    if (isLoading || isApplicationsLoading) {
        return <p>지원 내역을 불러오는 중입니다...</p>
    }
    if (isError || isApplicationsError) {
        return <p>지원 내역을 불러오지 못했습니다...</p>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">
                        지원 관리
                    </h1>

                    <p className="text-gray-500 mt-1">
                        총 {serverApplications.length}개의 지원 내역이 있습니다.
                    </p>
                </div>
                <div className="grid grid-cols-5 gap-4">

                    {STATUS_FILTERS.map((status) => {
                        return (
                            <ApplicationStatusCard
                                key={status}
                                label={status}
                                count={getStatusCount(status)}
                                isActive={statusFilter === status}
                                onClick={() => {
                                    setSearchParams((prev) => {
                                        const next = new URLSearchParams(prev)
                                        if (status === "전체") {
                                            next.delete("status")

                                        } else {
                                            next.set("status", status);
                                        }

                                        return next
                                    })
                                }}
                            />
                        )
                    })}
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        setSearchParams((prev) => {
                            const next = new URLSearchParams(prev)
                            if (searchInput) {
                                next.set("search", searchInput);
                            } else {
                                next.delete("search")
                            }

                            return next
                        })
                    }}
                >
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                        }}
                        placeholder="회사명 또는 공고명 검색"
                        className="border border-gray-200 bg-white text-sm rounded-xl px-4 py-2 w-full mt-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </form>
                {serverApplications.length === 0 && (

                    <div className="rounded-xl bg-white py-16 text-center">
                        <p className="font-medium text-gray-700">아직 지원한 공고가 없습니다.</p>
                        <p className="font-medium text-gray-700">관심 있는 채용공고에 지원해보세요.</p>
                    </div>
                )}
                {serverApplications.length > 0 && filteredApplications.length === 0 && (
                    <div className="rounded-xl bg-white py-16 text-center">
                        <p className="font-medium text-gray-700">검색조건에 맞는 지원 내역이 없습니다.</p>
                    </div>
                )}
                <div className="space-y-4 mt-8">

                    {sortedApplications.map((application) => {
                        const job = jobs.find((job) => {
                            return job.id === application.jobId;
                        })

                        if (!job) {
                            return null;
                        }

                        return (
                            <ApplicationCard
                                key={application.id}
                                job={job}
                                application={application}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        )
                    })}

                </div>
            </div>

        </div>
    )
}
export default Applications