const Badge = ({ title, children }) => {
    return (
        <p className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 rounded-full">
            {children ? children : title}
        </p>
    );
};

export default Badge;
