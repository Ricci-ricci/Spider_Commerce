"use client";

import { Button } from "@astryxdesign/core/Button";
import { HStack } from "@astryxdesign/core/HStack";
import { useGlobal } from "@/app/context/GlobalContext";
import type { RealProduct } from "@/app/data/fetchProduct";

export default function AddToCartButton({ product }: { product: RealProduct }) {
    const { addToCart, isInCart, removeFromCart } = useGlobal();
    const inCart = isInCart(product.id);

    return (
        <HStack gap={3}>
            {inCart ? (
                <Button
                    label="Remove from cart"
                    variant="secondary"
                    size="lg"
                    onClick={() => removeFromCart(product.id)}
                />
            ) : (
                <Button
                    label="Add to cart"
                    variant="primary"
                    size="lg"
                    isDisabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                />
            )}
            <Button label="Save" variant="ghost" size="lg" />
        </HStack>
    );
}
