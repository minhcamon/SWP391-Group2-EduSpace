const PrimaryButton = ({ action, title }) => {
    return (
        <button
            onClick={() => {
                action();
            }}
            className="flex-1 text-sm rounded-2xl bg-primary text-white px-4 py-2 hover:cursor-pointer hover:scale-95 transition-colors hover:bg-secondary"
        >
            <p className="flex justify-center my-auto text-center">{title}</p>
        </button>
    );
};

export default PrimaryButton;
