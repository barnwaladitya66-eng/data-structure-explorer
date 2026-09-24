/**
 * A tiny binary search tree used purely for the tree visualizer.
 * Nodes carry fixed ids so the UI can track them across renders.
 */
export interface BSTNode {
  id: number;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

let nextId = 0;

export function makeNode(value: number): BSTNode {
  nextId += 1;
  return { id: nextId, value, left: null, right: null };
}

/** Insert into a plain BST (no balancing). Returns the root. */
export function bstInsert(root: BSTNode | null, value: number): BSTNode {
  const node = makeNode(value);
  if (!root) return node;
  let current = root;
  while (true) {
    if (value < current.value) {
      if (!current.left) {
        current.left = node;
        return root;
      }
      current = current.left;
    } else {
      if (!current.right) {
        current.right = node;
        return root;
      }
      current = current.right;
    }
  }
}

export function treeDepth(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
}

export function countNodes(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

export type TraversalKind = "preorder" | "inorder" | "postorder";

/** Flattens a traversal into visit steps for animation (root → leaf order). */
export function traversalSteps(root: BSTNode | null, kind: TraversalKind): BSTNode[] {
  const steps: BSTNode[] = [];
  const walk = (node: BSTNode | null) => {
    if (!node) return;
    if (kind === "preorder") steps.push(node);
    walk(node.left);
    if (kind === "inorder") steps.push(node);
    walk(node.right);
    if (kind === "postorder") steps.push(node);
  };
  walk(root);
  return steps;
}

/** Nearest node id to a value (used to highlight where an insert would land). */
export function findPath(root: BSTNode | null, value: number): BSTNode[] {
  const path: BSTNode[] = [];
  let current = root;
  while (current) {
    path.push(current);
    current = value < current.value ? current.left : current.right;
  }
  return path;
}
