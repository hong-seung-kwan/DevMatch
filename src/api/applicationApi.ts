import type { Application, ApplicationStatus, CreateApplication } from "../types/application";
import api from "./axios";


export async function getApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>("/applications");

    return response.data;
}

export async function createApplication(
    application: CreateApplication
): Promise<Application> {

    const response = await api.post<Application>(
        "/applications",
        application
    );

    return response.data;
}

export async function updateApplicationStatus(
    id:number,
    status: ApplicationStatus
): Promise<Application> {
    const response = await api.patch<Application>(
        `/applications/${id}`,
        {status}
    );

    return response.data;
}

export async function deleteApplication(
    id: number
) : Promise<void> { // <void> 함수가 완료되기는 하는데 사용할 반환값은 없음..
    await api.delete(`/applications/${id}`);
}