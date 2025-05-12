"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import EditProfile from "../EditProfile";

interface Profile {
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    country?: string;
    bio?: string;
    created_at?: string;
    last_login?: string;
    account_type?: string;
    twitter_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
    github_url?: string;
}

export default function EditProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/signin");
                return;
            }
            const emailToQuery = user.email ? user.email.trim().toLowerCase() : "";
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("email", emailToQuery)
                .single();
            setProfile(profileData);
            setLoading(false);
        }
        fetchProfile();
    }, [router]);

    if (loading) return <div className="text-white p-8">Loading...</div>;
    if (!profile) return <div className="text-white p-8">No profile found.</div>;

    return <EditProfile profile={profile} />;
} 