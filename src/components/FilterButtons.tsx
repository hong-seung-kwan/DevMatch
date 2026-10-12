type FilterButtonsProps = {
    title: string,
    options: string[],
    selectedValue: string;
    onChange: (value: string) => void;
}

function FilterButtons({
    title,
    options,
    selectedValue,
    onChange
}: FilterButtonsProps) {
    return (
        <div>
            <p className="mb-2 font-semibold">
                {title}
            </p>

            <div className="flex flex-wrap lg:flex-col gap-2">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`rounded-lg px-3 py-2 text-left transition lg:w-full ${selectedValue === option
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterButtons;