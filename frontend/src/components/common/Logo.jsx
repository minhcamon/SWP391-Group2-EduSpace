import { Link } from "react-router";
import EduSpaceLogo from "@/assets/EduSpaceLogo-Full.png";

const Logo = () => {
    return (
        <div>
            <Link to="/">
                <div>
                    <img className="w-full h-auto" src={EduSpaceLogo} alt="Edu Space Logo" />
                </div>
            </Link>
        </div>
    );
};

export default Logo;
