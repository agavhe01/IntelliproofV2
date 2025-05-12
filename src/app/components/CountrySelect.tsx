import React, { useState, useMemo } from "react";
import Image from "next/image";
import Input from "./Input";

export type Country = {
    name: string;
    code: string;
    flag: string;
};

type CountrySelectProps = {
    countries: Country[];
    value: string;
    onChange: (code: string) => void;
};

export default function CountrySelect({ countries, value, onChange }: CountrySelectProps) {
    const [search, setSearch] = useState("");
    const filteredCountries = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return countries;
        return countries.filter(
            c => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s)
        );
    }, [countries, search]);

    return (
        <div className="w-full flex flex-col gap-4">
            <Input
                type="text"
                placeholder="Search countries..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2 w-full bg-zinc-800 border border-zinc-700 focus:border-white"
            />
            <div className="overflow-y-auto max-h-[340px] custom-scrollbar rounded-lg bg-zinc-900 p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredCountries.length === 0 ? (
                        <div className="text-zinc-400 text-center col-span-full py-8">No countries found</div>
                    ) : (
                        filteredCountries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => onChange(country.code)}
                                className={`flex items-center gap-4 p-5 rounded-xl border-2 shadow transition-all w-full text-left focus:outline-none focus:ring-2 focus:ring-white
                                    ${value === country.code ? "border-white bg-zinc-800" : "border-zinc-700 bg-zinc-900 hover:border-white"}`}
                            >
                                <Image
                                    src={country.flag}
                                    alt={country.name + ' flag'}
                                    width={32}
                                    height={32}
                                    className="rounded"
                                />
                                <span className="text-white text-lg font-medium">{country.name}</span>
                                <span className="ml-auto text-zinc-400 text-sm font-mono">{country.code}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
// Add the following to your global CSS for custom-scrollbar:
// .custom-scrollbar::-webkit-scrollbar { width: 8px; background: #232326; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; } 