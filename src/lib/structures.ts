import { Binary, Code2, GitBranch, Layers, type LucideIcon } from "lucide-react";

export type AccentName = "cyan" | "violet" | "emerald" | "amber";

export interface StructureMeta {
  slug: "" | "stack" | "queue" | "tree" | "graph";
  name: string;
  tagline: string;
  blurb: string;
  icon: LucideIcon;
  accent: AccentName;
  /** hex color used inside SVG canvases */
  hex: string;
  /** tailwind arbitrary oklch color for classes like text-[var(--s-cyan)] */
  oklch: string;
  access: string;
  search: string;
  insert: string;
  delete: string;
  space: string;
  methods: string;
  demo: string[];
}

export const ACCENTS: Record<
  AccentName,
  { text: string; ring: string; bg: string; border: string; glow: string; dot: string }
> = {
  cyan: {
    text: "text-cyan-300",
    ring: "ring-cyan-400/40",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
    glow: "shadow-[0_0_28px_-6px_rgb(34_211_238/0.45)]",
    dot: "bg-cyan-400",
  },
  violet: {
    text: "text-violet-300",
    ring: "ring-violet-400/40",
    bg: "bg-violet-400/10",
    border: "border-violet-400/30",
    glow: "shadow-[0_0_28px_-6px_rgb(167_139_250/0.45)]",
    dot: "bg-violet-400",
  },
  emerald: {
    text: "text-emerald-300",
    ring: "ring-emerald-400/40",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    glow: "shadow-[0_0_28px_-6px_rgb(52_211_153/0.45)]",
    dot: "bg-emerald-400",
  },
  amber: {
    text: "text-amber-300",
    ring: "ring-amber-400/40",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    glow: "shadow-[0_0_28px_-6px_rgb(251_191_36/0.45)]",
    dot: "bg-amber-400",
  },
};

