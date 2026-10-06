import { useQuery } from "@tanstack/react-query";
import JobCard from "../components/JobCard";
import { getJobs } from "../api/jobApi";

// 필요한거 ? 북마크
type BookmarksProps = {
    bookmarks: number[]
    handleBookmark: (id: number) => void;
};

function Bookmarks({
    bookmarks,
    handleBookmark
}: BookmarksProps) {

    const {
        data: jobs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs
    })

    const bookmarkedJobs = jobs.filter((job) => {
        return bookmarks.includes(job.id);
    })

    if(isLoading){
        return <p>북마크 공고를 불러오는 중입니다...</p>
    }
    if(isError) {
        return <p>북마크 공고를 불러오지 못했습니다...</p>
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">북마크</h1>
            {bookmarkedJobs.length === 0 && (

                <p>북마크한 공고가 없습니다.</p>

            )}
            <div className="space-y-4">
                {bookmarkedJobs.map((job) => {
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

export default Bookmarks;