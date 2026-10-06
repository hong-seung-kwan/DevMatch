type ApplicationStatusCardProps = {
    label: string;
    count: number;
    onClick: () => void;
    isActive: boolean;
}

function ApplicationStatusCard({
    label,
    count,
    onClick,
    isActive
}: ApplicationStatusCardProps) {
    return (
        <div
            className={`border rounded-xl p-5 cursor-pointer hover:bg-gray-50 transition ${isActive
                    ? "border-none bg-blue-100 text-blue-600"
                    : "border-gray-200 text-gray-500"
                }`}
            onClick={onClick}>
            <p className="text-sm">
                {label}
            </p>

            <p className="text-2xl font-bold mt-2">
                {count}
            </p>
        </div>
    )
}
export default ApplicationStatusCard