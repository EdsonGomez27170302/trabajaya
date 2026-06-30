"use client";

export function RegisterFormFooter({
  serverError,
  isSubmitting,
  submitLabel,
  submittingLabel,
}: {
  serverError: string;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
}) {
  return (
    <>
      {serverError && (
        <div className="sm:col-span-2">
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="sm:col-span-2 mt-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </>
  );
}
