"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Section } from "@astryxdesign/core/Section";
import { useGlobal } from "../context/GlobalContext";

export default function CartPage() {
    const { cart, removeFromCart, addToCart, clearCart, cartTotal, user } =
        useGlobal();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleCheckout = () => {
        if (!user) {
            router.push("/login");
            return;
        }
        setIsCheckingOut(true);
        setTimeout(() => {
            setIsCheckingOut(false);
            setIsSuccess(true);
            clearCart();
        }, 1500);
    };

    if (isSuccess) {
        return (
            <Section variant="transparent" padding={10}>
                <VStack
                    gap={5}
                    hAlign="center"
                    padding={10}
                    style={{
                        maxWidth: 560,
                        marginInline: "auto",
                        textAlign: "center",
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
                        Order confirmed
                    </Text>
                    <Heading level={1} type="display-2" textWrap="balance">
                        Thank you. Your order is on its way.
                    </Heading>
                    <Text type="body" color="secondary" justify="center">
                        We've sent a confirmation to your email with tracking
                        details. Allow 3–5 business days.
                    </Text>
                    <Button
                        label="Continue shopping"
                        variant="primary"
                        href="/shop"
                    />
                </VStack>
            </Section>
        );
    }

    if (cart.length === 0) {
        return (
            <Section variant="transparent" padding={10}>
                <VStack
                    gap={5}
                    hAlign="center"
                    padding={10}
                    style={{
                        maxWidth: 560,
                        marginInline: "auto",
                        textAlign: "center",
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
                        Your bag
                    </Text>
                    <Heading level={1} type="display-2">
                        It's empty in here.
                    </Heading>
                    <Text type="body" color="secondary" justify="center">
                        Nothing saved yet. Browse the edit and come back.
                    </Text>
                    <Button
                        label="Browse the shop"
                        variant="primary"
                        href="/shop"
                    />
                </VStack>
            </Section>
        );
    }

    return (
        <main>
            <Section variant="transparent" padding={10}>
                <VStack
                    gap={2}
                    style={{ maxWidth: 1200, marginInline: "auto" }}
                >
                    <Text
                        type="supporting"
                        color="secondary"
                        style={{
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                        }}
                    >
                        Your bag · {cart.length} item
                        {cart.length === 1 ? "" : "s"}
                    </Text>
                    <Heading level={1} type="display-2">
                        Review your order.
                    </Heading>
                </VStack>
            </Section>

            <Section variant="transparent" padding={0}>
                <div
                    style={{
                        maxWidth: 1200,
                        marginInline: "auto",
                        paddingInline: "var(--spacing-6)",
                        paddingBottom: "var(--spacing-10)",
                        display: "grid",
                        gridTemplateColumns:
                            "minmax(0, 2fr) minmax(280px, 1fr)",
                        gap: "var(--spacing-8)",
                    }}
                >
                    <VStack gap={4}>
                        {cart.map((item) => (
                            <HStack
                                key={item.id}
                                gap={4}
                                padding={4}
                                style={{
                                    borderRadius: "var(--radius-container)",
                                    border:
                                        "1px solid var(--color-border)",
                                    backgroundColor:
                                        "var(--color-background-surface)",
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        width: 120,
                                        height: 120,
                                        flexShrink: 0,
                                        borderRadius:
                                            "var(--radius-element)",
                                        overflow: "hidden",
                                        backgroundColor:
                                            "var(--color-background-body)",
                                    }}
                                >
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="120px"
                                            style={{ objectFit: "cover" }}
                                        />
                                    )}
                                </div>
                                <VStack
                                    gap={2}
                                    justify="between"
                                    style={{ flex: 1 }}
                                >
                                    <VStack gap={1}>
                                        <Link
                                            href={`/shop/${item.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            <Text type="label">
                                                {item.title}
                                            </Text>
                                        </Link>
                                        <Text
                                            type="supporting"
                                            color="secondary"
                                        >
                                            {item.categoryName}
                                        </Text>
                                        <Text type="supporting">
                                            Qty {item.quantity}
                                        </Text>
                                    </VStack>
                                    <HStack justify="between" vAlign="center">
                                        <Button
                                            label="Remove"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                        />
                                        <Text type="label">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        ))}
                    </VStack>

                    {/* ORDER SUMMARY */}
                    <VStack
                        gap={5}
                        padding={6}
                        style={{
                            position: "sticky",
                            top: "var(--spacing-6)",
                            alignSelf: "start",
                            borderRadius: "var(--radius-container)",
                            backgroundColor:
                                "var(--color-background-surface)",
                            border:
                                "1px solid var(--color-border)",
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
                            Summary
                        </Text>
                        <VStack gap={2}>
                            <HStack justify="between">
                                <Text type="body" color="secondary">
                                    Subtotal
                                </Text>
                                <Text type="body">${cartTotal.toFixed(2)}</Text>
                            </HStack>
                            <HStack justify="between">
                                <Text type="body" color="secondary">
                                    Shipping
                                </Text>
                                <Text type="body">
                                    {cartTotal > 200 ? "Free" : "$12.00"}
                                </Text>
                            </HStack>
                            <HStack justify="between">
                                <Text type="body" color="secondary">
                                    Tax (est.)
                                </Text>
                                <Text type="body">
                                    ${(cartTotal * 0.08).toFixed(2)}
                                </Text>
                            </HStack>
                        </VStack>
                        <div
                            style={{
                                height: 1,
                                backgroundColor:
                                    "var(--color-border)",
                            }}
                        />
                        <HStack justify="between" vAlign="center">
                            <Text type="label">Total</Text>
                            <Heading level={3} type="display-3">
                                $
                                {(
                                    cartTotal +
                                    (cartTotal > 200 ? 0 : 12) +
                                    cartTotal * 0.08
                                ).toFixed(2)}
                            </Heading>
                        </HStack>
                        <Button
                            label={
                                isCheckingOut
                                    ? "Processing…"
                                    : user
                                      ? "Checkout"
                                      : "Sign in to checkout"
                            }
                            variant="primary"
                            size="lg"
                            isLoading={isCheckingOut}
                            onClick={handleCheckout}
                        />
                        <Button
                            label="Clear bag"
                            variant="ghost"
                            size="sm"
                            onClick={clearCart}
                        />
                    </VStack>
                </div>
            </Section>
        </main>
    );
}
