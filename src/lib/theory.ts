export interface TheoryBlock {
  title: string;
  intro: string;
  /** "term — explanation" bullets */
  points: string[];
}

export interface TheoryPageContent {
  title: string;
  blurb: string;
  blocks: TheoryBlock[];
}

/* ------------------------------------------------------------------ */
/* Unit: Stack & Queue                                                 */
/* ------------------------------------------------------------------ */

export const STACK_THEORY: TheoryPageContent = {
  title: "Theory — the Stack & Queue unit",
  blurb: "Definitions, array programming in C, notation compilation, recursion and every exam topic in order.",
  blocks: [
    {
      title: "Stack — definition & concepts",
      intro:
        "A stack is a linear structure where insertion and deletion happen at one end only, called the top. The last element pushed is the first popped — LIFO (Last In, First Out).",
      points: [
        "top — index/pointer of the most recent element; all action happens here",
        "push(x) — place x on top; overflow when top == max-1 on a fixed array",
        "pop() — remove and return the top; underflow when the stack is empty",
        "peek / top() — read the top without removing it",
        "isEmpty / isFull — O(1) guards used before every pop/push in C",
        "Underflow vs overflow — operating on an empty vs a full stack; both are error conditions to check in code",
      ],
    },
    {
      title: "Programming a stack with an array (C)",
      intro:
        "In C a stack is declared as a fixed array plus an integer top initialised to -1. Push increments top then writes; pop reads then decrements — the order of those two steps is the classic exam trap.",
      points: [
        "int stack[MAX]; int top = -1; — the entire state of the stack",
        "push: if (top == MAX-1) overflow; else stack[++top] = x",
        "pop: if (top == -1) underflow; else return stack[top--]",
        "peek: return stack[top] (valid only when top != -1)",
        "Every operation is O(1) — no shifting, ever — but capacity is fixed at compile time",
      ],
    },
    {
      title: "Infix, prefix (Polish) & postfix (Reverse Polish) notations",
      intro:
        "Infix writes operators between operands (A+B) and needs brackets plus precedence rules. Prefix puts the operator before its operands (+AB), postfix after (AB+). Compilers convert infix to one of these because postfix/prefix need no brackets and can be evaluated in a single left-to-right scan using a stack.",
      points: [
        "A+B*C → postfix ABC*+ (the * binds first, so no brackets are needed)",
        "(A+B)*C → postfix AB+C* (the bracket changes the order)",
        "Conversion rule — operands go to output; operators wait on a stack, popping anything of higher-or-equal precedence first; '(' is pushed, ')' pops until '('",
        "^ (power) is right-associative — pop only strictly higher precedence before pushing it",
        "Evaluation — scan postfix left to right: operand → push; operator → pop two (second pop is the LEFT operand), apply, push result",
      ],
    },
    {
      title: "Recursion & the call stack",
      intro:
        "A recursive function solves a problem by calling itself on a smaller input until a base case stops the descent. Each active call gets its own frame of parameters and locals on the runtime call stack — which is literally a stack, so recursion can always be rewritten with an explicit one.",
      points: [
        "Base case — the smallest input answered directly; without it the stack overflows",
        "Recursive case — reduce toward the base case, combine the sub-results",
        "Every call pushes a frame; every return pops one — depth = nesting level",
        "Recursion is elegant for trees, divide-and-conquer and backtracking, but costs stack space (and repeated work unless memoised)",
        "Tail recursion can be converted to a loop; general recursion needs an explicit stack",
      ],
    },
    {
      title: "Tower of Hanoi",
      intro:
        "Move n disks from source to destination peg using one auxiliary peg, never placing a bigger disk on a smaller one. The recursive insight: move n-1 disks aside, move the largest, then move the n-1 stack onto it. Minimum moves = 2^n − 1 (31 for 5 disks, 1 billion billion for 64).",
      points: [
        "hanoi(n, from, to, via): hanoi(n-1, from, via, to); move disk n; hanoi(n-1, via, to, from)",
        "The recursion depth is n, and the call stack records every pending move — a perfect live view of a stack at work",
        "Disk k (counting the smallest as 1) moves on steps 2^(k-1), 2^k·1.5, ... — a fixed rhythm you can verify in the simulation",
        "It is the textbook proof that recursion can solve problems with no natural loop formulation",
      ],
    },
    {
      title: "Representation & operations of a queue",
      intro:
        "A queue is a linear structure with insertion at the rear and deletion from the front — FIFO (First In, First Out), the fairness rule of every waiting line.",
      points: [
        "front — index of the next element to leave; rear — index of the last element added",
        "enqueue(x) — add at rear; dequeue() — remove from front; both O(1) with the head-index trick",
        "Naive shifting dequeue is O(n) — the reason circular buffers exist",
        "front == -1 (or front > rear) means empty; the circular queue adds front == (rear+1) % MAX means full",
      ],
    },
    {
      title: "Programming a queue with an array (C)",
      intro:
        "A linear array queue declares int queue[MAX]; int front = -1, rear = -1; enqueue advances rear, dequeue advances front, and the empty test is front == -1 || front > rear.",
      points: [
        "enqueue: if (rear == MAX-1) full; else queue[++rear] = x (set front = 0 on the very first insert)",
        "dequeue: if (front == -1 || front > rear) empty; else x = queue[front++]",
        "Linear-array flaw — dequeued slots at the start are never reused, so the queue 'walks' off the end",
        "The circular queue fixes it: rear = (rear + 1) % MAX — see the simulation below",
      ],
    },
    {
      title: "Types of queue",
      intro:
        "Four variants cover every scheduling situation; they differ only in which ends accept insertions and deletions.",
      points: [
        "Simple (linear) queue — insert at rear, delete at front; the plain FIFO line",
        "Circular queue — the last slot wraps to the first, reusing freed cells; needs the full/empty trick (sacrifice one slot or keep a count)",
        "Double-ended queue (deque) — insert and delete at both ends; input-restricted and output-restricted deques are the exam sub-cases",
        "Priority queue — dequeue order is by priority, not arrival; usually built on a heap",
      ],
    },
    {
      title: "Applications of stack & queue",
      intro: "The two structures behind almost every system-level flow control.",
      points: [
        "Stack — expression conversion & evaluation, recursion/call stack, undo-redo, backtracking (mazes, N-queens), browser history, matching brackets, DFS",
        "Queue — CPU/round-robin & disk scheduling, printer spooling, BFS, buffers (keyboard, IO, streaming), call-centre and ticketing systems",
        "Deque — sliding-window maximum, work-stealing schedulers",
        "Priority queue — OS process scheduling, Dijkstra's algorithm, Huffman construction, event simulation",
      ],
    },
  ],
};

