"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { FaSignOutAlt } from "react-icons/fa";

const NAV_ITEMS = [
    { key: "home", label: "Home", icon: null },
    { key: "graph", label: "Graph Editor", icon: null },
    { key: "discover", label: "Discover", icon: null },
    { key: "profile", label: "Profile", icon: null },
];

export default function HomePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("first_name, last_name")
                    .eq("email", user.email)
                    .single();
                setProfile(data);
            }
        }
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex bg-black">
            {/* Sidebar Navbar */}
            <nav className="w-64 bg-black flex flex-col py-8 px-6 min-h-screen border-r border-zinc-800">
                {/* Logo and Title */}
                <div className="flex items-center gap-3 mb-12">
                    <Image src="/logo.png" alt="Intelliproof Logo" width={40} height={40} />
                    <span className="text-white text-2xl font-bold tracking-wide">Intelliproof</span>
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
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = "/signin";
                        }}
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