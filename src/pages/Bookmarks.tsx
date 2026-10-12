import { useQuery } from "@tanstack/react-query";
import JobCard from "../components/JobCard";
import { getJobs } from "../api/jobApi";
import useBookmarks from "../hooks/useBookmarks";

function Bookmarks() {

    const {
        data: jobs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs
    })

    const {
        bookmarks: serverBookmarks,
        isLoading: isBookmarksLoading,
        isError: isBookmarksError,
        toggleBookmark
    } = useBookmarks();


    const bookmarkedJobIds = serverBookmarks.map(
        (bookmark) => bookmark.jobId
    );

    const bookmarkedJobs = jobs.filter(
        (job) => bookmarkedJobIds.includes(job.id)
    );


    if (isLoading || isBookmarksLoading) {
        return <p>북마크 공고를 불러오는 중입니다...</p>
    }
    if (isError || isBookmarksError) {
        return <p>북마크 공고를 불러오지 못했습니다...</p>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-6">북마크</h1>
                        <p className="mt-2 text-sm text-gray-500">관심 있는 채용공고를 모아볼 수 있습니다.</p>
                    </div>
                    <p className="text-sm text-gray-500">총 {bookmarkedJobs.length}개</p>
                </div>
                {bookmarkedJobs.length === 0 && (

                    <div className="rounded-xl bg-white py-16 text-center">
                        <p className="font-medium text-gray-700">북마크한 공고가 없습니다.</p>
                    </div>

                )}
                <div className="space-y-4">
                    {bookmarkedJobs.map((job) => {
                        return (
                            <JobCard
                                key={job.id}
                                {...job}
                                isBookmarked={bookmarkedJobIds.includes(job.id)}
                                handleBookmark={toggleBookmark}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Bookmarks;