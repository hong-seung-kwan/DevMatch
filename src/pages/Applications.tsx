import { useState } from "react";
import ApplicationStatusCard from "../components/ApplicationStatusCard";
import type { Application, ApplicationStatus } from "../types/application";
import ApplicationCard from "../components/ApplicationCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";
import { deleteApplication, getApplications, updateApplicationStatus } from "../api/applicationApi";

type ApplicationsProps = {
    applications: Application[]
    handleDeleteApplication: (id: number) => void;
    handleStatusChange: (id: number, newStatus: ApplicationStatus) => void;
}

type StatusFilter = "전체" | ApplicationStatus;


function Applications({
    applications,
    handleDeleteApplication,
    handleStatusChange
}: ApplicationsProps) {

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

    console.log("서버 지원내역:", serverApplications)

    const queryClient = useQueryClient();

    const statusMutation = useMutation({
        mutationFn: ({
            id,
            status
        }: {
            id:number;
            status: ApplicationStatus;
        }) => {
            return updateApplicationStatus(id,status);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"]
            })
        }
    })
    
    const deleteMutation = useMutation({
        mutationFn: (id:number) => {
            return deleteApplication(id);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"]
            })
        }
    })

    function handleServerStatusChange(
        id:number,
        newStatus: ApplicationStatus
    ) {
        statusMutation.mutate({
            id:id,
            status:newStatus
        })
    }

    function handleServerDelete(id: number) {
        deleteMutation.mutate(id);
    }

    function getStatusCount(status: StatusFilter) {
        if (status === "전체") {
            return serverApplications.length
        }
        return serverApplications.filter((application) => {
            return application.status === status;
        }).length;
    }

    const statuses: StatusFilter[] = [
        "전체",
        "지원완료",
        "서류합격",
        "면접",
        "최종합격"
    ]

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
    const [search, setSearch] = useState("");

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
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    지원 관리
                </h1>

                <p className="text-gray-500 mt-1">
                    총 {serverApplications.length}개의 지원 내역이 있습니다.
                </p>
            </div>
            <div className="grid grid-cols-5 gap-4">

                {statuses.map((status) => {
                    return (
                        <ApplicationStatusCard
                            key={status}
                            label={status}
                            count={getStatusCount(status)}
                            isActive={statusFilter === status}
                            onClick={() => {
                                setStatusFilter(status)
                            }}
                        />
                    )
                })}
            </div>
            <input
                type="text"
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                }}
                placeholder="회사명 또는 공고명 검색"
                className="border rounded-lg px-4 py-2 w-full mt-6"
            />
            {serverApplications.length === 0 && (
                <div>
                    <p>아직 지원한 공고가 없습니다.</p>
                    <p>관심 있는 채용공고에 지원해보세요.</p>
                </div>
            )}
            {serverApplications.length > 0 && filteredApplications.length === 0 && (
                <div>
                    <p>검색조건에 맞는 지원 내역이 없습니다.</p>
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
                            handleDeleteApplication={handleServerDelete}
                            handleStatusChange={handleServerStatusChange}
                        />
                    )
                })}

            </div>
        </div>
    )
}
export default Applications