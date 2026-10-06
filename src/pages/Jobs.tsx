import { useState } from "react";
import JobCard from "../components/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";

type ExperienceFilter = "전체" | "신입" | "1~3년" | "3~5년";

type JobsProps = {
    bookmarks: number[];
    handleBookmark: (id: number) => void; // 숫자하나 받고 반환값 없는 함수
    // (받는 값들의 타입) => 반환하는 값의 타입

}

type SortOption = "기본순" | "마감 임박순" | "마감 늦은순";

function Jobs({
    bookmarks,
    handleBookmark
}: JobsProps) {

    const {
        data: jobs = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ['jobs'],
        queryFn: getJobs
    })

    const [search, setSearch] = useState("");
    const [experience, setExperience] = useState<ExperienceFilter>("전체");

    const keyword = search.toLowerCase()
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword)
        const matchesExperience =
            experience === "전체" || job.experience === experience

        return matchesSearch && matchesExperience;

    })
    const experienceOptions: ExperienceFilter[] = [
        "전체",
        "신입",
        "1~3년",
        "3~5년"
    ]
    const [sortOption, setSortOption] = useState<SortOption>("기본순");

    const sortedJobs = [...filteredJobs];

    if (sortOption === "마감 임박순") {
        sortedJobs.sort((a, b) => {
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        })
    }
    if (sortOption === "마감 늦은순") {
        sortedJobs.sort((a, b) => {
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        })
    }


    if (isLoading) {
        return <p>채용공고를 불러오는 중입니다...</p>
    }
    if (isError) {
        return <p>채용공고를 불러오지 못했습니다</p>
    }
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">채용공고</h1>
            <div className="space-y-4 mb-6">
                <input
                    type="text"
                    value={search}
                    placeholder="회사명 또는 공고명을 검색하세요"
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <select
                    value={sortOption}
                    onChange={(event) => {
                        setSortOption(event.target.value as SortOption);
                    }}
                >
                    <option value="기본순">기본순</option>
                    <option value="마감 임박순">마감 임박순</option>
                    <option value="마감 늦은순">마감 늦은순</option>
                </select>
                <div>
                    {experienceOptions.map((option) => {
                        return (
                            <button
                                key={option}
                                onClick={() => setExperience(option)}
                                className={`px-4 py-2 rounded-lg cursor-pointer transition ${experience === option
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {option}
                            </button>
                        )
                    })}

                </div>
            </div>
            <div className="space-y-4">
                {sortedJobs.map((job) => {
                    return (
                        <JobCard
                            key={job.id}
                            {...job}
                            bookmarks={bookmarks}
                            handleBookmark={handleBookmark}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Jobs;