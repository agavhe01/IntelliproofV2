import React from "react";

interface FooterProps {
    profile: any;
    user: any;
}

const Footer: React.FC<FooterProps> = ({ profile, user }) => {
    const displayName = `${profile?.first_name || user?.user_metadata?.first_name || ""} ${profile?.last_name || user?.user_metadata?.last_name || ""}`.trim();
    return (
        <footer className="w-full py-4 px-8 bg-black border-t border-zinc-800 flex justify-center items-center">
            <span className="text-white text-lg font-medium">
                Welcome {displayName || "User"}
            </span>
        </footer>
    );
};

export default Footer; 