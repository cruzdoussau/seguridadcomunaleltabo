import type { Incident } from "@/types";

export function countBy<T extends string>(items: Incident[], selector: (item: Incident) => T) {
  return items.reduce<Record<T, number>>((acc, item) => {
    const key = selector(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

export function topCategories(items: Incident[], type: Incident["tipo"], limit = 4) {
  return Object.entries(countBy(items.filter((item) => item.tipo === type), (item) => item.categoria))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

export function categoryChartData(items: Incident[]) {
  return Object.entries(countBy(items, (item) => item.tipo)).map(([name, value]) => ({ name, value }));
}
