import React from "react";
import Header from "@/components/layouts/Header";
import UserProfileView from "@/modules/shared-features/pages/UserProfilePage";

const Profile = () => {
    return (
        <div className="min-h-screen bg-bg-base flex flex-col">
            <Header />
            <UserProfileView />
        </div>
    );
};

export default Profile;
