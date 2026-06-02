import { useEffect } from "react";
import { useLocation } from "react-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress (disable spinner, adjust animation speed)
NProgress.configure({ showSpinner: false, speed: 400 });

const RouteProgressBar = () => {
    const location = useLocation();

    useEffect(() => {
        NProgress.start();
        NProgress.done();
    }, [location]);

    return null;
};

export default RouteProgressBar;
