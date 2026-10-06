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