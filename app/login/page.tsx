"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { useGlobal } from "../context/GlobalContext";
import { API_ENDPOINTS } from "../lib/api";

const inputStyle: React.CSSProperties = {
    padding: "var(--spacing-3) var(--spacing-4)",
    borderRadius: "var(--radius-element)",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-background-body)",
    color: "var(--color-text-primary)",
    fontFamily: "inherit",
    fontSize: "inherit",
    width: "100%",
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { setUser, syncCart } = useGlobal();

    const isValid = useMemo(
        () => email.trim().length > 0 && password.length >= 6,
        [email, password],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isLoading) return;
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(API_ENDPOINTS.login, {
                method: "POST",
                headers: { "content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Could not sign you in.");
            }
            const data = await response.json();
            setUser({ username: data.user.name });
            await syncCart();
            router.push("/shop");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign-in failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                    minHeight: "92vh",
                }}
            >
                {/* IMAGE SIDE */}
                <div
                    style={{
                        position: "relative",
                        minHeight: 480,
                        backgroundColor: "var(--color-background-surface)",
                    }}
                >
                    <Image
                        src="/uploads/images/19-893-658-54-692-913.jpeg"
                        alt=""
                        fill
                        priority
                        sizes="50vw"
                        style={{
                            objectFit: "cover",
                            opacity: 0.6,
                            filter: "grayscale(30%)",
                        }}
                    />
                    <VStack
                        gap={4}
                        padding={10}
                        justify="end"
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                        }}
                    >
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                            }}
                        >
                            SpiderSense
                        </Text>
                        <Heading
                            level={2}
                            type="display-2"
                            textWrap="balance"
                            style={{ maxWidth: "22ch" }}
                        >
                            Welcome back to the quiet shelf.
                        </Heading>
                    </VStack>
                </div>

                {/* FORM SIDE */}
                <VStack
                    gap={6}
                    padding={10}
                    justify="center"
                    style={{ maxWidth: 440, marginInline: "auto", width: "100%" }}
                >
                    <VStack gap={2}>
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                            }}
                        >
                            Sign in
                        </Text>
                        <Heading level={1} type="display-3">
                            Hello again.
                        </Heading>
                        <Text type="body" color="secondary">
                            No account yet?{" "}
                            <Link
                                href="/register"
                                style={{
                                    color: "var(--color-text-primary)",
                                    textDecoration: "underline",
                                }}
                            >
                                Create one
                            </Link>
                            .
                        </Text>
                    </VStack>

                    <form onSubmit={handleSubmit}>
                        <VStack gap={4}>
                            <VStack gap={1}>
                                <Text type="supporting" color="secondary">
                                    Email
                                </Text>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    style={inputStyle}
                                />
                            </VStack>
                            <VStack gap={1}>
                                <Text type="supporting" color="secondary">
                                    Password
                                </Text>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    minLength={6}
                                    style={inputStyle}
                                />
                            </VStack>
                            {error && (
                                <Text type="supporting" color="accent">
                                    {error}
                                </Text>
                            )}
                            <Button
                                label={isLoading ? "Signing in…" : "Sign in"}
                                variant="primary"
                                size="lg"
                                type="submit"
                                isLoading={isLoading}
                                isDisabled={!isValid}
                            />
                            <HStack justify="center">
                                <Link
                                    href="#"
                                    style={{
                                        color: "var(--color-text-secondary)",
                                        fontSize: "var(--font-size-sm)",
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            </HStack>
                        </VStack>
                    </form>
                </VStack>
            </div>
        </main>
    );
}
