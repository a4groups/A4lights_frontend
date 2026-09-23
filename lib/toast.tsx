import React from "react";
import Link from "next/link";
import { toast, ToastOptions } from "react-toastify";
import { CheckCircle2, ShoppingBag } from "lucide-react";

interface ProductToastProps {
  name: string;
  image?: string;
  price?: number;
  quantity?: number;
}

export function notifyProductAdded(
  { name, image, price, quantity = 1 }: ProductToastProps,
  options?: ToastOptions
) {
  return toast.success(
    <div className="flex items-center gap-3.5 py-1">
      {image ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-black/40 border border-white/10">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gold/20 text-gold">
          <ShoppingBag size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <CheckCircle2 size={13} className="text-[#c5a880] shrink-0" />
          <span className="truncate">Added to Cart</span>
        </div>
        <p className="mt-0.5 truncate text-[13px] font-medium text-white/90">
          {name}
        </p>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="text-white/60">
            Qty: {quantity}
            {price ? ` • ₹${(price * quantity).toLocaleString("en-IN")}` : ""}
          </span>
          <Link
            href="/cart"
            className="font-semibold text-[#c5a880] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Cart →
          </Link>
        </div>
      </div>
    </div>,
    {
      autoClose: 3500,
      icon: false,
      ...options,
    }
  );
}

export { toast };
