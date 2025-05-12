import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ContinueButton from "./ContinueButton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
    { src: "/images/grok.png", alt: "Grok", desc: "Grok is xAI's real-time generative AI model built to integrate with the X platform, delivering concise answers, coding assistance, and conversation directly in your social feed", link: "https://x.ai/grok" },
    { src: "/images/deepseek.png", alt: "Deepseek", desc: "Deepseek is a deep-learning–driven search engine designed to understand user intent and surface the most relevant documents or multimedia across disparate data sources", link: "https://www.deepseek.com/" },
    { src: "/images/gpt.png", alt: "GPT", desc: "OpenAI's flagship series of large language models that use a transformer architecture to generate coherent, context-aware text across a wide range of tasks", link: "https://openai.com/gpt-4" },
    { src: "/images/gemini.png", alt: "Gemini", desc: "Gemini is Google DeepMind's next-generation multimodal AI family, capable of processing and generating text, images, audio, and code.", link: "https://deepmind.google/technologies/gemini/" },
];

const AUTO_SLIDE_INTERVAL = 4000;

export default function Carousel() {
    const [active, setActive] = useState(0);
    const [animating, setAnimating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            handleNext();
        }, AUTO_SLIDE_INTERVAL);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [active]);

    const handlePrev = () => {
        setAnimating(true);
        setTimeout(() => {
            setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            setAnimating(false);
        }, 300);
    };

    const handleNext = () => {
        setAnimating(true);
        setTimeout(() => {
            setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            setAnimating(false);
        }, 300);
    };

    const handleSelect = (idx: number) => {
        if (idx !== active) {
            setAnimating(true);
            setTimeout(() => {
                setActive(idx);
                setAnimating(false);
            }, 300);
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
            {/* Main Image */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"}`}>
                <Image
                    src={images[active].src}
                    alt={images[active].alt}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
                {/* Overlay for text and controls */}
                <div className="absolute left-0 top-0 h-full flex items-center z-5">
                    <div className="flex flex-row items-center gap-6 bg-black bg-opacity-40 px-6 py-4 rounded-xl" style={{ transform: 'scale(0.75)', transformOrigin: 'left center' }}>
                        {/* Prev Button */}
                        <button
                            onClick={handlePrev}
                            className="bg-white text-black w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-lg transition border border-zinc-300 hover:bg-zinc-100"
                            aria-label="Previous"
                        >
                            <FaChevronLeft size={21} />
                        </button>
                        {/* Text Content */}
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-4xl font-extrabold text-white mb-3 drop-shadow-lg">{images[active].alt.toUpperCase()}</h3>
                            <p className="text-white text-base max-w-md mb-3 drop-shadow-lg">
                                {images[active].desc}
                            </p>
                            <a href={images[active].link} target="_blank" rel="noopener noreferrer" className="w-36">
                                <ContinueButton>Learn More</ContinueButton>
                            </a>
                        </div>
                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="bg-white text-black w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-lg transition border border-zinc-300 hover:bg-zinc-100"
                            aria-label="Next"
                        >
                            <FaChevronRight size={21} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Thumbnails */}
            <div className="absolute right-16 bottom-12 flex gap-6 z-20">
                {images.map((img, idx) => (
                    <button
                        key={img.src}
                        onClick={() => handleSelect(idx)}
                        className={`rounded-xl overflow-hidden border-4 transition-all duration-300 ${active === idx ? "border-green-500 scale-110 shadow-2xl" : "border-transparent opacity-70 hover:opacity-100"}`}
                        style={{ width: 120, height: 120 }}
                        aria-label={`Show ${img.alt}`}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            className="object-cover w-full h-full"
                            width={120}
                            height={120}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
} 