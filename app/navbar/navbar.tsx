"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Badge } from "@astryxdesign/core/Badge";
import {
    ShoppingBag,
    User as UserIcon,
    Menu as MenuIcon,
    X,
    Sun,
    Moon,
} from "lucide-react";
import { useGlobal } from "../context/GlobalContext";
import { useThemeMode } from "../theme-provider";

const MENU = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "Contact", link: "/contact" },
];

const SHOP_CATEGORIES = [
    { name: "Running", href: "/shop?category=Running" },
    { name: "Lifestyle", href: "/shop?category=Lifestyle" },
    { name: "Training", href: "/shop?category=Training" },
    { name: "Basketball", href: "/shop?category=Basketball" },
    { name: "Outdoor", href: "/shop?category=Outdoor" },
];

const BREAKPOINT = 900;

const iconButton: React.CSSProperties = {
    all: "unset",
    cursor: "pointer",
    color: "var(--color-text-primary)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: "var(--radius-element)",
};

export default function Navbar() {
    const { cartCount, user, logout } = useGlobal();
    const { mode, toggle } = useThemeMode();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            {/* Scoped responsive rules */}
            <style>{`
                .nav-desktop { display: none; }
                .nav-burger  { display: inline-flex; }
                .nav-user-chip { display: none; }
                @media (min-width: ${BREAKPOINT}px) {
                    .nav-desktop { display: flex; }
                    .nav-burger  { display: none; }
                    .nav-user-chip { display: inline-flex; }
                }
                .nav-link {
                    position: relative;
                    text-decoration: none;
                    color: var(--color-text-primary);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    padding-block: 0.25rem;
                }
                .nav-link::after {
                    content: "";
                    position: absolute;
                    left: 0; right: 0; bottom: 0;
                    height: 1px;
                    background: currentColor;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 220ms ease;
                }
                .nav-link:hover::after { transform: scaleX(1); }
            `}</style>

            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 40,
                    backgroundColor:
                        "color-mix(in oklab, var(--color-background-body) 88%, transparent)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderBlockEnd: "1px solid var(--color-border)",
                }}
            >
                <HStack
                    justify="between"
                    vAlign="center"
                    gap={3}
                    paddingInline={5}
                    paddingBlock={3}
                    style={{
                        maxWidth: 1400,
                        marginInline: "auto",
                    }}
                >
                    {/* LEFT: brand + (desktop) links */}
                    <HStack gap={6} vAlign="center">
                        <button
                            className="nav-burger"
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={open}
                            style={iconButton}
                        >
                            <MenuIcon size={20} />
                        </button>
                        <Link
                            href="/"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <Text
                                type="label"
                                style={{
                                    letterSpacing: "0.22em",
                                    textTransform: "uppercase",
                                    fontWeight: 700,
                                }}
                            >
                                SpiderSense
                            </Text>
                        </Link>
                        <nav
                            className="nav-desktop"
                            style={{
                                display: "none",
                                alignItems: "center",
                                gap: "var(--spacing-5)",
                                marginInlineStart: "var(--spacing-4)",
                            }}
                        >
                            {MENU.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.link}
                                    className="nav-link"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </HStack>

                    {/* RIGHT: actions */}
                    <HStack gap={1} vAlign="center">
                        <button
                            onClick={toggle}
                            aria-label={
                                mode === "dark"
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            style={iconButton}
                        >
                            {mode === "dark" ? (
                                <Sun size={18} />
                            ) : (
                                <Moon size={18} />
                            )}
                        </button>
                        <Link
                            href="/cart"
                            aria-label="Cart"
                            style={{
                                ...iconButton,
                                position: "relative",
                            }}
                        >
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                    }}
                                >
                                    <Badge
                                        label={String(cartCount)}
                                        variant="info"
                                    />
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <>
                                <span
                                    className="nav-user-chip"
                                    style={{
                                        marginInlineStart: "var(--spacing-2)",
                                        marginInlineEnd: "var(--spacing-1)",
                                    }}
                                >
                                    <Text type="supporting" color="secondary">
                                        {user.username}
                                    </Text>
                                </span>
                                <Button
                                    label="Sign out"
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                />
                            </>
                        ) : (
                            <Button
                                label="Sign in"
                                variant="ghost"
                                size="sm"
                                href="/login"
                                icon={<UserIcon size={16} />}
                            />
                        )}
                    </HStack>
                </HStack>
            </header>

            {/* MOBILE DRAWER */}
            <div
                aria-hidden={!open}
                onClick={() => setOpen(false)}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 50,
                    backgroundColor: open ? "rgba(0,0,0,0.5)" : "transparent",
                    pointerEvents: open ? "auto" : "none",
                    transition: "background-color 240ms ease",
                }}
            />
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Main menu"
                style={{
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    insetInlineStart: 0,
                    width: "min(380px, 92vw)",
                    zIndex: 60,
                    backgroundColor: "var(--color-background-body)",
                    borderInlineEnd: "1px solid var(--color-border)",
                    transform: open
                        ? "translateX(0)"
                        : "translateX(-105%)",
                    transition:
                        "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                    overflowY: "auto",
                    boxShadow: open ? "var(--shadow-high)" : "none",
                }}
            >
                <VStack gap={6} padding={6}>
                    <HStack justify="between" vAlign="center">
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                            }}
                        >
                            Menu
                        </Text>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                            style={iconButton}
                        >
                            <X size={20} />
                        </button>
                    </HStack>

                    <VStack gap={2}>
                        {MENU.map((item) => (
                            <Link
                                key={item.name}
                                href={item.link}
                                onClick={() => setOpen(false)}
                                style={{
                                    textDecoration: "none",
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                <Heading
                                    level={3}
                                    type="display-3"
                                    style={{ lineHeight: 1.1 }}
                                >
                                    {item.name}
                                </Heading>
                            </Link>
                        ))}
                    </VStack>

                    <VStack gap={3}>
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                            }}
                        >
                            Categories
                        </Text>
                        <VStack gap={2}>
                            {SHOP_CATEGORIES.map((c) => (
                                <Link
                                    key={c.name}
                                    href={c.href}
                                    onClick={() => setOpen(false)}
                                    style={{
                                        textDecoration: "none",
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    <Text type="body">{c.name}</Text>
                                </Link>
                            ))}
                        </VStack>
                    </VStack>

                    <div
                        style={{
                            height: 1,
                            backgroundColor: "var(--color-border)",
                        }}
                    />

                    <VStack gap={3}>
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                            }}
                        >
                            Account
                        </Text>
                        {user ? (
                            <VStack gap={3}>
                                <HStack gap={2} vAlign="center">
                                    <UserIcon size={18} />
                                    <Text type="label">{user.username}</Text>
                                </HStack>
                                <Button
                                    label="Sign out"
                                    variant="secondary"
                                    onClick={() => {
                                        logout();
                                        setOpen(false);
                                    }}
                                />
                            </VStack>
                        ) : (
                            <HStack gap={2} wrap="wrap">
                                <Button
                                    label="Sign in"
                                    variant="primary"
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                />
                                <Button
                                    label="Create account"
                                    variant="ghost"
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                />
                            </HStack>
                        )}
                    </VStack>
                </VStack>
            </aside>
        </>
    );
}
