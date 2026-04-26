import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";

export type NodeKind = "self" | "person" | "org";

export type GraphNodeData = {
  id: string;
  label: string;
  sub?: string;
  kind: NodeKind;
  image?: string; // avatar / logo
  size?: "sm" | "md" | "lg";
  accent?: string; // ring color
  shared?: number; // shared skills count
};

const SIZE: Record<NonNullable<GraphNodeData["size"]>, number> = {
  sm: 56,
  md: 72,
  lg: 96,
};

function GraphNodeView({ data }: NodeProps) {
  const d = data as unknown as GraphNodeData;
  const size = SIZE[d.size ?? "md"];
  const isSelf = d.kind === "self";
  const isOrg = d.kind === "org";
  const ring = d.accent ?? (isSelf ? "var(--color-coral)" : isOrg ? "var(--color-grape)" : "var(--color-sky)");
  return (
    <div className="relative flex flex-col items-center">
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div
        className={cn(
          "relative grid place-items-center overflow-hidden bg-white transition-transform hover:scale-110",
          isOrg ? "rounded-2xl" : "rounded-full",
        )}
        style={{
          width: size,
          height: size,
          border: `${isSelf ? 3 : 2}px solid ${ring}`,
          boxShadow: isSelf
            ? `0 0 0 6px color-mix(in oklab, ${ring} 18%, transparent), 0 8px 22px -8px oklch(0 0 0 / 22%)`
            : "0 4px 12px -4px oklch(0 0 0 / 18%)",
        }}
      >
        {d.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.image} alt={d.label} className="h-full w-full object-cover" />
        ) : (
          <span
            className="font-display text-base font-bold"
            style={{ color: ring }}
          >
            {d.label
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </span>
        )}
      </div>
      <div
        className="mt-1.5 max-w-[120px] truncate rounded-full bg-white/85 px-2 py-0.5 text-center text-[11px] font-semibold backdrop-blur-sm"
        style={{ color: "var(--color-ink)" }}
      >
        {d.label}
      </div>
      {d.sub && (
        <div className="-mt-0.5 max-w-[140px] truncate text-center text-[10px] text-muted-foreground">
          {d.sub}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
}

const nodeTypes = { custom: GraphNodeView };

export type GraphLayoutNode = GraphNodeData & {
  x: number;
  y: number;
};

export type GraphInput = {
  nodes: GraphLayoutNode[];
  edges: { source: string; target: string; weight?: number; dashed?: boolean }[];
};

/**
 * Dense graph laid out by the caller (x/y in CSS pixels relative to the viewport center).
 * The graph only renders the nodes provided — typically people + orgs — and connects
 * them densely via the edges array.
 */
export function NodeGraph({
  input,
  onSelect,
}: {
  input: GraphInput;
  onSelect?: (node: GraphNodeData) => void;
}) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = input.nodes.map((n) => ({
      id: n.id,
      type: "custom",
      position: { x: n.x - (SIZE[n.size ?? "md"] / 2), y: n.y - (SIZE[n.size ?? "md"] / 2) },
      data: n as unknown as Record<string, unknown>,
      draggable: true,
    }));

    const edges: Edge[] = input.edges.map((e, i) => ({
      id: `${e.source}-${e.target}-${i}`,
      source: e.source,
      target: e.target,
      type: "straight",
      animated: false,
      style: {
        stroke: "var(--color-edge)",
        strokeWidth: e.weight ?? 1,
        strokeDasharray: e.dashed ? "4 4" : undefined,
      },
    }));

    return { nodes, edges };
  }, [input]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      proOptions={{ hideAttribution: true }}
      nodesDraggable
      nodesConnectable={false}
      onNodeClick={(_, n) => onSelect?.(n.data as unknown as GraphNodeData)}
      style={{ background: "var(--color-cream)" }}
    >
      <Background color="oklch(0 0 0 / 5%)" gap={28} size={1} style={{ background: "transparent" }} />
    </ReactFlow>
  );
}

export function GraphLegend({
  items = [
    { color: "var(--color-coral)", label: "You" },
    { color: "var(--color-sky)", label: "People" },
    { color: "var(--color-grape)", label: "Organizations" },
  ],
}: {
  items?: { color: string; label: string }[];
} = {}) {
  return (
    <div
      className="absolute bottom-4 left-4 rounded-2xl border bg-white/95 p-3 shadow-md backdrop-blur"
      style={{ borderColor: "var(--color-border)" }}
    >
      <p className="eyebrow mb-1.5">Legend</p>
      <div className="flex flex-col gap-1.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-[12px]" style={{ color: "var(--color-ink)" }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Helper: distribute people on a noisy disk + place orgs as anchors between them. */
export function buildDenseLayout({
  selfNode,
  people,
  orgs,
  width = 900,
  height = 600,
}: {
  selfNode: Omit<GraphNodeData, "kind"> & { kind?: "self" };
  people: GraphNodeData[];
  orgs: GraphNodeData[];
  width?: number;
  height?: number;
}): { nodes: GraphLayoutNode[]; positions: Record<string, { x: number; y: number }> } {
  const positions: Record<string, { x: number; y: number }> = {};
  const cx = 0;
  const cy = 0;

  // Self at center
  positions[selfNode.id] = { x: cx, y: cy };

  // Orgs on an inner ring (4-7 anchors)
  const orgRadius = Math.min(width, height) * 0.22;
  orgs.forEach((o, i) => {
    const a = (i / orgs.length) * Math.PI * 2 - Math.PI / 2;
    positions[o.id] = { x: cx + Math.cos(a) * orgRadius, y: cy + Math.sin(a) * orgRadius };
  });

  // People on outer scattered ring with jitter to feel organic & dense
  const peopleRadius = Math.min(width, height) * 0.4;
  people.forEach((p, i) => {
    const a = (i / people.length) * Math.PI * 2 + 0.4;
    const r = peopleRadius * (0.78 + ((i * 73) % 50) / 100); // pseudo-random jitter
    const jitterX = (((i * 113) % 80) - 40);
    const jitterY = (((i * 197) % 80) - 40);
    positions[p.id] = { x: cx + Math.cos(a) * r + jitterX, y: cy + Math.sin(a) * r + jitterY };
  });

  const nodes: GraphLayoutNode[] = [
    { ...selfNode, kind: "self", size: "lg", x: positions[selfNode.id].x, y: positions[selfNode.id].y },
    ...orgs.map((o) => ({ ...o, size: o.size ?? "md", x: positions[o.id].x, y: positions[o.id].y })),
    ...people.map((p) => ({ ...p, size: p.size ?? "sm", x: positions[p.id].x, y: positions[p.id].y })),
  ];

  return { nodes, positions };
}

/** Quick toggle button styled like Uber pill */
export function ViewToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border p-1"
      style={{ borderColor: "var(--color-border)", background: "white" }}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="rounded-full px-4 py-1.5 text-[12px] font-semibold capitalize transition-colors"
            style={{
              background: active ? "var(--color-ink)" : "transparent",
              color: active ? "var(--color-background)" : "var(--color-graphite)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// Re-export legacy KIND_META shape for any callers that still need it (none expected).
export const KIND_META = {
  self: { color: "var(--color-coral)", label: "You" },
  person: { color: "var(--color-sky)", label: "Person" },
  org: { color: "var(--color-grape)", label: "Organization" },
} as const;

// Convenience hook to track selected node from outside
export function useNodeSelect() {
  return useState<GraphNodeData | null>(null);
}
