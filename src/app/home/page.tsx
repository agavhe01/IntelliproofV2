"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";

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

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/signin";
    };

    return (
        <Navbar
            profile={profile}
            user={user}
            onSignOut={handleSignOut}
        />
    );
} 