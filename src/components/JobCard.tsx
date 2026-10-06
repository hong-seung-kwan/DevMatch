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
    return (

        <Link to={`/jobs/${id}`}>

            <div className="border rounded-xl p-5 space-y-3">
                <div className="flex gap-2">
                    <h2 className="text-sm text-gray-500">{company}</h2>
                    <button
                        onClick={(event) => {
                            event.preventDefault(); // Link의 페이지 이동을 막는 용도
                            handleBookmark(id);
                        }}
                    >
                        {isBookmarked ? "♥" : "♡"}
                    </button>
                </div>
                <p className="text-xl font-bold">{title}</p>

                <div className="flex gap-2">
                    <p className="text-sm">{location}</p>
                    <span>·</span>
                    <p className="text-sm">{experience}</p>
                    <span>·</span>
                    <p className="text-sm">{employmentType}</p>
                </div>

                <div className="flex gap-2">
                    {skills.map((skill) => {
                        return (
                            <span
                                key={skill}
                                className="text-sm bg-gray-100 rounded-lg px-2 py-1"
                            >{skill}</span>

                        )
                    })}
                </div>


                <p className="text-sm text-gray-500">마감일: {deadline}</p>

            </div>
        </Link >
    )
}

export default JobCard;