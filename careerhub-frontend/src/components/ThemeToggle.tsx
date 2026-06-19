"use client";

import { useEffect, useState } from "react";

//Implement Dark Mode Toggle
export function ThemeToggle(){
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true);
        //checks localstorage
        const stored = localStorage.getItem("theme");
        if(stored){
            const isDarkMode = stored === "dark";
            setIsDark(isDarkMode);
            document.documentElement.classList.toggle('dark', isDarkMode);
            return;
        }

        const prefersDark = window.matchMedia("(prefer-color-scheme: dark)").matches;
        setIsDark(prefersDark);
        document.documentElement.classList.toggle("dark", prefersDark);

    },[])

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle("dark", newIsDark);
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
    };

    if (!mounted) return null;

    return (
        <button
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
        {isDark ? "Light" : "Dark"}
        </button>
    );

}
