type JobDetailSectionProps = {
    title: string;
    items: string[];
}

function JobDetailSection({
    title,
    items
}: JobDetailSectionProps) {
    return (
        <section className="py-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4">
                {title}
            </h2>

            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {items.map((item) => (
                    <li key={item}>
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    )
}
export default JobDetailSection;