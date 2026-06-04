import { RxReload } from "react-icons/rx";

const ReloadButton = ({ action }) => {
    return (
        <button
            onClick={() => {
                action();
            }}
            className="flex rounded-2xl bg-primary text-white px-4 py-2 hover:cursor-pointer hover:scale-95"
        >
            <RxReload size={16} className="mt-1" />{" "}
            <p className="ml-2 flex justify-center my-auto text-center">
                Làm mới
            </p>
        </button>
    );
};

export default ReloadButton;
