import { createContext, useContext, useState } from "react";

    interface CartItem {
        id: number;
        Name: string;
        Description: string;
        Price: string;
        Image: string;
        Available: boolean;
        Category: number;
        Ingredient: number[];
        quantity: number;
    }

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined> (undefined);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                cartItem => cartItem.id === item.id
            );

            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + 1
                        }
                        : cartItem
                );
            }

            return [
                ...prevCart,
                {
                    ...item,
                    quantity: 1
                }
            ];
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart =>
            prevCart.filter(item => item.id !== id)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}


export function useCart() {
    
    const context = useContext(CartContext);

    if(!context){
        throw new Error("useCart must be used inside CartProvider");
    }
    
    return context;
}