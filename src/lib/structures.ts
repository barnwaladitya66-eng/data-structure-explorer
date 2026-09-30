import { Binary, Code2, GitBranch, Layers, Link2, type LucideIcon } from "lucide-react";

export type AccentName = "cyan" | "violet" | "emerald" | "amber" | "rose";

export interface StructureMeta {
  slug: "" | "stack" | "queue" | "linked" | "tree" | "graph";
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
  rose: {
    text: "text-rose-300",
    ring: "ring-rose-400/40",
    bg: "bg-rose-400/10",
    border: "border-rose-400/30",
    glow: "shadow-[0_0_28px_-6px_rgb(251_113_133/0.45)]",
    dot: "bg-rose-400",
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
    slug: "linked",
    name: "Linked List",
    tagline: "Nodes in a chain",
    blurb:
      "Each node stores a value and a pointer to the next one — no shifting on insert, just relinking. Reaching position i means walking there, which is the price of the flexibility.",
    icon: Link2,
    accent: "rose",
    hex: "#fb7185",
    oklch: "oklch(0.8 0.14 14)",
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)*",
    delete: "O(1)*",
    space: "O(n)",
    methods: "insertHead · insertAt · deleteAt · traverse — O(1) at the head, O(n) to reach a position",
    demo: [
      "music playlists with next & previous",
      "undo chains inside editors",
      "memory allocators chaining free blocks",
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

/* ------------------------------------------------------------------ */
/* C implementations                                                   */
/* ------------------------------------------------------------------ */

export const STACK_CODE_C = `#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 16

typedef struct {
  int items[CAPACITY];
  int top;                     // index of the top element, -1 = empty
} Stack;

void init(Stack *s)          { s->top = -1; }
bool isEmpty(const Stack *s) { return s->top == -1; }

void push(Stack *s, int value) {   // O(1) — add to the top
  if (s->top == CAPACITY - 1) {    // overflow guard
    printf("stack overflow\\n");
    return;
  }
  s->items[++s->top] = value;
}

int pop(Stack *s) {                // O(1) — remove from the top
  if (isEmpty(s)) {
    printf("stack underflow\\n");
    return -1;
  }
  return s->items[s->top--];
}

int peek(const Stack *s) {         // O(1) — look, don't remove
  return isEmpty(s) ? -1 : s->items[s->top];
}`;

export const QUEUE_CODE_C = `#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 16

typedef struct {
  int items[CAPACITY];
  int head;                    // index of the front element
  int tail;                    // one past the last element
} Queue;

void init(Queue *q)          { q->head = q->tail = 0; }
bool isEmpty(const Queue *q) { return q->head == q->tail; }
int  size(const Queue *q)    { return q->tail - q->head; }

void enqueue(Queue *q, int value) {   // O(1) — join at the rear
  if (size(q) == CAPACITY) {
    printf("queue full\\n");
    return;
  }
  q->items[q->tail++] = value;
}

int dequeue(Queue *q) {               // O(1) — leave from the front
  if (isEmpty(q)) {
    printf("queue empty\\n");
    return -1;
  }
  return q->items[q->head++];
}

int front(const Queue *q) {
  return isEmpty(q) ? -1 : q->items[q->head];
}`;

export const TREE_CODE_C = `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
  int value;
  struct Node *left;
  struct Node *right;
} Node;

Node *newNode(int value) {
  Node *n = malloc(sizeof(Node));
  n->value = value;
  n->left = n->right = NULL;
  return n;
}

Node *insert(Node *root, int value) {   // O(log n) if balanced
  if (!root) return newNode(value);
  if (value < root->value)
    root->left = insert(root->left, value);
  else
    root->right = insert(root->right, value);
  return root;
}

void inorder(const Node *root) {        // prints sorted order
  if (!root) return;
  inorder(root->left);
  printf("%d ", root->value);
  inorder(root->right);
}

void freeTree(Node *root) {             // post-order cleanup
  if (!root) return;
  freeTree(root->left);
  freeTree(root->right);
  free(root);
}`;

export const GRAPH_CODE_C = `#include <stdio.h>
#include <stdbool.h>

#define V 6                             // number of nodes

/* Undirected graph as an adjacency matrix. */
bool adj[V][V];

void addEdge(int a, int b) {            // O(1)
  adj[a][b] = adj[b][a] = true;
}

void bfs(int start) {                   // O(V + E) — level by level
  bool visited[V] = { false };
  int queue[V], head = 0, tail = 0;

  visited[start] = true;
  queue[tail++] = start;

  while (head < tail) {
    int node = queue[head++];
    printf("%d ", node);
    for (int n = 0; n < V; n++) {
      if (adj[node][n] && !visited[n]) {
        visited[n] = true;
        queue[tail++] = n;
      }
    }
  }
}`;

/* ------------------------------------------------------------------ */
/* Java implementations                                                */
/* ------------------------------------------------------------------ */

export const STACK_CODE_JAVA = `import java.util.ArrayList;

class Stack<T> {
  private final ArrayList<T> items = new ArrayList<>();

  public void push(T value) {        // O(1) — add to the top
    items.add(value);
  }

  public T pop() {                   // O(1) — remove from the top
    if (isEmpty()) throw new IllegalStateException("stack underflow");
    return items.remove(items.size() - 1);
  }

  public T peek() {                  // O(1) — look, don't remove
    if (isEmpty()) return null;
    return items.get(items.size() - 1);
  }

  public boolean isEmpty() {
    return items.isEmpty();
  }

  public int size() {
    return items.size();
  }
}`;

export const QUEUE_CODE_JAVA = `import java.util.ArrayDeque;
import java.util.Queue;

class Demo {
  public static void main(String[] args) {
    Queue<Integer> q = new ArrayDeque<>();   // O(1) enqueue & dequeue

    q.offer(12);                             // join at the rear
    q.offer(31);
    q.offer(7);

    System.out.println(q.peek());            // front, don't remove
    System.out.println(q.poll());            // leave from the front
    System.out.println(q.size());
    System.out.println(q.isEmpty());
  }
}`;

export const TREE_CODE_JAVA = `class Node {
  int value;
  Node left, right;

  Node(int value) { this.value = value; }
}

class BST {
  Node root;

  void insert(int value) {           // O(log n) if balanced
    root = insert(root, value);
  }

  private Node insert(Node node, int value) {
    if (node == null) return new Node(value);
    if (value < node.value) node.left = insert(node.left, value);
    else                    node.right = insert(node.right, value);
    return node;
  }

  void inorder(Node node) {          // visits values in sorted order
    if (node == null) return;
    inorder(node.left);
    System.out.print(node.value + " ");
    inorder(node.right);
  }
}`;

export const GRAPH_CODE_JAVA = `import java.util.*;

class Graph {
  private final Map<String, List<String>> adj = new HashMap<>();

  void addEdge(String a, String b) {          // O(1), undirected
    adj.computeIfAbsent(a, k -> new ArrayList<>()).add(b);
    adj.computeIfAbsent(b, k -> new ArrayList<>()).add(a);
  }

  List<String> bfs(String start) {            // O(V + E) — level by level
    Set<String> visited = new HashSet<>(List.of(start));
    List<String> order = new ArrayList<>();
    Queue<String> queue = new ArrayDeque<>(List.of(start));

    while (!queue.isEmpty()) {
      String node = queue.poll();
      order.add(node);
      for (String n : adj.getOrDefault(node, List.of())) {
        if (visited.add(n)) queue.offer(n);
      }
    }
    return order;
  }
}`;

/* ------------------------------------------------------------------ */
/* C++ implementations                                                 */
/* ------------------------------------------------------------------ */

export const STACK_CODE_CPP = `#include <stack>
#include <iostream>

class Stack {
  std::stack<int> items;

 public:
  void push(int value) {          // O(1) — add to the top
    items.push(value);
  }

  int pop() {                     // O(1) — remove from the top
    if (items.empty()) throw std::underflow_error("stack underflow");
    int value = items.top();
    items.pop();
    return value;
  }

  int peek() const {              // O(1) — look, don't remove
    if (items.empty()) throw std::underflow_error("stack empty");
    return items.top();
  }

  bool isEmpty() const { return items.empty(); }
  std::size_t size() const { return items.size(); }
};`;

export const QUEUE_CODE_CPP = `#include <queue>
#include <iostream>

class Queue {
  std::queue<int> items;

 public:
  void enqueue(int value) {       // O(1) — join at the rear
    items.push(value);
  }

  int dequeue() {                 // O(1) — leave from the front
    if (items.empty()) throw std::underflow_error("queue empty");
    int value = items.front();
    items.pop();
    return value;
  }

  int front() const {             // O(1) — look, don't remove
    if (items.empty()) throw std::underflow_error("queue empty");
    return items.front();
  }

  bool isEmpty() const { return items.empty(); }
  std::size_t size() const { return items.size(); }
};`;

export const TREE_CODE_CPP = `#include <iostream>

struct Node {
  int value;
  Node *left = nullptr;
  Node *right = nullptr;
  explicit Node(int v) : value(v) {}
};

class BST {
  Node *root = nullptr;

  Node *insert(Node *node, int value) {   // O(log n) if balanced
    if (!node) return new Node(value);
    if (value < node->value)
      node->left = insert(node->left, value);
    else
      node->right = insert(node->right, value);
    return node;
  }

  void inorder(Node *node) const {        // visits sorted order
    if (!node) return;
    inorder(node->left);
    std::cout << node->value << ' ';
    inorder(node->right);
  }

 public:
  void insert(int value) { root = insert(root, value); }
  void inorder() const { inorder(root); }
};`;

export const GRAPH_CODE_CPP = `#include <queue>
#include <set>
#include <unordered_map>
#include <vector>

class Graph {
  std::unordered_map<std::string, std::vector<std::string>> adj;

 public:
  void addEdge(const std::string& a, const std::string& b) {
    adj[a].push_back(b);          // O(1), undirected
    adj[b].push_back(a);
  }

  std::vector<std::string> bfs(const std::string& start) {
    std::set<std::string> visited{start};
    std::vector<std::string> order;
    std::queue<std::string> queue{{start}};

    while (!queue.empty()) {      // O(V + E) — level by level
      std::string node = queue.front();
      queue.pop();
      order.push_back(node);
      for (const auto& n : adj[node]) {
        if (visited.insert(n).second) queue.push(n);
      }
    }
    return order;
  }
};`;

/* ------------------------------------------------------------------ */
/* Tabbed snippet groups — one entry per language per structure        */
/* ------------------------------------------------------------------ */

export type SnippetLang = "js" | "py" | "c" | "cpp" | "java";

export interface Snippet {
  lang: SnippetLang;
  code: string;
}

export const SNIPPETS: Record<
  StructureMeta["slug"],
  Record<SnippetLang, string>
> = {
  stack: {
    js: STACK_CODE_JS,
    py: STACK_CODE_PY,
    c: STACK_CODE_C,
    cpp: STACK_CODE_CPP,
    java: STACK_CODE_JAVA,
  },
  queue: {
    js: QUEUE_CODE_JS,
    py: QUEUE_CODE_PY,
    c: QUEUE_CODE_C,
    cpp: QUEUE_CODE_CPP,
    java: QUEUE_CODE_JAVA,
  },
  tree: {
    js: TREE_CODE_JS,
    py: TREE_CODE_PY,
    c: TREE_CODE_C,
    cpp: TREE_CODE_CPP,
    java: TREE_CODE_JAVA,
  },
  graph: {
    js: GRAPH_CODE_JS,
    py: GRAPH_CODE_PY,
    c: GRAPH_CODE_C,
    cpp: GRAPH_CODE_CPP,
    java: GRAPH_CODE_JAVA,
  },
  // linked-list snippets live in LIST_SNIPPETS below (singly/doubly/circular)
  linked: { js: "", py: "", c: "", cpp: "", java: "" },
  "": { js: "", py: "", c: "", cpp: "", java: "" },
};

/* ------------------------------------------------------------------ */
/* Linked list snippets — singly / doubly / circular, five languages   */
/* ------------------------------------------------------------------ */

export type ListVariant = "singly" | "doubly" | "circular";

export const LIST_VARIANTS: { id: ListVariant; label: string; blurb: string }[] = [
  { id: "singly", label: "Singly", blurb: "next only — forward chain" },
  { id: "doubly", label: "Doubly", blurb: "next + prev — walk both ways" },
  { id: "circular", label: "Circular", blurb: "tail loops back to head" },
];

export const LIST_CODE_SINGLY_JS = `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class SinglyLinkedList {
  head = null;

  insertAtHead(value) {              // O(1)
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
  }

  insertAtTail(value) {              // O(n) — walk to the end
    const node = new Node(value);
    if (!this.head) return (this.head = node);
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }

  insertAt(index, value) {           // O(n) — stop one node early
    if (index === 0) return this.insertAtHead(value);
    let prev = this.head;
    for (let i = 0; i < index - 1 && prev; i++) prev = prev.next;
    if (!prev) throw new RangeError("index out of range");
    const node = new Node(value);
    node.next = prev.next;
    prev.next = node;
  }

  deleteAt(index) {                  // O(n)
    if (!this.head) return;
    if (index === 0) {
      this.head = this.head.next;    // unlink the head
      return;
    }
    let prev = this.head;
    for (let i = 0; i < index - 1 && prev.next?.next; i++) prev = prev.next;
    if (prev.next) prev.next = prev.next.next;
  }

  *traverse() {                      // O(n) — follow the chain
    for (let cur = this.head; cur; cur = cur.next) yield cur.value;
  }
}`;

export const LIST_CODE_SINGLY_PY = `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, value):   # O(1)
        node = Node(value)
        node.next = self.head
        self.head = node

    def insert_at_tail(self, value):   # O(n)
        node = Node(value)
        if not self.head:
            self.head = node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def insert_at(self, index, value): # O(n)
        if index == 0:
            return self.insert_at_head(value)
        prev = self.head
        for _ in range(index - 1):
            if prev is None:
                raise IndexError("index out of range")
            prev = prev.next
        node = Node(value)
        node.next, prev.next = prev.next, node

    def delete_at(self, index):        # O(n)
        if not self.head:
            return
        if index == 0:
            self.head = self.head.next # unlink the head
            return
        prev = self.head
        for _ in range(index - 1):
            if prev.next is None:
                return
            prev = prev.next
        if prev.next:
            prev.next = prev.next.next

    def traverse(self):                # O(n)
        cur = self.head
        while cur:
            yield cur.value
            cur = cur.next`;

export const LIST_CODE_SINGLY_C = `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
  int value;
  struct Node *next;
} Node;

Node *newNode(int value) {
  Node *n = malloc(sizeof(Node));
  n->value = value;
  n->next = NULL;
  return n;
}

void insertAtHead(Node **head, int value) {   // O(1)
  Node *n = newNode(value);
  n->next = *head;
  *head = n;
}

void insertAtTail(Node **head, int value) {   // O(n)
  Node *n = newNode(value);
  if (!*head) { *head = n; return; }
  Node *cur = *head;
  while (cur->next) cur = cur->next;
  cur->next = n;
}

void insertAt(Node **head, int index, int value) {  // O(n)
  if (index == 0) return insertAtHead(head, value);
  Node *prev = *head;
  for (int i = 0; i < index - 1 && prev; i++) prev = prev->next;
  if (!prev) return;                          // index out of range
  Node *n = newNode(value);
  n->next = prev->next;
  prev->next = n;
}

void deleteAt(Node **head, int index) {       // O(n)
  if (!*head) return;
  Node *tmp;
  if (index == 0) {                           // unlink the head
    tmp = *head;
    *head = (*head)->next;
    free(tmp);
    return;
  }
  Node *prev = *head;
  for (int i = 0; i < index - 1 && prev->next; i++) prev = prev->next;
  if (!prev->next) return;
  tmp = prev->next;
  prev->next = tmp->next;
  free(tmp);
}

void traverse(const Node *head) {             // O(n)
  for (const Node *cur = head; cur; cur = cur->next)
    printf("%d -> ", cur->value);
  printf("NULL\\n");
}

void freeList(Node *head) {
  while (head) {
    Node *next = head->next;
    free(head);
    head = next;
  }
}`;

export const LIST_CODE_SINGLY_CPP = `#include <iostream>

struct Node {
  int value;
  Node *next = nullptr;
  explicit Node(int v) : value(v) {}
};

class SinglyLinkedList {
  Node *head = nullptr;

 public:
  void insertAtHead(int value) {           // O(1)
    Node *n = new Node(value);
    n->next = head;
    head = n;
  }

  void insertAt(int index, int value) {    // O(n)
    if (index == 0) return insertAtHead(value);
    Node *prev = head;
    for (int i = 0; i < index - 1 && prev; i++) prev = prev->next;
    if (!prev) throw std::out_of_range("index");
    Node *n = new Node(value);
    n->next = prev->next;
    prev->next = n;
  }

  void deleteAt(int index) {               // O(n)
    if (!head) return;
    Node *gone;
    if (index == 0) {
      gone = head;
      head = head->next;                   // unlink the head
    } else {
      Node *prev = head;
      for (int i = 0; i < index - 1 && prev->next; i++) prev = prev->next;
      if (!prev->next) return;
      gone = prev->next;
      prev->next = gone->next;
    }
    delete gone;
  }

  void traverse() const {                  // O(n)
    for (Node *cur = head; cur; cur = cur->next)
      std::cout << cur->value << " -> ";
    std::cout << "NULL\\n";
  }
};`;

export const LIST_CODE_SINGLY_JAVA = `class Node {
  int value;
  Node next;

  Node(int value) { this.value = value; }
}

class SinglyLinkedList {
  Node head;

  void insertAtHead(int value) {          // O(1)
    Node node = new Node(value);
    node.next = head;
    head = node;
  }

  void insertAt(int index, int value) {   // O(n)
    if (index == 0) { insertAtHead(value); return; }
    Node prev = head;
    for (int i = 0; i < index - 1 && prev != null; i++) prev = prev.next;
    if (prev == null) throw new IndexOutOfBoundsException("index");
    Node node = new Node(value);
    node.next = prev.next;
    prev.next = node;
  }

  void deleteAt(int index) {              // O(n)
    if (head == null) return;
    if (index == 0) {
      head = head.next;                   // unlink the head
      return;
    }
    Node prev = head;
    for (int i = 0; i < index - 1 && prev.next != null; i++) prev = prev.next;
    if (prev.next != null) prev.next = prev.next.next;
  }

  void traverse() {                       // O(n)
    for (Node cur = head; cur != null; cur = cur.next)
      System.out.print(cur.value + " -> ");
    System.out.println("NULL");
  }
}`;

export const LIST_CODE_DOUBLY_JS = `class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  head = null;
  tail = null;

  insertAtHead(value) {              // O(1)
    const node = new Node(value);
    node.next = this.head;
    if (this.head) this.head.prev = node;
    else this.tail = node;           // first node becomes both ends
    this.head = node;
  }

  insertAtTail(value) {              // O(1) — the tail pointer pays off
    const node = new Node(value);
    node.prev = this.tail;
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
  }

  insertAt(index, value) {           // O(n)
    if (index === 0) return this.insertAtHead(value);
    let prev = this.head;
    for (let i = 0; i < index - 1 && prev?.next; i++) prev = prev.next;
    if (!prev) throw new RangeError("index out of range");
    if (!prev.next) return this.insertAtTail(value);
    const node = new Node(value);
    node.prev = prev;
    node.next = prev.next;
    prev.next.prev = node;
    prev.next = node;                // four links, in a safe order
  }

  deleteAt(index) {                  // O(n)
    if (!this.head) return;
    let cur = this.head;
    for (let i = 0; i < index && cur.next; i++) cur = cur.next;
    if (cur.prev) cur.prev.next = cur.next;
    else this.head = cur.next;       // deleting the head
    if (cur.next) cur.next.prev = cur.prev;
    else this.tail = cur.prev;       // deleting the tail
  }

  *traverse() {                      // O(n) forward
    for (let cur = this.head; cur; cur = cur.next) yield cur.value;
  }

  *traverseBackward() {              // O(n) — the reason prev exists
    for (let cur = this.tail; cur; cur = cur.prev) yield cur.value;
  }
}`;

export const LIST_CODE_DOUBLY_PY = `class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def insert_at_head(self, value):   # O(1)
        node = Node(value)
        node.next = self.head
        if self.head:
            self.head.prev = node
        else:
            self.tail = node           # first node becomes both ends
        self.head = node

    def insert_at_tail(self, value):   # O(1) — the tail pointer pays off
        node = Node(value)
        node.prev = self.tail
        if self.tail:
            self.tail.next = node
        else:
            self.head = node
        self.tail = node

    def insert_at(self, index, value): # O(n)
        if index == 0:
            return self.insert_at_head(value)
        prev = self.head
        for _ in range(index - 1):
            if prev is None or prev.next is None:
                raise IndexError("index out of range")
            prev = prev.next
        if prev.next is None:
            return self.insert_at_tail(value)
        node = Node(value)
        node.prev, node.next = prev, prev.next
        prev.next.prev = node
        prev.next = node               # four links, in a safe order

    def delete_at(self, index):        # O(n)
        if not self.head:
            return
        cur = self.head
        for _ in range(index):
            if cur.next is None:
                return
            cur = cur.next
        if cur.prev:
            cur.prev.next = cur.next
        else:
            self.head = cur.next       # deleting the head
        if cur.next:
            cur.next.prev = cur.prev
        else:
            self.tail = cur.prev       # deleting the tail

    def traverse(self):                # O(n) forward
        cur = self.head
        while cur:
            yield cur.value
            cur = cur.next

    def traverse_backward(self):       # O(n) — the reason prev exists
        cur = self.tail
        while cur:
            yield cur.value
            cur = cur.prev`;

export const LIST_CODE_DOUBLY_C = `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
  int value;
  struct Node *prev;
  struct Node *next;
} Node;

Node *newNode(int value) {
  Node *n = malloc(sizeof(Node));
  n->value = value;
  n->prev = n->next = NULL;
  return n;
}

void insertAtHead(Node **head, Node **tail, int value) {   // O(1)
  Node *n = newNode(value);
  n->next = *head;
  if (*head) (*head)->prev = n;
  else       *tail = n;           /* first node becomes both ends */
  *head = n;
}

void insertAtTail(Node **head, Node **tail, int value) {   // O(1)
  Node *n = newNode(value);
  n->prev = *tail;
  if (*tail) (*tail)->next = n;
  else       *head = n;
  *tail = n;
}

void deleteAt(Node **head, Node **tail, int index) {       // O(n)
  if (!*head) return;
  Node *cur = *head;
  for (int i = 0; i < index && cur->next; i++) cur = cur->next;
  if (cur->prev) cur->prev->next = cur->next;
  else           *head = cur->next; /* deleting the head */
  if (cur->next) cur->next->prev = cur->prev;
  else           *tail = cur->prev; /* deleting the tail */
  free(cur);
}

void traverse(const Node *head) {         /* O(n) forward */
  for (const Node *cur = head; cur; cur = cur->next)
    printf("%d <-> ", cur->value);
  printf("NULL\\n");
}

void traverseBackward(const Node *tail) { /* O(n) — the reason prev exists */
  for (const Node *cur = tail; cur; cur = cur->prev)
    printf("%d <-> ", cur->value);
  printf("NULL\\n");
}`;

export const LIST_CODE_DOUBLY_CPP = `#include <iostream>

struct Node {
  int value;
  Node *prev = nullptr;
  Node *next = nullptr;
  explicit Node(int v) : value(v) {}
};

class DoublyLinkedList {
  Node *head = nullptr;
  Node *tail = nullptr;

 public:
  void insertAtHead(int value) {          // O(1)
    Node *n = new Node(value);
    n->next = head;
    if (head) head->prev = n;
    else      tail = n;                   // first node becomes both ends
    head = n;
  }

  void insertAtTail(int value) {          // O(1) — the tail pointer pays off
    Node *n = new Node(value);
    n->prev = tail;
    if (tail) tail->next = n;
    else      head = n;
    tail = n;
  }

  void deleteAt(int index) {              // O(n)
    if (!head) return;
    Node *cur = head;
    for (int i = 0; i < index && cur->next; i++) cur = cur->next;
    if (cur->prev) cur->prev->next = cur->next;
    else           head = cur->next;      // deleting the head
    if (cur->next) cur->next->prev = cur->prev;
    else           tail = cur->prev;      // deleting the tail
    delete cur;
  }

  void traverse() const {                 // O(n) forward
    for (Node *cur = head; cur; cur = cur->next)
      std::cout << cur->value << " <-> ";
    std::cout << "NULL\\n";
  }

  void traverseBackward() const {         // O(n) — the reason prev exists
    for (Node *cur = tail; cur; cur = cur->prev)
      std::cout << cur->value << " <-> ";
    std::cout << "NULL\\n";
  }
};`;

export const LIST_CODE_DOUBLY_JAVA = `class Node {
  int value;
  Node prev, next;

  Node(int value) { this.value = value; }
}

class DoublyLinkedList {
  Node head, tail;

  void insertAtHead(int value) {          // O(1)
    Node node = new Node(value);
    node.next = head;
    if (head != null) head.prev = node;
    else              tail = node;        // first node becomes both ends
    head = node;
  }

  void insertAtTail(int value) {          // O(1) — the tail pointer pays off
    Node node = new Node(value);
    node.prev = tail;
    if (tail != null) tail.next = node;
    else              head = node;
    tail = node;
  }

  void deleteAt(int index) {              // O(n)
    if (head == null) return;
    Node cur = head;
    for (int i = 0; i < index && cur.next != null; i++) cur = cur.next;
    if (cur.prev != null) cur.prev.next = cur.next;
    else                  head = cur.next;  // deleting the head
    if (cur.next != null) cur.next.prev = cur.prev;
    else                  tail = cur.prev;  // deleting the tail
  }

  void traverse() {                       // O(n) forward
    for (Node cur = head; cur != null; cur = cur.next)
      System.out.print(cur.value + " <-> ");
    System.out.println("NULL");
  }

  void traverseBackward() {               // O(n) — the reason prev exists
    for (Node cur = tail; cur != null; cur = cur.prev)
      System.out.print(cur.value + " <-> ");
    System.out.println("NULL");
  }
}`;

export const LIST_CODE_CIRCULAR_JS = `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class CircularLinkedList {
  tail = null;              // tail.next is the head — one pointer is enough

  insertAtHead(value) {     // O(1)
    const node = new Node(value);
    if (!this.tail) {
      node.next = node;     // a lone node points at itself
    } else {
      node.next = this.tail.next;
      this.tail.next = node;
    }
    this.tail = this.tail ?? node;
  }

  insertAtTail(value) {     // O(1) — same, but the new node becomes the tail
    this.insertAtHead(value);
    this.tail = this.tail.next; // old head is the new tail
  }

  insertAt(index, value) {  // O(n)
    if (!this.tail || index <= 0) return this.insertAtHead(value);
    let prev = this.tail;
    for (let i = 0; i < index && prev.next !== this.tail; i++) prev = prev.next;
    const node = new Node(value);
    node.next = prev.next;
    prev.next = node;
    if (prev === this.tail) this.tail = node; // inserted after the tail
  }

  deleteAt(index) {         // O(n)
    if (!this.tail) return;
    let prev = this.tail;
    for (let i = 0; i < index; i++) {
      if (prev.next === this.tail) return;  // index out of range
      prev = prev.next;
    }
    const gone = prev.next;
    if (gone === prev) return (this.tail = null); // last node left
    prev.next = gone.next;
    if (gone === this.tail) this.tail = prev;     // deleted the tail
  }

  *traverse(rounds = 1) {   // O(n) — and it can loop forever by design
    if (!this.tail) return;
    let cur = this.tail.next; // the head
    let count = 0;
    const size = this.size();
    while (count < size * rounds) {
      yield cur.value;
      cur = cur.next;
      count++;
    }
  }

  size() {
    if (!this.tail) return 0;
    let n = 1;
    for (let cur = this.tail.next; cur !== this.tail; cur = cur.next) n++;
    return n;
  }
}`;

export const LIST_CODE_CIRCULAR_PY = `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class CircularLinkedList:
    def __init__(self):
        self.tail = None         # tail.next is the head — one pointer is enough

    def insert_at_head(self, value):   # O(1)
        node = Node(value)
        if not self.tail:
            node.next = node           # a lone node points at itself
            self.tail = node
        else:
            node.next = self.tail.next
            self.tail.next = node

    def insert_at(self, index, value): # O(n)
        if not self.tail or index <= 0:
            return self.insert_at_head(value)
        prev = self.tail
        for _ in range(index):
            if prev.next is self.tail:
                break
            prev = prev.next
        node = Node(value)
        node.next = prev.next
        prev.next = node
        if prev is self.tail:      # inserted after the tail
            self.tail = node

    def delete_at(self, index):    # O(n)
        if not self.tail:
            return
        prev = self.tail
        for _ in range(index):
            if prev.next is self.tail:
                return             # index out of range
            prev = prev.next
        gone = prev.next
        if gone is prev:
            self.tail = None       # last node left
            return
        prev.next = gone.next
        if gone is self.tail:      # deleted the tail
            self.tail = prev

    def traverse(self, rounds=1):  # O(n) — and it can loop forever by design
        if not self.tail:
            return
        size = self.size()
        cur = self.tail.next       # the head
        for _ in range(size * rounds):
            yield cur.value
            cur = cur.next

    def size(self):
        if not self.tail:
            return 0
        n = 1
        cur = self.tail.next
        while cur is not self.tail:
            n += 1
            cur = cur.next
        return n`;

export const LIST_CODE_CIRCULAR_C = `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
  int value;
  struct Node *next;
} Node;

/* We keep only the tail: tail->next is the head. */

void insertAtHead(Node **tail, int value) {   // O(1)
  Node *n = malloc(sizeof(Node));
  n->value = value;
  if (!*tail) {
    n->next = n;               /* a lone node points at itself */
  } else {
    n->next = (*tail)->next;
    (*tail)->next = n;
  }
  if (!*tail) *tail = n;
}

void insertAtTail(Node **tail, int value) {   // O(1)
  insertAtHead(tail, value);
  *tail = (*tail)->next;      /* walk one step: old head is new tail */
}

void deleteAt(Node **tail, int index) {       // O(n)
  if (!*tail) return;
  Node *prev = *tail;
  for (int i = 0; i < index; i++) {
    if (prev->next == *tail) return;          /* index out of range */
    prev = prev->next;
  }
  Node *gone = prev->next;
  if (gone == prev) {           /* last node left */
    *tail = NULL;
  } else {
    prev->next = gone->next;
    if (gone == *tail) *tail = prev;          /* deleted the tail */
  }
  free(gone);
}

void traverse(const Node *tail) {             /* O(n) per lap */
  if (!tail) { printf("empty\\n"); return; }
  const Node *cur = tail->next; /* the head */
  do {
    printf("%d -> ", cur->value);
    cur = cur->next;
  } while (cur != tail->next);  /* stop after one full circle */
  printf("(back to head)\\n");
}`;

export const LIST_CODE_CIRCULAR_CPP = `#include <iostream>

struct Node {
  int value;
  Node *next = nullptr;
  explicit Node(int v) : value(v) {}
};

class CircularLinkedList {
  Node *tail = nullptr;        // tail->next is the head

 public:
  void insertAtHead(int value) {          // O(1)
    Node *n = new Node(value);
    if (!tail) {
      n->next = n;                        // a lone node points at itself
      tail = n;
    } else {
      n->next = tail->next;
      tail->next = n;
    }
  }

  void insertAtTail(int value) {          // O(1)
    insertAtHead(value);
    tail = tail->next;                    // old head is the new tail
  }

  void deleteAt(int index) {              // O(n)
    if (!tail) return;
    Node *prev = tail;
    for (int i = 0; i < index; i++) {
      if (prev->next == tail) return;     // index out of range
      prev = prev->next;
    }
    Node *gone = prev->next;
    if (gone == prev) {                   // last node left
      tail = nullptr;
    } else {
      prev->next = gone->next;
      if (gone == tail) tail = prev;      // deleted the tail
    }
    delete gone;
  }

  void traverse() const {                 // O(n) — one full circle
    if (!tail) { std::cout << "empty\\n"; return; }
    Node *cur = tail->next;               // the head
    do {
      std::cout << cur->value << " -> ";
      cur = cur->next;
    } while (cur != tail->next);
    std::cout << "(back to head)\\n";
  }
};`;

export const LIST_CODE_CIRCULAR_JAVA = `class Node {
  int value;
  Node next;

  Node(int value) { this.value = value; }
}

class CircularLinkedList {
  Node tail;                 // tail.next is the head — one pointer is enough

  void insertAtHead(int value) {          // O(1)
    Node node = new Node(value);
    if (tail == null) {
      node.next = node;                   // a lone node points at itself
      tail = node;
    } else {
      node.next = tail.next;
      tail.next = node;
    }
  }

  void insertAtTail(int value) {          // O(1)
    insertAtHead(value);
    tail = tail.next;                     // old head is the new tail
  }

  void insertAt(int index, int value) {   // O(n)
    if (tail == null || index <= 0) { insertAtHead(value); return; }
    Node prev = tail;
    for (int i = 0; i < index && prev.next != tail; i++) prev = prev.next;
    Node node = new Node(value);
    node.next = prev.next;
    prev.next = node;
    if (prev == tail) tail = node;        // inserted after the tail
  }

  void deleteAt(int index) {              // O(n)
    if (tail == null) return;
    Node prev = tail;
    for (int i = 0; i < index; i++) {
      if (prev.next == tail) return;      // index out of range
      prev = prev.next;
    }
    Node gone = prev.next;
    if (gone == prev) {                   // last node left
      tail = null;
    } else {
      prev.next = gone.next;
      if (gone == tail) tail = prev;      // deleted the tail
    }
  }

  void traverse() {                       // O(n) — one full circle
    if (tail == null) { System.out.println("empty"); return; }
    Node cur = tail.next;                 // the head
    do {
      System.out.print(cur.value + " -> ");
      cur = cur.next;
    } while (cur != tail.next);
    System.out.println("(back to head)");
  }
}`;

export const LIST_SNIPPETS: Record<ListVariant, Record<SnippetLang, string>> = {
  singly: {
    js: LIST_CODE_SINGLY_JS,
    py: LIST_CODE_SINGLY_PY,
    c: LIST_CODE_SINGLY_C,
    cpp: LIST_CODE_SINGLY_CPP,
    java: LIST_CODE_SINGLY_JAVA,
  },
  doubly: {
    js: LIST_CODE_DOUBLY_JS,
    py: LIST_CODE_DOUBLY_PY,
    c: LIST_CODE_DOUBLY_C,
    cpp: LIST_CODE_DOUBLY_CPP,
    java: LIST_CODE_DOUBLY_JAVA,
  },
  circular: {
    js: LIST_CODE_CIRCULAR_JS,
    py: LIST_CODE_CIRCULAR_PY,
    c: LIST_CODE_CIRCULAR_C,
    cpp: LIST_CODE_CIRCULAR_CPP,
    java: LIST_CODE_CIRCULAR_JAVA,
  },
};
