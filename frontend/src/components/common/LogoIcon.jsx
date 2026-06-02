import { Link } from "react-router";
import LogoIcon from "/favicon.png";

const LogoIcon = () => {
    return (
        <div>
            <Link to="/">
                <div>
                    <img className="w-full h-auto" src={LogoIcon} alt="Edu Space Logo" />
                </div>
            </Link>
        </div>
    );
};

export default LogoIcon;
