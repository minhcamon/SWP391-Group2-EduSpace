import Button from "./Button";

const PrimaryButton = ({ action, title, ...props }) => {
    return (
        <Button
            onClick={action}
            className="flex-1 text-sm rounded-2xl bg-primary text-white px-4 py-2 hover:cursor-pointer hover:scale-95 transition-colors hover:bg-secondary"
            {...props}
        >
            {title}
        </Button>
    );
};

export default PrimaryButton;

