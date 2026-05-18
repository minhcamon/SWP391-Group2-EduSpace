import React from "react";

const InputField = ({ icon: Icon, inputType, placeholder, name, value, onChange }) => {
    return (
        <div className="relative">
            {<Icon className="absolute left-3.5 top-2.5 text-gray-400" size={20} />}
            <input
                type={inputType}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
        </div>
    );
};

export default InputField;