/** Stack page content: stack blocks from the unit + the shared applications block. */
export const STACK_PAGE_THEORY: TheoryPageContent = {
  title: STACK_THEORY.title,
  blurb:
    "Definition, array programming in C, expression notations, recursion and the applications examiners love.",
  blocks: [
    STACK_THEORY.blocks[0], // stack definition & concepts
    STACK_THEORY.blocks[1], // programming a stack with an array
    STACK_THEORY.blocks[2], // infix / prefix / postfix
    STACK_THEORY.blocks[3], // recursion & the call stack
    STACK_THEORY.blocks[4], // Tower of Hanoi
    STACK_THEORY.blocks[8], // applications of stack & queue
  ],
};

/** Queue page content: queue blocks from the unit + the shared applications block. */
export const QUEUE_PAGE_THEORY: TheoryPageContent = {
  title: STACK_THEORY.title,
  blurb:
    "Representation, array programming in C, the four queue variants and where queues run the world.",
  blocks: [
    STACK_THEORY.blocks[5], // representation & operations of a queue
    STACK_THEORY.blocks[6], // programming a queue with an array
    STACK_THEORY.blocks[7], // types of queue
    STACK_THEORY.blocks[8], // applications of stack & queue
  ],
};

/* ------------------------------------------------------------------ */
/* Unit: Linked List I + II                                            */
/* ------------------------------------------------------------------ */

