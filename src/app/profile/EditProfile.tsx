"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import { FaArrowLeft } from "react-icons/fa";
import ContinueButton from "../components/ContinueButton";

export default function EditProfile({ profile, onSave }: { profile: any, onSave?: () => void }) {
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const [linkedin, setLinkedin] = useState(profile?.linkedin_url || "");
    const [twitter, setTwitter] = useState(profile?.twitter_url || "");
    const [instagram, setInstagram] = useState(profile?.instagram_url || "");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBack = () => router.push('/home?tab=profile');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${profile.email.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from("intelliproofv2-imagebucket")
            .upload(filePath, file, { upsert: true });
        if (uploadError) {
            setError("Failed to upload image");
            setUploading(false);
            return;
        }
        const { data } = supabase.storage.from("intelliproofv2-imagebucket").getPublicUrl(filePath);
        setAvatarUrl(data.publicUrl);
        setUploading(false);
    };

    const handleSave = async () => {
        setError("");
        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                avatar_url: avatarUrl,
                bio,
                linkedin_url: linkedin,
                twitter_url: twitter,
                instagram_url: instagram,
            })
            .eq("email", profile.email);
        if (updateError) {
            setError(updateError.message);
            return;
        }
        router.push('/home?tab=profile');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-2xl bg-black rounded-2xl p-12 shadow-xl flex flex-col gap-6 relative border border-zinc-800">
                <button onClick={handleBack} className="absolute left-6 top-6 text-zinc-400 hover:text-white">
                    <FaArrowLeft size={22} />
                </button>
                <h1 className="text-white text-2xl font-bold mb-2 text-center">Who You Are</h1>
                <p className="text-zinc-400 text-sm mb-4 text-center">
                    Show the community what makes your profile unique. Add a photo, links, and a short bio.
                </p>
                <div className="flex gap-8 items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <label htmlFor="avatar-upload" className="w-32 h-32 rounded-xl bg-zinc-700 flex items-center justify-center cursor-pointer">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                            ) : (
                                <span className="text-5xl text-zinc-400">+</span>
                            )}
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </label>
                        <span className="text-xs text-zinc-400 mt-2">Add a clear photo</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <label className="text-zinc-300 text-sm font-medium">Bio</label>
                        <textarea
                            className="bg-black border border-zinc-800 rounded-lg p-3 text-white resize-none min-h-[80px]"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            maxLength={400}
                            placeholder="Write a short bio..."
                        />
                        <label className="text-zinc-300 text-sm font-medium mt-2">LinkedIn URL</label>
                        <input
                            className="bg-black border border-zinc-800 rounded-lg p-3 text-white"
                            value={linkedin}
                            onChange={e => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                        <label className="text-zinc-300 text-sm font-medium mt-2">Twitter URL</label>
                        <input
                            className="bg-black border border-zinc-800 rounded-lg p-3 text-white"
                            value={twitter}
                            onChange={e => setTwitter(e.target.value)}
                            placeholder="https://twitter.com/yourprofile"
                        />
                        <label className="text-zinc-300 text-sm font-medium mt-2">Instagram URL</label>
                        <input
                            className="bg-black border border-zinc-800 rounded-lg p-3 text-white"
                            value={instagram}
                            onChange={e => setInstagram(e.target.value)}
                            placeholder="https://instagram.com/yourprofile"
                        />
                    </div>
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <div className="mt-6">
                    <ContinueButton
                        onClick={handleSave}
                        loading={uploading}
                        disabled={uploading}
                    >
                        Save
                    </ContinueButton>
                </div>
            </div>
        </div>
    );
} 