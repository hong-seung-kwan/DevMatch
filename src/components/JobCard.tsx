import { Link } from "react-router-dom";
import type { Job } from "../types/job";

type JobCardProps = Job & {
    bookmarks: number[]
    handleBookmark: (id: number) => void;
}

function JobCard({
    id,
    company,
    title,
    location,
    experience,
    skills,
    employmentType,
    deadline,
    bookmarks,
    handleBookmark
}: JobCardProps) {
    const isBookmarked = bookmarks.includes(id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diff = deadlineDate.getTime() - today.getTime();

    const oneDay = 1000 * 60 * 60 * 24;

    const daysLeft = Math.ceil(diff / oneDay);

    let deadlineText: string;

    if (daysLeft < 0) {
        deadlineText = "마감";
    } else if (daysLeft === 0) {
        deadlineText = "오늘 마감";
    } else {
        deadlineText = `D-${daysLeft}`;
    }

    return (

        <Link to={`/jobs/${id}`}>

            <div className="space-y-4 rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-sm p-6 mb-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-500">{company}</h2>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault(); // Link의 페이지 이동을 막는 용도
                            handleBookmark(id);
                        }}
                        className="text-2xl transition hover:scale-110"
                    >
                        {isBookmarked ? "★" : "☆"}
                    </button>
                </div>
                <p className="text-xl font-bold text-gray-900">{title}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{location}</span>
                    <span>·</span>
                    <span>{experience}</span>
                    <span>·</span>
                    <span>{employmentType}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => {
                        return (
                            <span
                                key={skill}
                                className="rounded-md text-sm bg-gray-100 px-2.5 py-1 text-gray-600"
                            >{skill}</span>

                        )
                    })}
                </div>


                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm text-gray-400">
                        마감일: {deadline}
                    </span>

                    <span className="text-sm font-semibold text-blue-600">
                        {deadlineText}
                    </span>
                </div>
            </div>
        </Link >
    )
}

export default JobCard;