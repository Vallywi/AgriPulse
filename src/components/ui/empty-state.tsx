import { Button } from "./button";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <Icon className="mb-4 h-10 w-10 text-gray-400" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-xs text-sm text-gray-500">{description}</p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref}>
            <Button size="lg">{actionLabel}</Button>
          </a>
        ) : (
          <Button size="lg" onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}
