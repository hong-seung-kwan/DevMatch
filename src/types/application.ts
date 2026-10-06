export type ApplicationStatus = 
"지원완료"
|"서류합격"
|"면접"
|"최종합격";

export type Application = { // 서버에서 받을 때 id 있음
    id:number;
    jobId: number;
    status: ApplicationStatus;
    appliedAt: string;
}

export type CreateApplication = { // 서버에 보낼 데이터에 id없음
    jobId: number;
    status: ApplicationStatus;
    appliedAt: string;
}