'use client'

import { useCart } from '@/context/CartContext'
import Header from './Header'
import CartSidebar from './CartSidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const {
    cart,
    user,
    isCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    setIsCartOpen,
    logout
  } = useCart()

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <Header
        user={user}
        totalItems={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onLogout={logout}
      />
      {children}
      <CartSidebar
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </>
  )
}
