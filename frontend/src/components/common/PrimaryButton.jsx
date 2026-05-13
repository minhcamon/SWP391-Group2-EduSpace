import React from "react";

const PrimaryButton = ({ buttonText, type = "button" }) => {
    return (
        <div>
            <button type={type} className="bg-secondary text-white font-semibold text-md w-full rounded-xl py-4 hover:cursor-pointer hover:opacity-90">
                {buttonText}
            </button>
        </div>
    );
};

export default PrimaryButton;
