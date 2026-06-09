import React from "react";

const DEFAULT_AVATAR = "/images/default-avatar.png";

const Avatar = ({
    src,
    alt = "User Avatar",
    className = "",
    fallbackSrc = DEFAULT_AVATAR,
    ...props
}) => {
    const avatarSrc = src || fallbackSrc;

    return (
        <img
            src={avatarSrc}
            alt={alt}
            className={`rounded-full object-cover ${className}`}
            {...props}
        />
    );
};

export default Avatar;
