type DashboardStatCardProps = {
    label: string;
    count: number;
}

function DashboardStatCard({
    label,
    count
}: DashboardStatCardProps) {
    return (
        <div className="border border-gray-300 rounded-xl p-5">
            <p className="text-sm text-gray-500">
                {label}
            </p>
            <p className="text-2xl font-bold mt-2">
                {count}
            </p>
        </div>
    )
}

export default DashboardStatCard;