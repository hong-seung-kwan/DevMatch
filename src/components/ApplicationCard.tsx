import { Link } from "react-router-dom";
import type { Application, ApplicationStatus } from "../types/application";
import type { Job } from "../types/job";

// 필요한 props 생각하기
type ApplicationCardProps = {
    job: Job;
    application: Application;
    handleDeleteApplication: (id: number) => void
    handleStatusChange: (id: number, newStatus: ApplicationStatus) => void
}

function ApplicationCard({
    job,
    application,
    handleDeleteApplication,
    handleStatusChange
}: ApplicationCardProps) {

    const appliedDate = new Date(application.appliedAt)
        .toLocaleDateString("ko-KR");
    return (

        <div className="border rounded-xl p-5">
            <div className="flex justify-between items-center">
                <Link
                    to={`/jobs/${job.id}`}
                    className="hover:underline cursor-pointer"
                >
                    {job.company}
                </Link>
                <button
                    onClick={() => handleDeleteApplication(application.id)}
                >
                    지원 취소
                </button>
                <select
                    value={application.status}
                    onChange={(event) => {
                        handleStatusChange(
                            application.id,
                            event.target.value as ApplicationStatus
                        )
                    }}
                >
                    <option value="지원완료">지원완료</option>
                    <option value="서류합격">서류합격</option>
                    <option value="면접">면접</option>
                    <option value="최종합격">최종합격</option>
                </select>
            </div>

            <h2 className="text-lg font-bold">
                {job.title}
            </h2>

            <p className="text-sm text-gray-500">
                {job.skills.join(" · ")}
            </p>

            <p>지원일: {appliedDate}</p>
        </div>
    )
}
export default ApplicationCard;