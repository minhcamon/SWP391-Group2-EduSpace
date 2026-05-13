import React from "react";

const InputField = ({ icon: Icon, inputType, placeholder }) => {
    return (
        <div className="relative">
            {<Icon className="absolute left-3 top-4 text-gray-400" size={20} />}
            <input
                type={inputType}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
        </div>
    );
};

export default InputField;
