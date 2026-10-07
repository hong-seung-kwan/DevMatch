import type { Bookmark, CreateBookmark } from "../types/bookmark";
import api from "./axios";

export async function getBookmark(): Promise<Bookmark[]> {
    const response = await api.get<Bookmark[]>("/bookmarks");

    return response.data;
}

export async function createBookmark(
    bookmark: CreateBookmark
): Promise<Bookmark> {
    const response = await api.post<Bookmark>(
        "/bookmarks",
        bookmark
    );

    return response.data;
}

export async function deleteBookmark(
    id:number
): Promise<void> {
    await api.delete(`/bookmarks/${id}`)
}