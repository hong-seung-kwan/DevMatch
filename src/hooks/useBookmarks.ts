import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBookmark, deleteBookmark, getBookmark } from "../api/bookmarkApi";

function useBookmarks() {

    // 서버에서 북마크 가져오기
    const {
        data: bookmarks = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: getBookmark
    })

    // tanstack query 캐시 관리
    const queryClient = useQueryClient();

    // 북마크 추가 mutation
    const createMutation = useMutation({
        mutationFn: createBookmark,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bookmarks"]
            })
        }
    })

    // 북마크 제거 mutation
    const deleteMutation = useMutation({
        mutationFn: deleteBookmark,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bookmarks"]
            })
        }
    })

    // 외부에서 사용할 북마크 함수
    function addBookmark(jobId: number) {
        

        createMutation.mutate({
            jobId
        })
    }

    function removeBookmark(jobId: number) {
        
        const bookmark = bookmarks.find((bookmark) => {
            return bookmark.jobId === jobId;
        })

        if (!bookmark) return;

        deleteMutation.mutate(bookmark.id);
    }

    function toggleBookmark(jobId: number) {
        const isBookmarked = bookmarks.some((bookmark) => {
            return bookmark.jobId === jobId;
        })
        if (isBookmarked) {
            removeBookmark(jobId)
        } else {
            addBookmark(jobId)
        }
    }

    return {
        bookmarks,
        isLoading,
        isError,
        addBookmark,
        removeBookmark,
        toggleBookmark
    }
}

export default useBookmarks;


/* 
    useQuery: 서버 데이터 조회 담당
    useMutation: 서버 데이터 변경 작업
    mutate(): 변경 작업을 실제 실행
    onSuccess: 변경 성공 후 실행할 작업
    invalidateQueries: 기존 조회 데이터가 오래됐다고 표시하고 최신 데이터 다시 가져오는 작업
*/