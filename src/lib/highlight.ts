export type TokenKind =
  | "comment"
  | "string"
  | "keyword"
  | "builtin"
  | "number"
  | "function"
  | "punct"
  | "text";

export interface Token {
  kind: TokenKind;
  value: string;
}

const JS_KEYWORDS = new Set([
  "class", "constructor", "function", "return", "if", "else", "while", "for",
  "of", "in", "const", "let", "var", "new", "this", "yield", "true", "false",
  "null", "undefined", "typeof", "import", "export", "from", "extends", "get",
  "await", "async",
]);

const PY_KEYWORDS = new Set([
  "class", "def", "return", "if", "elif", "else", "while", "for", "in", "not",
  "and", "or", "None", "True", "False", "import", "from", "yield", "self",
  "lambda", "with", "as", "pass", "raise", "try", "except", "global", "del",
]);

const BUILTINS = new Set([
  "Map", "Set", "Array", "Object", "Number", "String", "Math", "JSON",
  "console", "deque", "len", "setdefault", "append", "pop", "popleft", "get",
  "add", "push", "shift", "has", "print", "range", "set", "list", "dict",
]);

const KEYWORD_COLOR: Record<TokenKind, string> = {
  comment: "text-slate-500 italic",
  string: "text-emerald-300",
  keyword: "text-violet-300",
  builtin: "text-cyan-300",
  number: "text-amber-300",
  function: "text-sky-200",
  punct: "text-slate-400",
  text: "text-slate-200",
};

export function tokenColor(kind: TokenKind): string {
  return KEYWORD_COLOR[kind];
}

/**
 * Very small tokenizer tuned for the snippets in this project —
 * enough fidelity for teaching code, zero dependencies.
 */
export function tokenize(code: string, lang: "js" | "py"): Token[] {
  const keywords = lang === "py" ? PY_KEYWORDS : JS_KEYWORDS;
  const tokens: Token[] = [];
  let i = 0;

  const push = (kind: TokenKind, value: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.value += value;
    else tokens.push({ kind, value });
  };

  while (i < code.length) {
    const rest = code.slice(i);

    // comments
    const commentMatch = rest.match(/^\/\/[^\n]*|^[ \t]*#[^\n]*/);
    if (commentMatch && commentMatch[0]) {
      push("comment", commentMatch[0]);
      i += commentMatch[0].length;
      continue;
    }

    // strings (single / double / template / triple-quoted)
    const stringMatch = rest.match(
      /^(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)/,
    );
    if (stringMatch && stringMatch[0]) {
      push("string", stringMatch[0]);
      i += stringMatch[0].length;
      continue;
    }

    // numbers
    const numberMatch = rest.match(/^0x[\da-fA-F]+|^\d+(\.\d+)?/);
    if (numberMatch && numberMatch[0]) {
      push("number", numberMatch[0]);
      i += numberMatch[0].length;
      continue;
    }

    // identifiers
    const identMatch = rest.match(/^[A-Za-z_$][\w$]*/);
    if (identMatch && identMatch[0]) {
      const ident = identMatch[0];
      const after = code.slice(i + ident.length);
      if (keywords.has(ident) || (lang === "py" && ident === "self")) {
        push("keyword", ident);
      } else if (after.startsWith("(")) {
        push("function", ident);
      } else if (BUILTINS.has(ident)) {
        push("builtin", ident);
      } else {
        push("text", ident);
      }
      i += ident.length;
      continue;
    }

    // punctuation & operators
    const punctMatch = rest.match(/^[^\w\s$]+/);
    if (punctMatch && punctMatch[0]) {
      push("punct", punctMatch[0]);
      i += punctMatch[0].length;
      continue;
    }

    // whitespace
    const wsMatch = rest.match(/^\s+/);
    if (wsMatch && wsMatch[0]) {
      push("text", wsMatch[0]);
      i += wsMatch[0].length;
      continue;
    }

    // fallback — advance one char to guarantee progress
    push("text", code[i]);
    i += 1;
  }

  return tokens;
}
