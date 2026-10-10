import { useState } from "react";
import type { SubmitEventHandler } from "react";
import type { CreateJob } from "../types/job";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "../api/jobApi";
import { useNavigate } from "react-router-dom";

function JobCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState<CreateJob>({
        company: "",
        title: "",
        location: "",
        experience: "",
        skills: [],
        employmentType: "",
        deadline: "",
        description: "",
        responsibilities: [],
        requirements: [],
        preferred: []
    })

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createJob,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["jobs"]
            })
            navigate("/jobs");
        }
    })

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        createMutation.mutate(form);
    };

    return (
        <div className="min-h-screnn bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="mb-8">

                    <h1 className="text-2xl font-bold">
                        채용공고 등록
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        새로운 채용공고 정보를 입력해주세요.
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                >
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            기본 정보
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            채용공고의 기본 정보를 입력해주세요.
                        </p>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            회사명
                        </label>
                        <input
                            type="text"
                            value={form.company}
                            placeholder="회사명을 입력하세요"
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    company: e.target.value
                                })
                            }}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            공고 제목
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            placeholder="공고 제목을 입력하세요"
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    title: e.target.value
                                })
                            }}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                근무 지역
                            </label>
                            <input
                                type="text"
                                value={form.location}
                                placeholder="근무지역을 입력하세요"
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        location: e.target.value
                                    })
                                }}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                경력
                            </label>
                            <select
                                value={form.experience}
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        experience: e.target.value
                                    })
                                }}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            >
                                <option value="">경력을 선택하세요</option>
                                <option value="신입">신입</option>
                                <option value="1~3년">1~3년</option>
                                <option value="3~5년">3~5년</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            기술 스택
                        </label>
                        <input
                            type="text"
                            value={form.skills.join(", ")}
                            placeholder="ex) React, TypeScript, Tailwind"
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    skills: e.target.value.split(",").map((skill) => skill.trim())
                                })
                            }}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                고용형태
                            </label>
                            <select
                                value={form.employmentType}
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        employmentType: e.target.value
                                    })
                                }}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            >
                                <option value="">고용형태를 선택하세요</option>
                                <option value="정규직">정규직</option>
                                <option value="계약직">계약직</option>
                                <option value="인턴">인턴</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                마감일
                            </label>
                            <input
                                type="date"
                                value={form.deadline}
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        deadline: e.target.value
                                    })
                                }}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            상세 정보
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            포지션의 업무와 지원 요건을 입력해주세요.
                        </p>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            포지션 소개
                        </label>
                        <textarea
                            value={form.description}
                            placeholder="포지션 소개를 입력하세요"
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }}
                            className="min-h-28 w-full resize-y rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            주요 업무
                        </label>
                        <textarea
                            value={form.responsibilities.join("\n")}
                            placeholder="주요 업무를 한 줄씩 입력하세요"
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    responsibilities: e.target.value.split("\n").map((item) => item.trim())
                                })
                            }}
                            className="min-h-36 w-full resize-y rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            자격 요건
                        </label>
                        <textarea
                            value={form.requirements.join("\n")}
                            placeholder="자격 요건을 한 줄 씩 입력하세요"
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    requirements: e.target.value.split("\n").map((item) => item.trim())
                                })
                            }}
                            className="min-h-36 w-full resize-y rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            우대사항
                        </label>
                        <textarea
                            value={form.preferred.join("\n")}
                            placeholder="우대 사항을 한 줄씩 입력하세요"
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    preferred: e.target.value.split("\n").map((item) => item.trim())
                                })
                            }}
                            className="min-h-36 w-full resize-y rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />
                    </div>
                    <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/jobs")}
                            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createMutation.isPending ? "등록 중..." : "공고 등록"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default JobCreate;