export function calculateWeightedScore(scores: Record<string, number>, schema: Array<{ key: string; weight: number }>): number {
  const weightedSum = schema.reduce((acc, item) => acc + (scores[item.key] ?? 0) * item.weight, 0);
  const totalWeight = schema.reduce((acc, item) => acc + item.weight, 0);
  if (totalWeight === 0) return 0;
  return Number((weightedSum / totalWeight).toFixed(2));
}
