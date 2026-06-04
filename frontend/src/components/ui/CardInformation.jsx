const CardInformation = ({ title, description, children }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h1 className={`text-2xl font-bold tracking-tight`}>
                {children ? children : title}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{description}</p>
        </div>
    );
};

export default CardInformation;
