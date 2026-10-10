import JobCard from "../components/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";
import useBookmarks from "../hooks/useBookmarks";
import { useSearchParams } from "react-router-dom";

type ExperienceFilter = "전체" | "신입" | "1~3년" | "3~5년";
type SortOption = "기본순" | "마감 임박순" | "마감 늦은순";
type EmploymentFilter = "전체" | "정규직" | "계약직" | "인턴";

function Jobs() {

    const {
        data: jobs = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ['jobs'],
        queryFn: getJobs
    })

    const {
        bookmarks: serverBookmarks,
        isLoading: isBookmarkLoading,
        isError: isBookmarkError,
        toggleBookmark
    } = useBookmarks();

    const bookmarkedJobIds = serverBookmarks.map((bookmark) => {
        return bookmark.jobId;
    })


    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const experience = (searchParams.get("experience") as ExperienceFilter) ?? "전체";
    const employmentType = (searchParams.get("employmentType") as EmploymentFilter) ?? "전체";
    const sort = (searchParams.get("sort") as SortOption) ?? "기본순";
    const keyword = search.toLowerCase()
    const hasActiveFilters =
        search !== "" ||
        experience !== "전체" ||
        employmentType !== "전체" ||
        sort !== "기본순";

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword)
        const matchesExperience =
            experience === "전체" || job.experience === experience

        const matchesEmploymentType =
            employmentType === "전체" || job.employmentType === employmentType

        return matchesSearch && matchesExperience && matchesEmploymentType;

    })
    const experienceOptions: ExperienceFilter[] = [
        "전체",
        "신입",
        "1~3년",
        "3~5년"
    ]
    const employmentTypeOptions: EmploymentFilter[] = [
        "전체",
        "정규직",
        "계약직",
        "인턴"
    ]


    const sortedJobs = [...filteredJobs];

    if (sort === "마감 임박순") {
        sortedJobs.sort((a, b) => {
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        })
    }
    if (sort === "마감 늦은순") {
        sortedJobs.sort((a, b) => {
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        })
    }


    if (isLoading || isBookmarkLoading) {
        return <p>채용공고를 불러오는 중입니다...</p>
    }
    if (isError || isBookmarkError) {
        return <p>채용공고를 불러오지 못했습니다</p>
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">채용공고</h1>
                    <p className="mt-2 text-gray-500">나에게 맞는 채용공고를 찾아보세요.</p>
                </div>

                <div className="space-y-4 mb-6">
                    <input
                        type="text"
                        value={search}
                        placeholder="회사명 또는 공고명을 검색하세요"
                        onChange={(e) => {
                            setSearchParams((prev) => {
                                const next = new URLSearchParams(prev)
                                if (e.target.value) {
                                    next.set("search", e.target.value);
                                } else {
                                    next.delete("search")
                                }

                                return next
                            })
                        }}
                        className="w-full border border-gray rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
                    <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">
                                필터
                            </h2>

                            <button
                                type="button"
                                disabled={!hasActiveFilters}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 transition enabled:hover:text-gray-900 enabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => {
                                    setSearchParams("");
                                }}
                            >
                                ↻ 초기화
                            </button>
                        </div>
                        <div className="mt-6">
                            <p className="mb-3 text-sm font-medium text-gray-700">
                                경력
                            </p>

                            <div className="flex flex-wrap gap-2 lg:flex-col">
                                {experienceOptions.map((option) => {
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSearchParams((prev) => {
                                                    const next = new URLSearchParams(prev);

                                                    if (option === "전체") {
                                                        next.delete("experience");
                                                    } else {
                                                        next.set("experience", option);
                                                    }

                                                    return next;
                                                });
                                            }}
                                            className={`rounded-lg px-3 py-2 text-left transition lg:w-full ${experience === option
                                                ? "bg-black text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}

                            </div>
                        </div>
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <p className="mb-3 text-sm font-medium text-gray-700">
                                고용형태
                            </p>
                            <div className="flex flex-wrap gap-2 lg:flex-col">
                                {employmentTypeOptions.map((option) => {
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSearchParams((prev) => {
                                                    const next = new URLSearchParams(prev);

                                                    if (option === "전체") {
                                                        next.delete("employmentType")
                                                    } else {
                                                        next.set("employmentType", option)
                                                    }

                                                    return next;
                                                })
                                            }}
                                            className={`rounded-lg px-3 py-2 text-left transition lg:w-full ${employmentType === option
                                                ? "bg-black text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </aside>

                    <main>
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                총 {sortedJobs.length}개의 채용공고
                            </p>

                            <select
                                value={sort}
                                onChange={(e) => {
                                    const value = e.target.value as SortOption;

                                    setSearchParams((prev) => {
                                        const next = new URLSearchParams(prev);

                                        if (value === "기본순") {
                                            next.delete("sort");
                                        } else {
                                            next.set("sort", value);
                                        }

                                        return next;
                                    });
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                            >
                                <option value="기본순">기본순</option>
                                <option value="마감 임박순">마감 임박순</option>
                                <option value="마감 늦은순">마감 늦은순</option>
                            </select>
                        </div>

                        <div className="space-y-5">
                            {sortedJobs.map((job) => {
                                return (
                                    <JobCard
                                        key={job.id}
                                        {...job}
                                        bookmarks={bookmarkedJobIds}
                                        handleBookmark={toggleBookmark}
                                    />
                                );
                            })}
                        </div>
                        {sortedJobs.length === 0 && (
                            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                                <p className="font-medium text-gray-700">조건에 만족하는 공고가 없습니다.</p>
                                <p className="mt-2 text-sm text-gray-400">다른 검색이나 필터 조건을 선택해보세요.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Jobs;