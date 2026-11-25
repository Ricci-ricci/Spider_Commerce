"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
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

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isValid = useMemo(
        () =>
            name.trim().length > 0 &&
            email.trim().length > 0 &&
            password.length >= 6,
        [name, email, password],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isLoading) return;
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(API_ENDPOINTS.register, {
                method: "POST",
                headers: { "content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Could not register.");
            }
            router.push("/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign-up failed");
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
                <VStack
                    gap={6}
                    padding={10}
                    justify="center"
                    style={{
                        maxWidth: 440,
                        marginInline: "auto",
                        width: "100%",
                        order: 0,
                    }}
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
                            Create account
                        </Text>
                        <Heading level={1} type="display-3">
                            Start your archive.
                        </Heading>
                        <Text type="body" color="secondary">
                            Already with us?{" "}
                            <Link
                                href="/login"
                                style={{
                                    color: "var(--color-text-primary)",
                                    textDecoration: "underline",
                                }}
                            >
                                Sign in
                            </Link>
                            .
                        </Text>
                    </VStack>

                    <form onSubmit={handleSubmit}>
                        <VStack gap={4}>
                            <VStack gap={1}>
                                <Text type="supporting" color="secondary">
                                    Name
                                </Text>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    style={inputStyle}
                                />
                            </VStack>
                            <VStack gap={1}>
                                <Text type="supporting" color="secondary">
                                    Email
                                </Text>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
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
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    style={inputStyle}
                                />
                                <Text type="supporting" color="secondary">
                                    At least 6 characters.
                                </Text>
                            </VStack>
                            {error && (
                                <Text type="supporting" color="accent">
                                    {error}
                                </Text>
                            )}
                            <Button
                                label={isLoading ? "Creating…" : "Create account"}
                                variant="primary"
                                size="lg"
                                type="submit"
                                isLoading={isLoading}
                                isDisabled={!isValid}
                            />
                        </VStack>
                    </form>
                </VStack>

                <div
                    style={{
                        position: "relative",
                        minHeight: 480,
                        backgroundColor: "var(--color-background-surface)",
                    }}
                >
                    <Image
                        src="https://res.cloudinary.com/rz3s0vcd/image/upload/v1795454926/9-404-638-236-239-592.jpg"
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
                            Build the wardrobe you'll actually wear.
                        </Heading>
                    </VStack>
                </div>
            </div>
        </main>
    );
}
