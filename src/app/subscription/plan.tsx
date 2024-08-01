interface Props {
    plan: string;
    price: number;
    features: string[];
    selected: boolean;
    disabled: boolean;
    onSelect: (plan: string, price: number) => void;
}

const Plan = ({ plan, price, features, selected, disabled, onSelect }: Props) => {
    return (
        <div
            className={`cursor-pointer transition-transform transform ${selected ? 'border-blue-500 scale-105 shadow-lg rounded-lg' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSelect(plan, price)}
        >
            <div className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
                <h2 className="text-2xl font-semibold">{plan}</h2>
            </div>
            <div className="p-4 border-2 rounded-b-lg">
                <p className="text-lg mb-2">₹{price}/month</p>
                <ul className="list-disc list-inside">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Plan;