export const LINKED_THEORY: TheoryPageContent = {
  title: "Theory — Linked List Part I & II",
  blurb: "Dynamic memory, struct in C, the three list flavours, linked stack/queue and where lists win in practice.",
  blocks: [
    {
      title: "Dynamic memory allocation",
      intro:
        "Arrays get their size at compile time and waste whatever they don't use. Dynamic allocation asks the heap for memory while the program runs, so structures grow and shrink with the data. In C that means the stdlib.h family malloc, calloc, realloc and free.",
      points: [
        "malloc(n) — allocate n bytes, contents uninitialised; returns NULL when the heap is exhausted",
        "calloc(k, size) — allocate k blocks, zero-initialised",
        "realloc(p, n) — grow or shrink an existing block (may move it)",
        "free(p) — return the block; forgetting it leaks memory, using it afterwards is a dangling pointer",
        "sizeof(Node) — always ask, never hardcode; the node below is 8 bytes on a 64-bit machine (4-byte int + padding + 8-byte pointer... alignment makes it 16)",
      ],
    },
    {
      title: "Structure in C & self-referential nodes",
      intro:
        "A struct bundles related fields into one type. A linked-list node is a self-referential structure: it contains a pointer to its own type, which is what lets nodes chain.",
      points: [
        "struct Node { int data; struct Node *next; }; — one value plus one link",
        "struct Node *p = (struct Node *) malloc(sizeof(struct Node)); — allocate a node at runtime",
        "p->data and p->next — arrow syntax dereferences the pointer and picks the field",
        "typedef struct Node Node; saves writing struct everywhere",
        "A node with data + prev + next is the doubly-linked version of the same idea",
      ],
    },
    {
      title: "Singly, doubly & circular linked lists",
      intro:
        "Three flavours, one idea — nodes linked by pointers instead of positions. The differences are how many links per node and whether the chain loops.",
      points: [
        "Singly — one next pointer per node; cheap (one pointer), but traversal is one-way",
        "Doubly — prev + next; walk in both directions and delete a node in O(1) given a pointer to it, at the cost of a second pointer per node",
        "Circular — the tail's next points back to the head (or the last node's prev to the first); there is no NULL end, so loops must stop when they return to the start node",
        "Circular doubly — the round-table list: from any node, both directions reach every other node",
        "Empty list — head == NULL; a one-node circular list points to itself",
      ],
    },
    {
      title: "Linked implementation of stack & queue",
      intro:
        "Replace the fixed array with nodes and overflow disappears — capacity is now the heap. Push/pop and enqueue/dequeue are rewired pointer moves; every operation stays O(1) by choosing which end of the list to touch.",
      points: [
        "Linked stack — push and pop at the head: top->next = newNode for push; old = top; top = top->next; free(old) for pop. Underflow = top == NULL",
        "Linked queue — keep head and tail pointers; enqueue at tail (tail->next = node), dequeue at head (head = head->next). The two-pointer design is what keeps both ends O(1)",
        "No shifting, no fixed MAX, no overflow — only malloc failure can refuse an insert",
        "Cost: one pointer of overhead per element and worse cache locality than an array",
        "In the circular queue simulation below the rear pointer's next is the head — exactly how a linked queue works",
      ],
    },
    {
      title: "Applications of linked lists",
      intro: "Wherever the data must grow, splice or be walked in both directions, lists beat arrays.",
      points: [
        "Dynamic memory management — the allocator's free lists are linked lists of free blocks",
        "Polynomial arithmetic — store (coefficient, exponent) pairs and add term-by-term",
        "Sparse matrices — one node per non-zero element, skipping the zeros",
        "Symbol tables, hash-map collision chains and adjacency lists in graphs",
        "Music playlists & image viewers (prev/next = doubly), round-robin scheduling (circular), undo chains and LRU caches",
        "Implementing stacks, queues and deques without a size limit",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Unit: Trees & Graphs                                                */
/* ------------------------------------------------------------------ */

export const TREE_THEORY: TheoryPageContent = {
  title: "Theory — Trees & binary trees",
  blurb: "From general trees to threaded, heap, Huffman, AVL and 2-3 — every tree topic from the unit.",
  blocks: [
    {
      title: "Tree — definition, concepts & representation",
      intro:
        "A tree is a finite set of nodes with a distinguished root and no cycles: every other node has exactly one parent. It is the natural shape for hierarchies — file systems, DOM, org charts.",
      points: [
        "root / parent / child / leaf — the vocabulary; a leaf has no children",
        "degree of a node — its number of children; depth of root is 0, height = longest root→leaf path",
        "n nodes → exactly n−1 edges; a tree with n nodes is minimally connected",
        "Binary tree — every node has at most 2 children (left/right), which may be empty",
        "Full/complete — full: every node 0 or 2 children; complete: all levels filled except possibly the last, filled left-to-right",
        "Representation — nodes with left/right pointers, or a sequential array where node i's children sit at 2i+1 and 2i+2 (the heap layout)",
      ],
    },
    {
      title: "Binary tree traversals",
      intro:
        "Three depth-first orders visit every node once; the difference is when the root is read relative to its subtrees. Level-order (BFS) is the fourth order and uses a queue.",
      points: [
        "Preorder (root, left, right) — copies/serialises a tree",
        "Inorder (left, root, right) — sorts a BST; the run animation on this page shows it",
        "Postorder (left, right, root) — deletes children before parents; used by compilers",
        "Level-order (by depth) — a queue, not recursion",
        "n nodes → n!/(n+1) distinct binary-tree shapes (Catalan number) — why traversal choice matters",
      ],
    },
    {
      title: "Conversion from general tree to binary tree",
      intro:
        "A general tree allows any number of children; a binary tree allows two. The Left-Child Right-Sibling rule converts between them losslessly using the same nodes.",
      points: [
        "Step 1 — link the children of each node horizontally (sibling pointers)",
        "Step 2 — delete all but the first (leftmost) parent→child edge",
        "Step 3 — rotate 45°: first child becomes the left child, sibling chain becomes right children",
        "The binary tree's inorder traversal reproduces the general tree's preorder-ish sibling order — the standard exam question",
        "The conversion is one-to-one: converting back recovers the original tree",
      ],
    },
    {
      title: "Threaded binary tree",
      intro:
        "In a plain binary tree roughly half the pointers are NULL. A threaded tree reuses them: a NULL left pointer is replaced by a thread to the inorder predecessor, a NULL right by a thread to the inorder successor.",
      points: [
        "Utilises wasted NULL pointers and makes inorder traversal possible without recursion or a stack — O(n) time, O(1) extra space",
        "Single threaded — only one side (usually right) is threaded; double threaded — both",
        "Needs one extra boolean per pointer (leftThread / rightThread) to tell a real child link from a thread",
        "Finding the successor: if rightThread, follow the thread; else go left-most of the right subtree",
        "Insertion is more delicate — every insert may have to retarget threads",
      ],
    },
    {
      title: "Heap & the priority queue",
      intro:
        "A heap is a complete binary tree stored in an array where every parent compares favourably to its children — a max-heap's parent ≥ children (a min-heap's ≤). It powers priority queues and heapsort.",
      points: [
        "Array form — parent at i, children at 2i+1 and 2i+2; no pointers at all",
        "insert — append at the end, then sift up while it beats its parent: O(log n)",
        "extract-max — take the root, move the last element to the root, sift down: O(log n)",
        "build-heap — heapify all non-leaves bottom-up in O(n)",
        "Same value everywhere is fine (not a BST) — only the parent/child relation is enforced, siblings are unordered",
        "Heapsort — build a max-heap, repeatedly extract-max: O(n log n) in place",
      ],
    },
    {
      title: "Tree for Huffman coding",
      intro:
        "Huffman coding compresses text by giving frequent characters short codes. Build a min-heap of node weights (each character's frequency), then repeatedly merge the two smallest-weight trees — the result is an optimal prefix tree where each left step is 0 and each right step is 1.",
      points: [
        "Greedy & optimal — no other prefix code beats it for known frequencies",
        "Prefix property — no codeword is a prefix of another, so a bitstream decodes without separators",
        "More frequent character = shallower leaf = shorter code",
        "n characters → n−1 merge steps → exactly n−1 internal nodes; tree height sets the longest code",
        "Fixed vs variable length — ASCII gives every char 8 bits; Huffman gives 'e' maybe 3 and 'z' maybe 12",
      ],
    },
    {
      title: "AVL trees",
      intro:
        "An AVL tree is a self-balancing BST: for every node, the heights of its left and right subtrees differ by at most 1. If an insert breaks the rule, rotations restore balance locally in O(log n) total.",
      points: [
        "Balance factor = height(left) − height(right); must stay −1, 0 or +1",
        "LL → single right rotation; RR → single left rotation",
        "LR → left rotation on the child, then right rotation; RL → the mirror image",
        "Insert needs at most one (single or double) rotation; delete may need O(log n) of them",
        "Guaranteed O(log n) search/insert/delete — the fix for the spiky BST this page warns about",
      ],
    },
    {
      title: "2-3 trees",
      intro:
        "A 2-3 tree is a perfectly balanced search tree where every node holds 1 key (2 children) or 2 keys (3 children), and every leaf sits at the same depth. Growth happens at the root, so the height never spikes.",
      points: [
        "Search like a BST, but compare against up to two keys per node",
        "Insert into a leaf; a 3rd key splits the node and pushes the middle key up",
        "If the root splits, a new root is created — the tree grows upward and all leaves stay level",
        "Every operation — search, insert, delete — is O(log n) worst case, guaranteed by construction",
        "The conceptual parent of B-trees, which generalise it to many keys per node for disk pages",
      ],
    },
  ],
};

export const GRAPH_THEORY: TheoryPageContent = {
  title: "Theory — Graphs",
  blurb: "Definitions, representations, the two searches, spanning trees and the three classic weighted algorithms.",
  blocks: [
    {
      title: "Graph — definition, concepts & representation",
      intro:
        "A graph G = (V, E) is a set of vertices joined by edges — the most general structure in this course: no root, no order, anything can connect to anything.",
      points: [
        "Directed vs undirected — one-way vs two-way streets; weighted vs unweighted — edges carry costs",
        "Degree — edges touching a vertex; in-degree/out-degree for directed graphs",
        "Path / cycle / connected — a route, a closed route, and whether every vertex is reachable",
        "Adjacency matrix — V×V grid, O(1) edge lookup but O(V²) memory; best for dense graphs",
        "Adjacency list — array of neighbour lists, O(V+E) memory; best for sparse graphs (almost everything real)",
      ],
    },
    {
      title: "Types of graphs",
      intro: "A short taxonomy that names every shape a graph can take.",
      points: [
        "Null & trivial graph — no edges; a single vertex",
        "Simple graph — no self-loops, no parallel edges; multigraph — allows them",
        "Complete (Kn) — every pair joined; n(n−1)/2 edges",
        "Regular — every vertex has the same degree; cyclic/acyclic (DAG)",
        "Bipartite — vertices split into two sets, edges only across",
        "Subgraph, connected vs disconnected, tree = connected acyclic graph",
      ],
    },
    {
      title: "Breadth-first search & depth-first search",
      intro:
        "The two systematic ways to visit every vertex: BFS spreads level by level using a queue; DFS dives deep and backtracks using recursion/stack. Both run in O(V+E) with an adjacency list.",
      points: [
        "BFS gives shortest paths by edge count — the base of unweighted shortest path",
        "DFS detects cycles, topsorts DAGs and finds connected components",
        "Keep a visited set — without it both searches loop forever on cycles",
        "Live demos: the visualizer above runs both on the graph you build",
      ],
    },
    {
      title: "Spanning tree & MST",
      intro:
        "A spanning tree keeps all V vertices and exactly V−1 edges with no cycles. A minimum spanning tree is the one with the least total weight — the cheapest wiring that keeps everything connected.",
      points: [
        "A connected graph has at least one spanning tree; a complete graph has n^(n−2) of them (Cayley)",
        "MSTs are the network-design answer: cabling, pipelines, road networks, cluster analysis",
        "Greedy choice (cut property) — the lightest edge crossing any cut is safe to take; both Kruskal and Prim exploit this",
        "Kruskal — sort edges, add the cheapest that doesn't form a cycle (union-find detects cycles): O(E log E)",
        "Prim — grow one tree outward from a start vertex, always taking the cheapest edge to a new vertex: O(E log V) with a heap",
      ],
    },
    {
      title: "Dijkstra's shortest path",
      intro:
        "For non-negative weights, Dijkstra finds the cheapest path from a source to every vertex — settle the nearest unsettled vertex, relax its edges, repeat. The GPS simulation above plays it on a city map.",
      points: [
        "Greedy: once a vertex is settled its distance is final",
        "Relaxation — if dist[u] + w(u,v) < dist[v], improve dist[v] and remember u as v's predecessor",
        "O(V²) with arrays, O(E log V) with a min-heap",
        "Fails on negative weights (use Bellman-Ford instead)",
        "Reconstruct the route by walking predecessors backwards from the destination",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Helpers used by the tree page simulations                           */
/* ------------------------------------------------------------------ */

export interface ConvNode {
  id: number;
  label: string;
  children: ConvNode[];
}

let convNextId = 1;

function convNode(label: string, children: ConvNode[] = []): ConvNode {
  convNextId += 1;
  return { id: convNextId, label, children };
}

/** The classic exam example: A(B(C,D,E), F(G)) as a general tree. */
export function sampleGeneralTree(): ConvNode {
  convNextId = 0;
  return convNode("A", [
    convNode("B", [convNode("C"), convNode("D"), convNode("E")]),
    convNode("F", [convNode("G")]),
  ]);
}

/**
 * Left-Child Right-Sibling conversion steps for rendering the animation.
 * Each step is a flat list of positioned nodes + links.
 */
export interface ConvLink {
  from: number;
  to: number;
  kind: "child" | "sibling";
}

export interface ConvStep {
  nodes: { id: number; label: string; x: number; y: number }[];
  links: ConvLink[];
  caption: string;
}

const CONV_W = 660;
const CONV_ROW = 92;

/** Flatten the general tree for step 1/2 rendering (original shape). */
export function generalTreeLayout(root: ConvNode): {
  nodes: { id: number; label: string; x: number; y: number }[];
  childLinks: { from: number; to: number }[];
  siblingLinks: { from: number; to: number }[];
} {
  const nodes: { id: number; label: string; x: number; y: number }[] = [];
  const childLinks: { from: number; to: number }[] = [];
  const siblingLinks: { from: number; to: number }[] = [];

  // subtree leaf counts decide horizontal spread
  const leaves = (n: ConvNode): number => {
    if (n.children.length === 0) return 1;
    return n.children.reduce((sum, c) => sum + leaves(c), 0);
  };

  let cursor = 0;
  const place = (n: ConvNode, depth: number, parentId: number | null): number => {
    const leafCount = leaves(n);
    const x = ((cursor + leafCount / 2) / Math.max(leaves(root), 1)) * (CONV_W - 80) + 40;
    cursor += leafCount;
    nodes.push({ id: n.id, label: n.label, x, y: 44 + depth * CONV_ROW });
    if (parentId !== null) childLinks.push({ from: parentId, to: n.id });
    let prevSibling: number | null = null;
    for (const child of n.children) {
      const id = place(child, depth + 1, n.id);
      if (prevSibling !== null) siblingLinks.push({ from: prevSibling, to: id });
      prevSibling = id;
    }
    return n.id;
  };
  place(root, 0, null);
  return { nodes, childLinks, siblingLinks };
}

/** Binary layout of the LCRS result: first child = left, sibling = right. */
export function convertedTreeLayout(root: ConvNode): {
  nodes: { id: number; label: string; x: number; y: number }[];
  links: { from: number; to: number }[];
} {
  const nodes: { id: number; label: string; x: number; y: number }[] = [];
  const links: { from: number; to: number }[] = [];

  // convert: first child -> left, rest -> right chain of first child
  interface BinNode {
    id: number;
    label: string;
    left: BinNode | null;
    right: BinNode | null;
  }
  const convert = (n: ConvNode): BinNode => {
    const bin: BinNode = { id: n.id, label: n.label, left: null, right: null };
    if (n.children.length > 0) {
      bin.left = convert(n.children[0]);
      let cur = bin.left;
      for (let i = 1; i < n.children.length; i++) {
        cur.right = convert(n.children[i]);
        cur = cur.right;
      }
    }
    return bin;
  };

  const binRoot = convert(root);
  const inorder: BinNode[] = [];
  const walk = (n: BinNode | null) => {
    if (!n) return;
    walk(n.left);
    inorder.push(n);
    walk(n.right);
  };
  walk(binRoot);

  const slot = CONV_W / inorder.length;
  const xById = new Map<number, number>();
  inorder.forEach((n, i) => xById.set(n.id, (i + 0.5) * slot));

  const placeBin = (n: BinNode | null, depth: number, parentId: number | null) => {
    if (!n) return;
    nodes.push({ id: n.id, label: n.label, x: xById.get(n.id) ?? CONV_W / 2, y: 44 + depth * CONV_ROW });
    if (parentId !== null) links.push({ from: parentId, to: n.id });
    placeBin(n.left, depth + 1, n.id);
    placeBin(n.right, depth + 1, n.id);
  };
  placeBin(binRoot, 0, null);
  return { nodes, links };
}

/** Build the classic threaded-BST example 50/30/70/20/40/60/80 as (value, index) rows. */
export const THREADED_EXAMPLE_VALUES = [50, 30, 70, 20, 40, 60, 80];
