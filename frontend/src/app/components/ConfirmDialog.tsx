"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink/70 px-3 py-4 backdrop-blur-sm sm:px-4">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-white p-4 shadow-2xl dark:bg-zinc-950 sm:p-5">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-copper px-4 py-2 text-sm font-semibold text-white transition hover:bg-copper/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
