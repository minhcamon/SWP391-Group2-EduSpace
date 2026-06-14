import { RxReload } from "react-icons/rx";
import Button from "./Button";

const ReloadButton = ({ action, isLoading, ...props }) => {
    return (
        <Button
            onClick={action}
            isLoading={isLoading}
            className="flex rounded-2xl bg-primary text-white px-4 py-2 hover:cursor-pointer hover:scale-95 gap-2 items-center"
            {...props}
        >
            {!isLoading && <RxReload size={16} />}
            <span>Làm mới</span>
        </Button>
    );
};

export default ReloadButton;

