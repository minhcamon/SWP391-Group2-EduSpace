import React from "react";

const InputField = ({ icon: Icon, inputType, placeholder, name, value, onChange }) => {
    return (
        <div className="relative">
            {<Icon className="absolute left-3.5 top-4.5 text-gray-400" size={20} />}
            <input
                type={inputType}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
        </div>
    );
};

export default InputField;
