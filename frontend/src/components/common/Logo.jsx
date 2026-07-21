import { Link } from "react-router";
import EduSpaceLogo from "@/assets/EduSpaceLogo-Full.png";

const Logo = ({ className = "w-32 sm:w-36 md:w-40 max-w-full", imgClassName = "w-full h-auto object-contain block", ...props }) => {
    return (
        <div className={`transition-all duration-200 ${className}`} {...props}>
            <Link to="/" className="block">
                <img className={imgClassName} src={EduSpaceLogo} alt="EduSpace Logo" />
            </Link>
        </div>
    );
};

export default Logo;

