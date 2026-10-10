// 채용공고 타입 지정

export type Job = {
    id: number;
    company: string;
    title: string;
    location: string;
    experience: string;
    skills: string[];
    employmentType: string;
    deadline: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    preferred: string[];
}

// Omit : 기존 타입에서 특정 속성 빼고 새로운 타입만들기
export type CreateJob = Omit<Job, "id">;