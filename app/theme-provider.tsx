"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Theme } from "@astryxdesign/core/theme";
import { themes } from "../astryx-themes";

type Mode = "light" | "dark";

interface ThemeCtx {
    mode: Mode;
    toggle: () => void;
    setMode: (m: Mode) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

const STORAGE_KEY = "ss-theme-mode";

export function ThemeModeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mode, setMode] = useState<Mode>("dark");

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
            if (saved === "light" || saved === "dark") {
                setMode(saved);
            } else if (
                typeof window !== "undefined" &&
                window.matchMedia("(prefers-color-scheme: light)").matches
            ) {
                setMode("light");
            }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch {}
    }, [mode]);

    const value = useMemo<ThemeCtx>(
        () => ({
            mode,
            setMode,
            toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
        }),
        [mode],
    );

    const activeTheme =
        mode === "dark" ? themes.gothic : themes.neutral;

    return (
        <Ctx.Provider value={value}>
            <Theme theme={activeTheme} mode={mode}>
                {children}
            </Theme>
        </Ctx.Provider>
    );
}

export function useThemeMode() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useThemeMode must be used inside ThemeModeProvider");
    return v;
}
