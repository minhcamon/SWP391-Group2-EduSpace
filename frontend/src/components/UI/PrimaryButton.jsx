const PrimaryButton = ({ buttonText, type = "button" }) => {
    return (
        <div>
            <button
                type={type}
                className="bg-primary text-white font-semibold text-md w-full rounded-xl py-2 hover:cursor-pointer hover:opacity-90"
            >
                {buttonText}
            </button>
        </div>
    );
};

export default PrimaryButton;
