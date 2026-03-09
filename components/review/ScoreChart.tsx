interface ScoreItem {
  label: string;
  score: number;
}

export function ScoreChart({ items }: { items: ScoreItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-body2">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold">{item.score.toFixed(1)}</span>
          </div>
          <progress
            max={5}
            value={item.score}
            className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent"
          />
        </div>
      ))}
    </div>
  );
}
