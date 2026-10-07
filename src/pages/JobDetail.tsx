import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getJob } from "../api/jobApi";
import axios from "axios";
import { createApplication, getApplications } from "../api/applicationApi";
import useBookmarks from "../hooks/useBookmarks";


function JobDetail() {

    const navigate = useNavigate();
    const { id } = useParams();
    const jobId = Number(id);

    const {
        data: job,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["jobs", jobId],
        queryFn: () => getJob(jobId),
        retry: false
    })

    const {
        bookmarks: serverBookmarks,
        isLoading: isBookmarksLoading,
        isError: isBookmarksError,
        toggleBookmark
    } = useBookmarks();

    const {
        data: applications = [],
        isLoading: isApplicationsLoading,
        isError: isApplicationsError
    } = useQuery({
        queryKey: ["applications"],
        queryFn: getApplications
    })

    const isApplied = applications.some((application) => {
        return application.jobId === jobId;
    })

    const queryClient = useQueryClient();

    const applyMutation = useMutation({
        mutationFn: createApplication,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"]
            })
        }
    });


    if (isLoading || isBookmarksLoading || isApplicationsLoading) {
        return <p>채용공고를 불러오는 중입니다...</p>;
    }

    if (isError || isBookmarksError || isApplicationsError) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return <p>존재하지 않는 공고입니다.</p>
        }
        return <p>채용공고를 불러오지 못했습니다.</p>;
    }

    if (!job) {
        return <p>존재하지 않는 공고입니다.</p>
    }

    function handleServerApply(id: number) {
        applyMutation.mutate({
            jobId: id,
            status: "지원완료",
            appliedAt: new Date().toISOString()

        })
    }

    const isBookmarked = serverBookmarks.some((bookmark) => {
        return bookmark.jobId === job.id;
    })

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-gray-500 hover:text-black cursor-pointer"
            >
                ← 목록으로 돌아가기
            </button>
            <div className="py-6 space-y-2">
                <div className="flex gap-2">
                    <p className="text-gray-500">{job.company}</p>
                    <button onClick={() => toggleBookmark(job.id)} className="cursor-pointer">
                        {isBookmarked ? "♥" : "♡"}
                    </button>
                </div>
                <p className="text-3xl font-bold">{job.title}</p>
                <div className="flex gap-2">
                    <p className="text-sm">{job.location}</p>
                    <span>·</span>
                    <p className="text-sm">{job.experience}</p>
                    <span>·</span>
                    <p className="text-sm">{job.employmentType}</p>
                </div>
            </div>


            <section className="py-6 border-t">
                <h2 className="text-xl font-bold mb-4">포지션 소개</h2>
                <p className="text-gray-700 leading-7">{job.description}</p>
            </section>
            <section className="py-6 border-t">
                <h2 className="text-xl font-bold mb-4">주요 업무</h2>

                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {job.responsibilities.map((responsibility) => {
                        return (
                            <li key={responsibility}>{responsibility}</li>
                        )
                    })}
                </ul>
            </section>
            <section className="py-6 border-t">
                <h2 className="text-xl font-bold mb-4">자격 요건</h2>

                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {job.requirements.map((req) => {
                        return (
                            <li key={req}>{req}</li>
                        )
                    })}
                </ul>
            </section>
            <section className="py-6 border-t">
                <h2 className="text-xl font-bold mb-4">우대 사항</h2>

                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {job.preferred.map((pre) => {
                        return (
                            <li key={pre}>{pre}</li>
                        )
                    })}
                </ul>
            </section>
            <section className="py-6 border-t">
                <h2 className="text-xl font-bold mb-4">
                    기술 스택
                </h2>

                <div className="flex gap-2">
                    {job.skills.map((skill) => {
                        return (
                            <span
                                key={skill}
                                className="bg-gray-100 px-3 py-2 rounded-lg text-sm"
                            >
                                {skill}
                            </span>
                        );
                    })}
                </div>
            </section>

            <div className="border-t pt-6">
                <p className="text-sm text-gray-500">
                    마감일
                </p>
                <p className="font-semibold mt-1">
                    {job.deadline}
                </p>
            </div>
            <div>
                
                <button
                    onClick={() => handleServerApply(job.id)}
                    disabled={isApplied}
                    className="mt-6 px-6 py-3 bg-black text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isApplied ? "지원완료" : "입사지원하기"}
                </button>
            </div>
        </div>
    )
}
export default JobDetail;