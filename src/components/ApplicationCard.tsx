import { Link } from "react-router-dom";
import type { Application, ApplicationStatus } from "../types/application";
import type { Job } from "../types/job";
import { APPLICATION_STATUSES } from "../types/application";

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

    const statusClasses: Record<ApplicationStatus, string> = {
        지원완료: "bg-gray-100 text-gray-700",
        서류합격: "bg-blue-50 text-blue-700",
        면접: "bg-orange-50 text-orange-700",
        최종합격: "bg-green-50 text-green-700"
    };

    const statusClass = statusClasses[application.status];
    return (

        <div className="border border-gray-200 bg-white rounded-xl p-5 transition hover:shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        to={`/jobs/${job.id}`}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline cursor-pointer"
                    >
                        {job.company}
                    </Link>

                    <h2 className="text-lg font-bold text-gray-900">
                        {job.title}
                    </h2>
                </div>

                <select
                    value={application.status}
                    onChange={(event) => {
                        handleStatusChange(
                            application.id,
                            event.target.value as ApplicationStatus
                        )
                    }}
                    className={`rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium outline-none ${statusClass}`}
                >
                    {APPLICATION_STATUSES.map((status) => {
                        return (
                            <option
                                key={status}
                                value={status}
                                className="text-gray-900 bg-white"
                            >
                                {status}
                            </option>
                        );
                    })}
                </select>
            </div>

            <p className="text-sm text-gray-500">
                {job.skills.join(" · ")}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">지원일: {appliedDate}</p>
                <button
                    onClick={() => handleDeleteApplication(application.id)}
                    className="cursor-pointer text-sm font-medium text-red-500 transition hover:text-red-700"
                >
                    지원 취소
                </button>
            </div>
        </div>
    )
}
export default ApplicationCard;