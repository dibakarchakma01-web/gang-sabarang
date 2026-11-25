import { useEffect } from 'react';
import { Minus, Phone, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatBDT } from '../../data/initialData';
import { useSiteData } from '../../context/SiteDataContext';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    contactInfo,
  } = useSiteData();

  const phone = contactInfo.phone || '+8801550050641';

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="absolute inset-y-0 right-0 max-w-md w-full flex pl-10">
        <div className="w-full bg-brand-ivory shadow-2xl flex flex-col border-l border-brand-primary/15">
          {/* Header */}
          <div className="px-6 py-5 border-b border-brand-primary/12 flex items-center justify-between bg-white/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="cart-drawer-title"
                  className="text-lg font-bold text-brand-primary"
                >
                  Your Food Cart
                </h2>
                <p className="text-xs text-brand-ink/70 tabular-nums">
                  {cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-ink/70 hover:bg-brand-primary/8 hover:text-brand-primary transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Cart Items Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/8 text-brand-primary mb-4">
                  <ShoppingBag className="h-8 w-8 opacity-60" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-brand-primary">
                  Your cart is currently empty
                </h3>
                <p className="mt-1 text-sm text-brand-ink/70 max-w-xs mx-auto">
                  Explore our authentic restaurant menu and co-locate delicious hill dishes or portions to your cart.
                </p>
                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Browse Menu
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-brand-primary/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-ink/60">
                    Selected Items
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-medium text-brand-accent hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {cartItems.map((ci) => (
                    <div
                      key={ci.cartItemId}
                      className="rounded-xl border border-brand-secondary/30 bg-white p-4 shadow-xs flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-brand-primary text-base">
                            {ci.menuItem.name}
                          </h4>
                          {ci.portion ? (
                            <span className="inline-block mt-0.5 rounded px-2 py-0.5 text-xs font-semibold bg-brand-primary/8 text-brand-primary">
                              Portion: {ci.portion}
                            </span>
                          ) : null}
                          <p className="mt-0.5 text-xs text-brand-ink/65 tabular-nums">
                            Unit Price: {formatBDT(ci.unitPrice)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(ci.cartItemId)}
                          aria-label={`Remove ${ci.menuItem.name} from cart`}
                          className="text-brand-ink/40 hover:text-brand-accent p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-brand-primary/8">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(ci.cartItemId, ci.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="inline-flex h-7 w-7 items-center justify-center rounded border border-brand-primary/20 bg-brand-ivory text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold tabular-nums text-brand-primary">
                            {ci.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(ci.cartItemId, ci.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="inline-flex h-7 w-7 items-center justify-center rounded border border-brand-primary/20 bg-brand-ivory text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-base font-bold tabular-nums text-brand-primary">
                          {formatBDT(ci.unitPrice * ci.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer & Call To Action */}
          {cartItems.length > 0 ? (
            <div className="border-t border-brand-primary/15 bg-white px-6 py-5 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-base font-bold text-brand-primary">
                <span>Subtotal</span>
                <span className="text-xl tabular-nums text-brand-primary">
                  {formatBDT(cartSubtotal)}
                </span>
              </div>

              {/* 50% Advance Note */}
              <div
                role="note"
                className="rounded-lg border border-brand-accent/40 bg-brand-accent/8 p-3.5 text-xs sm:text-sm text-brand-ink/85 leading-relaxed"
              >
                <span className="font-semibold text-brand-accent">Note:</span> 50% advance payment is required for online orders.
              </div>

              {/* Call Now Action (No Order Now button) */}
              <div>
                <a
                  href={`tel:${phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3.5 text-base font-bold text-brand-ivory shadow-md hover:bg-brand-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
                >
                  <Phone className="h-5 w-5 text-brand-secondary" aria-hidden="true" />
                  <span>Call Now ({phone})</span>
                </a>
                <p className="mt-2 text-center text-xs text-brand-ink/60">
                  Tap to call our restaurant team to confirm your order &amp; advance payment.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
