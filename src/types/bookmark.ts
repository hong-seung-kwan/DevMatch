export type Bookmark = {
    id:number;
    jobId:number;
}
export type CreateBookmark = Omit<Bookmark, "id">;