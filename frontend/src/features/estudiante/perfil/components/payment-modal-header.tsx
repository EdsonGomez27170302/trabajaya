"use client";

export function PaymentModalHeader({
  amount,
  processing,
  onClose,
}: {
  amount: number;
  processing: boolean;
  onClose: () => void;
}) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Pago seguro</p>
        <h2 className="mt-1 text-xl font-black text-foreground">Destacar mi perfil</h2>
        <p className="text-sm text-muted-foreground">S/ {amount.toFixed(2)} · pago único</p>
      </div>
      <button
        onClick={onClose}
        disabled={processing}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-40"
      >
        ✕
      </button>
    </div>
  );
}
