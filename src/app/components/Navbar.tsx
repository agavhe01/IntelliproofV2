"use client";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";

const NAV_ITEMS = [
    { key: "home", label: "Home", icon: null },
    { key: "graph", label: "Graph Editor", icon: null },
    { key: "discover", label: "Discover", icon: null },
    { key: "profile", label: "Profile", icon: null },
];

interface NavbarProps {
    profile: any;
    user: any;
    onSignOut: () => void;
}

export default function Navbar({ profile, user, onSignOut }: NavbarProps) {
    return (
        <div className="min-h-screen flex bg-black">
            {/* Sidebar Navbar */}
            <nav className="w-48 bg-black flex flex-col py-8 px-6 min-h-screen border-r border-zinc-800">
                {/* Logo and Title */}
                <div className="flex items-center gap-3 mb-12">
                    <Image src="/logo.png" alt="Intelliproof Logo" width={40} height={40} />
                    <span className="text-white text-l font-bold tracking-wide">Intelliproof</span>
                </div>
                {/* Nav Tabs */}
                <div className="flex flex-col gap-2 mt-4">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors
                ${item.key === "home"
                                    ? "bg-white text-black shadow font-bold"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"}
              `}
                            disabled={item.key === "home"}
                        >
                            {/* Optionally add icons here */}
                            {item.label}
                        </button>
                    ))}
                </div>
            </nav>
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="flex justify-end items-center h-20 px-10 border-b border-zinc-800 gap-4">
                    <span className="text-white text-lg font-medium">
                        Welcome {profile?.first_name || user?.user_metadata?.first_name || ""} {profile?.last_name || user?.user_metadata?.last_name || ""}
                    </span>
                    <button
                        onClick={onSignOut}
                        className="ml-4 p-2 rounded hover:bg-zinc-800 transition-colors"
                        title="Logout"
                    >
                        <FaSignOutAlt size={22} color="#fff" />
                    </button>
                </div>
                {/* Main area can be filled later */}
                <div className="flex-1"></div>
            </div>
        </div>
    );
} 