"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [graphs, setGraphs] = useState<any[]>([]);
    const [storageUsage, setStorageUsage] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const mockCollaborators = [
        {
            name: "Jane Smith",
            email: "jane.smith@email.com",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Data scientist and graph enthusiast.",
        },
        {
            name: "John Doe",
            email: "john.doe@email.com",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Collaborated on multiple projects.",
        },
    ];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return setLoading(false);
            const rawEmail = user.email;
            const emailToQuery = rawEmail ? rawEmail.trim().toLowerCase() : "";
            console.log('user.email:', rawEmail);
            console.log('Normalized email for query:', emailToQuery);
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("email", emailToQuery)
                .single();
            console.log('Supabase profile query result:', profileData);
            if (profileError) {
                console.error('Supabase profile query error:', profileError);
            }
            setProfile(profileData);
            const { data: graphsData } = await supabase
                .from("graphs")
                .select("*")
                .eq('owner_email', user.email)
                .order("created_at", { ascending: false });
            setGraphs(graphsData || []);
            const totalSize = (graphsData || []).reduce(
                (sum, g) => sum + JSON.stringify(g.graph_data).length,
                0
            );
            setStorageUsage(totalSize);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="text-white p-8">Loading...</div>;
    if (!profile) return <div className="text-white p-8">No profile found.</div>;

    const displayName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.email;
    const joinedOn = profile.created_at ? format(new Date(profile.created_at), "PPP") : "";
    const lastActive = graphs[0]?.created_at
        ? format(new Date(graphs[0].created_at), "PPP p")
        : (profile.last_login ? format(new Date(profile.last_login), "PPP p") : joinedOn);
    const publicProfileUrl = `/user/${profile.email}`;

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center py-10">
            <div className="w-full max-w-3xl bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col gap-8">
                {/* Main Header: Full Name */}
                <h1 className="text-xl font-semibold mb-4">{displayName}</h1>
                {/* 1. Basic Info */}
                <div className="flex gap-6 items-center justify-between">
                    <div className="flex gap-6 items-center">
                        {profile.avatar_url ? (
                            <Image src={profile.avatar_url} alt="Avatar" width={96} height={96} className="rounded-full object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-3xl">
                                {displayName ? displayName[0] : "?"}
                            </div>
                        )}
                        <div>
                            {/* Email is now only in details, not as header */}
                            <p className="text-zinc-400">{profile.email}</p>
                            <p className="text-zinc-400">{profile.country}</p>
                            <p className="text-zinc-400">Joined: {joinedOn}</p>
                            <p className="text-zinc-400">Account: {profile.account_type}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <button
                            className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors text-sm font-medium"
                            onClick={() => router.push("/profile/edit")}
                        >
                            <FaEdit /> Edit Profile
                        </button>
                        <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>
                </div>
                {/* 2. Bio */}
                {profile.bio && (
                    <div className="bg-zinc-800 rounded-lg p-4">
                        <p>{profile.bio}</p>
                    </div>
                )}
                {/* 3. Usage & Activity */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-zinc-800 rounded-lg p-4">
                        <p className="font-semibold">Graphs Created</p>
                        <p className="text-2xl">{graphs.length}</p>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4">
                        <p className="font-semibold">Last Active</p>
                        <p>{lastActive}</p>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4 col-span-2">
                        <p className="font-semibold mb-2">Recent Graphs</p>
                        <ul className="flex gap-4">
                            {graphs.slice(0, 5).map((g) => (
                                <li key={g.id} className="bg-zinc-700 rounded p-2 min-w-[100px]">
                                    <div className="font-medium truncate">{g.title || "Untitled"}</div>
                                    {/* Thumbnail placeholder */}
                                    <div className="w-full h-12 bg-zinc-600 rounded mt-2 flex items-center justify-center text-xs text-zinc-300">Thumbnail</div>
                                </li>
                            ))}
                            {graphs.length === 0 && <li className="text-zinc-400">No graphs yet.</li>}
                        </ul>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4 col-span-2">
                        <p className="font-semibold">Storage Used</p>
                        <p>{(storageUsage / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
                {/* 4. Subscription & Billing (mock) */}
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="font-semibold">Plan Details</p>
                    <p>Pro: expires 2025-12-01</p>
                    <p>Next Billing: 2024-12-01</p>
                    <p>Usage Limits: 100 graphs, 10 collaborators</p>
                </div>
                {/* 5. Social & Collaboration */}
                <div className="bg-zinc-800 rounded-lg p-4 flex flex-col gap-4">
                    <p className="font-semibold">Social Links</p>
                    <div className="flex gap-4">
                        {profile.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="underline">Twitter</a>}
                        {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="underline">LinkedIn</a>}
                        {profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a>}
                    </div>
                    <p className="mt-2">Public Profile: <Link href={publicProfileUrl} className="underline">{publicProfileUrl}</Link></p>
                    <p className="font-semibold mt-4 mb-2">Previous Collaborators</p>
                    <div className="flex gap-4 flex-wrap">
                        {mockCollaborators.map((collab, idx) => (
                            <div key={idx} className="bg-zinc-900 rounded-xl p-4 flex flex-col items-center w-48 shadow border border-zinc-700">
                                <Image src={collab.avatar} alt={collab.name} width={56} height={56} className="rounded-full object-cover mb-2" />
                                <div className="font-semibold text-white text-center">{collab.name}</div>
                                <div className="text-xs text-zinc-400 text-center mb-1">{collab.email}</div>
                                <div className="text-sm text-zinc-300 text-center">{collab.bio}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 