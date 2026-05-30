import { Book } from "lucide-react";
import { Link } from "react-router";

const Logo = () => {
    return (
        <div>
            <Link to="/">
                <div className="flex">
                    <Book className=" text-primary" size={36} />
                    <h1 className="ml-2 font-bold text-3xl text-primary">
                        EduSpace
                    </h1>
                </div>
            </Link>
        </div>
    );
};

export default Logo;
