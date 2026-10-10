import type { CreateJob, Job } from "../types/job";
import api from "./axios";

// Mock data를 바로 반환해서 async가 필요없지만
// 추후 API 연결하면 비동기 함수가 필요하므로 미리 async로 작성 겸 연습.. 
export async function getJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>("jobs");
    console.log(response);

    return response.data;
    // await new Promise((resolve) => { // await new Promise => 이 Promise가 끝날 때까지 기다렸다가 다음 코드로
    //     setTimeout(resolve, 1000);
    // })
    // return jobs;
}

export async function getJob(
    id: number
): Promise<Job> {

    const response = await api.get<Job>(`/jobs/${id}`);

    return response.data;
    // const job = jobs.find((job) => {
    //     return job.id === id;
    // })

    // if(!job) {
    //     throw new Error("JOB_NOT_FOUND");
    // }
    // return job;
}

export async function createJob(
    job: CreateJob
): Promise<Job> {
    const response = await api.post<Job>(
        "/jobs",
        job
    );

    return response.data;
}
//Promise ? 비동기 작업의 미래 결과를 나타내는 객체

//Promise<Job[]> = 비동기 작업이 성공하면 Job[]을 결과로 받는다는 의미