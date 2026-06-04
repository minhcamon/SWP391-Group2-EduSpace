const Badge = ({ textColor = "text-primary", title }) => {
    return (
        <p
            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${textColor} bg-primary/10 rounded-full`}
        >
            {title}
        </p>
    );
};

export default Badge;
