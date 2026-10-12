import JobCard from "../components/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobApi";
import useBookmarks from "../hooks/useBookmarks";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FilterButtons from "../components/FilterButtons";

type ExperienceFilter = "전체" | "신입" | "1~3년" | "3~5년";
type SortOption = "기본순" | "마감 임박순" | "마감 늦은순";
type EmploymentFilter = "전체" | "정규직" | "계약직" | "인턴";

const EXPERIENCE_OPTIONS: ExperienceFilter[] = [
    "전체",
    "신입",
    "1~3년",
    "3~5년"
]
const EMPLOYMENT_TYPE_OPTIONS: EmploymentFilter[] = [
    "전체",
    "정규직",
    "계약직",
    "인턴"
]
const SORT_OPTIONS: SortOption[] = [
    "기본순",
    "마감 임박순",
    "마감 늦은순"
];
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
    const experience = (searchParams.get("experience") as ExperienceFilter) ?? "전체";
    const employmentType = (searchParams.get("employmentType") as EmploymentFilter) ?? "전체";
    const sort = (searchParams.get("sort") as SortOption) ?? "기본순";
    const keyword = search.toLowerCase()

    const hasActiveFilters =
        search !== "" ||
        experience !== "전체" ||
        employmentType !== "전체" ||
        sort !== "기본순";

    function updateSearchParams(
        key: string,
        value: string,
        defaultValue: string
    ) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            if (value === defaultValue) {
                next.delete(key)
            } else {
                next.set(key, value)
            }
            return next;
        })
    }
    function resetFilters() {
        setSearchParams("");
        setSearchInput("");
    }

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


    const sortedJobs = [...filteredJobs];

    switch (sort) {
        case "마감 임박순":
            sortedJobs.sort((a, b) => {
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            })
            break;

        case "마감 늦은순":
            sortedJobs.sort((a, b) => {
                return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
            })
            break;

        default:
            break;
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();

                            updateSearchParams("search", searchInput, "");
                        }}
                    >
                        <input
                            type="text"
                            value={searchInput}
                            placeholder="회사명 또는 공고명을 검색하세요"
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                            }}
                            className="w-full border border-gray rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </form>
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
                                onClick={resetFilters}
                            >
                                ↻ 초기화
                            </button>
                        </div>
                        <div className="mt-6">
                            <FilterButtons
                                title="경력"
                                options={EXPERIENCE_OPTIONS}
                                selectedValue={experience}
                                onChange={(value) => {
                                    updateSearchParams("experience", value, "전체")
                                }}
                            />
                        </div>
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <FilterButtons
                                title="고용형태"
                                options={EMPLOYMENT_TYPE_OPTIONS}
                                selectedValue={employmentType}
                                onChange={(value) => {
                                    updateSearchParams("employmentType", value, "전체")
                                }}
                            />
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

                                    updateSearchParams("sort", value, "기본순");
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-5">
                            {sortedJobs.map((job) => {
                                return (
                                    <JobCard
                                        key={job.id}
                                        {...job}
                                        isBookmarked={bookmarkedJobIds.includes(job.id)}
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