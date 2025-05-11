"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
import Carousel from "../components/Carousel";

const NAV_ITEMS = [
    { key: "home", label: "Home", icon: null },
    { key: "graph", label: "Graph Editor", icon: null },
    { key: "profile", label: "Profile", icon: null },
    { key: "models", label: "Models", icon: null },
];

const ProfilePage = dynamic(() => import("../profile/page"), { ssr: false });
const GraphEditor = dynamic(() => import("../components/graph/GraphEditor"), {
    ssr: false,
    loading: () => <div className="text-white p-4">Loading Graph Editor...</div>
});

export default function HomePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [selectedTab, setSelectedTab] = useState("home");

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("email", user.email)
                    .single();
                setProfile(data);
            }
        }
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/signin";
    };

    return (
        <div className="min-h-screen flex bg-black">
            {/* Sidebar with header */}
            <div className="w-48 flex flex-col min-h-screen bg-black border-r border-zinc-800">
                {/* Top Bar (Header) */}
                <div className="w-full flex items-center h-16 px-4 border-b border-zinc-800">
                    <span className="text-white text-base font-medium truncate">
                        {profile?.first_name || user?.user_metadata?.first_name || ""} {profile?.last_name || user?.user_metadata?.last_name || ""}
                    </span>
                </div>
                {/* Logo and Title */}
                <div className="flex items-center gap-3 mb-12 mt-6 px-4">
                    <Image src="/logo.png" alt="Intelliproof Logo" width={40} height={40} />
                    <span className="text-white text-l font-bold tracking-wide">Intelliproof</span>
                </div>
                {/* Nav Tabs */}
                <div className="flex flex-col gap-2 mt-4 px-2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors
                ${selectedTab === item.key
                                    ? "bg-white text-black shadow font-bold"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"}
              `}
                            onClick={() => setSelectedTab(item.key)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                {/* Sign Out button at the bottom */}
                <div className="flex-1 flex flex-col justify-end pb-8 px-4">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        title="Logout"
                    >
                        <FaSignOutAlt size={18} /> Sign Out
                    </button>
                </div>
            </div>
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {selectedTab === "profile" && (
                    <div className="flex-1 flex flex-col">
                        <ProfilePage />
                    </div>
                )}
                {selectedTab === "graph" && (
                    <div className="flex-1 flex flex-col">
                        <GraphEditor />
                    </div>
                )}
                {selectedTab === "home" && (
                    <div className="flex-1 flex flex-col">
                        <div className="p-8">
                            <h1 className="text-2xl font-bold text-white">Welcome to Intelliproof</h1>
                            <p className="text-zinc-300 mt-4">
                                Select a tab from the sidebar to get started with your argument mapping journey.
                            </p>
                        </div>
                    </div>
                )}
                {selectedTab === "models" && (
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 flex flex-col">
                            {/* Carousel goes here */}
                            <Carousel />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 