export const STRUCTURES: StructureMeta[] = [
  {
    slug: "stack",
    name: "Stack",
    tagline: "Last in, first out",
    blurb:
      "Elements pile on top of each other. You can only add and remove from the top — think plates, browser history, or the undo command.",
    icon: Layers,
    accent: "cyan",
    hex: "#22d3ee",
    oklch: "oklch(0.8 0.13 210)",
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)",
    delete: "O(1)",
    space: "O(n)",
    methods: "push · pop · peek · isEmpty",
    demo: [
      "undo history in every editor",
      "the call stack running your code",
      "back button across visited pages",
    ],
  },
  {
    slug: "queue",
    name: "Queue",
    tagline: "First in, first out",
    blurb:
      "Elements join at the rear and leave from the front. Perfect whenever order of arrival matters — support tickets, print jobs, task schedulers.",
    icon: Code2,
    accent: "violet",
    hex: "#a78bfa",
    oklch: "oklch(0.72 0.16 300)",
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)",
    delete: "O(1)",
    space: "O(n)",
    methods: "enqueue · dequeue · front · isEmpty",
    demo: [
      "BFS frontier when exploring a graph",
      "print jobs spooling to a printer",
      "customer support tickets in order",
    ],
  },
  {
    slug: "tree",
    name: "Tree",
    tagline: "Hierarchical by design",
    blurb:
      "One root, branches below, leaves at the edges. A binary search tree keeps values ordered so lookups halve the search space at every step.",
    icon: Binary,
    accent: "emerald",
    hex: "#34d399",
    oklch: "oklch(0.78 0.15 163)",
    access: "O(log n)",
    search: "O(log n)",
    insert: "O(log n)",
    delete: "O(log n)",
    space: "O(n)",
    methods: "insert · search · traverse · min/max",
    demo: [
      "the DOM above this very page",
      "autocomplete tries as you type",
      "database indexes finding rows fast",
    ],
  },
  {
    slug: "graph",
    name: "Graph",
    tagline: "Anything can connect",
    blurb:
      "A web of nodes joined by edges — the most general structure of the four. Roads, friendships, dependencies and the internet are all graphs.",
    icon: GitBranch,
    accent: "amber",
    hex: "#fbbf24",
    oklch: "oklch(0.83 0.13 85)",
    access: "O(1)*",
    search: "O(V + E)",
    insert: "O(1)",
    delete: "O(E)",
    space: "O(V + E)",
    methods: "addNode · addEdge · bfs · dfs",
    demo: [
      "social networks mapping friendships",
      "GPS finding the fastest route",
      "npm resolving package dependencies",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Code snippets — shown in the CodeBlock on every topic page          */
/* ------------------------------------------------------------------ */

export const STACK_CODE_JS = `class Stack {
  #items = [];

  push(value) {
    this.#items.push(value);   // O(1) — add to the top
  }

  pop() {
    return this.#items.pop();  // O(1) — remove from the top
  }

  peek() {
    return this.#items.at(-1); // O(1) — look, don't remove
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  get size() {
    return this.#items.length;
  }
}`;

export const STACK_CODE_PY = `class Stack:
    def __init__(self):
        self._items = []

    def push(self, value):
        self._items.append(value)     # O(1)

    def pop(self):
        return self._items.pop()      # O(1)

    def peek(self):
        return self._items[-1]        # O(1)

    def is_empty(self):
        return len(self._items) == 0`;

export const QUEUE_CODE_JS = `class Queue {
  #items = [];
  #head = 0;

  enqueue(value) {
    this.#items.push(value);       // O(1) — join at the rear
  }

  dequeue() {
    const value = this.#items[this.#head];
    if (value === undefined) return undefined;
    this.#items[this.#head] = undefined;
    this.#head++;                  // O(1) — leave from the front
    return value;
  }

  front() {
    return this.#items[this.#head];
  }

  isEmpty() {
    return this.size === 0;
  }

  get size() {
    return this.#items.length - this.#head;
  }
}`;

export const QUEUE_CODE_PY = `from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, value):
        self._items.append(value)     # O(1)

    def dequeue(self):
        return self._items.popleft()  # O(1)

    def front(self):
        return self._items[0]

    def is_empty(self):
        return len(self._items) == 0`;

export const TREE_CODE_JS = `class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  root = null;

  insert(value) {              // O(log n) on a balanced tree
    const node = new Node(value);
    if (!this.root) return (this.root = node);
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) return (current.left = node);
        current = current.left;
      } else {
        if (!current.right) return (current.right = node);
        current = current.right;
      }
    }
  }

  *inorder(node = this.root) { // yields values in sorted order
    if (!node) return;
    yield* this.inorder(node.left);
    yield node.value;
    yield* this.inorder(node.right);
  }
}`;

export const TREE_CODE_PY = `class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):          # O(log n)
        if not self.root:
            self.root = Node(value)
            return
        node, current = Node(value), self.root
        while True:
            if value < current.value:
                if not current.left:
                    current.left = node
                    return
                current = current.left
            else:
                if not current.right:
                    current.right = node
                    return
                current = current.right

    def inorder(self, node):          # sorted order
        if node:
            yield from self.inorder(node.left)
            yield node.value
            yield from self.inorder(node.right)`;

export const GRAPH_CODE_JS = `class Graph {
  // adjacency list: Map<string, Set<string>>
  #adj = new Map();

  addNode(name) {
    if (!this.#adj.has(name)) this.#adj.set(name, new Set());
  }

  addEdge(a, b) {              // undirected — O(1)
    this.addNode(a);
    this.addNode(b);
    this.#adj.get(a).add(b);
    this.#adj.get(b).add(a);
  }

  neighbors(node) {
    return this.#adj.get(node) ?? [];
  }

  bfs(start) {                 // O(V + E) — explore level by level
    const visited = new Set([start]);
    const queue = [start];
    const order = [];
    while (queue.length) {
      const node = queue.shift();
      order.push(node);
      for (const n of this.neighbors(node)) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }
    return order;
  }
}`;

export const GRAPH_CODE_PY = `from collections import deque

class Graph:
    def __init__(self):
        self.adj = {}                 # adjacency list

    def add_node(self, name):
        self.adj.setdefault(name, set())

    def add_edge(self, a, b):         # O(1), undirected
        self.adj.setdefault(a, set()).add(b)
        self.adj.setdefault(b, set()).add(a)

    def bfs(self, start):             # O(V + E)
        visited, order = {start}, []
        queue = deque([start])
        while queue:
            node = queue.popleft()
            order.append(node)
            for n in self.adj.get(node, ()):
                if n not in visited:
                    visited.add(n)
                    queue.append(n)
        return order`;
