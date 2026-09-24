export type CodeLang = "js" | "py" | "c" | "cpp" | "java";

export type TokenKind =
  | "comment"
  | "macro"
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

const C_KEYWORDS = new Set([
  "auto", "break", "case", "char", "const", "continue", "default", "do",
  "double", "else", "enum", "extern", "float", "for", "goto", "if", "int",
  "long", "register", "return", "short", "signed", "sizeof", "static",
  "struct", "switch", "typedef", "union", "unsigned", "void", "volatile",
  "while", "bool", "true", "false", "NULL",
]);

const CPP_KEYWORDS = new Set([
  ...C_KEYWORDS,
  "class", "public", "private", "protected", "friend", "virtual", "template",
  "typename", "namespace", "using", "new", "delete", "this", "nullptr",
  "operator", "explicit", "inline", "mutable", "constexpr", "override",
  "final", "try", "catch", "throw",
]);

const JAVA_KEYWORDS = new Set([
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
  "class", "continue", "default", "do", "double", "else", "enum", "extends",
  "final", "finally", "float", "for", "if", "implements", "import",
  "instanceof", "int", "interface", "long", "native", "new", "package",
  "private", "protected", "public", "return", "short", "static", "super",
  "switch", "synchronized", "this", "throw", "throws", "transient", "try",
  "void", "volatile", "while", "var", "record", "true", "false", "null",
]);

const KEYWORDS: Record<CodeLang, Set<string>> = {
  js: JS_KEYWORDS,
  py: PY_KEYWORDS,
  c: C_KEYWORDS,
  cpp: CPP_KEYWORDS,
  java: JAVA_KEYWORDS,
};

const BUILTINS = new Set([
  // shared / JS / Python
  "Map", "Set", "Array", "Object", "Number", "String", "Math", "JSON",
  "console", "deque", "len", "setdefault", "append", "pop", "popleft", "get",
  "add", "push", "shift", "has", "print", "range", "set", "list", "dict",
  // C
  "malloc", "calloc", "realloc", "free", "printf", "scanf", "memset", "exit",
  "size_t",
  // C++
  "std", "cout", "cin", "endl", "vector", "queue", "stack", "unordered_map",
  "unordered_set", "pair", "string", "push_back",
  // Java
  "System", "Integer", "ArrayList", "LinkedList",
  "ArrayDeque", "HashMap", "HashSet", "Arrays", "List", "addLast",
  "removeFirst", "peekFirst", "computeIfAbsent", "getOrDefault",
]);

const KEYWORD_COLOR: Record<TokenKind, string> = {
  comment: "text-slate-500 italic",
  macro: "text-rose-300",
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
 * enough fidelity for teaching code in JS, Python, C, C++ and Java,
 * zero dependencies.
 */
export function tokenize(code: string, lang: CodeLang): Token[] {
  const keywords = KEYWORDS[lang];
  const tokens: Token[] = [];
  let i = 0;

  const push = (kind: TokenKind, value: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.value += value;
    else tokens.push({ kind, value });
  };

  while (i < code.length) {
    const rest = code.slice(i);

    // block comments — not a Python thing
    if (lang !== "py") {
      const blockMatch = rest.match(/^\/\*[\s\S]*?\*\//);
      if (blockMatch && blockMatch[0]) {
        push("comment", blockMatch[0]);
        i += blockMatch[0].length;
        continue;
      }
    }

    // preprocessor directives — C / C++ only (#include, #define, ...)
    if (lang === "c" || lang === "cpp") {
      const macroMatch = rest.match(/^#[^\n]*/);
      if (macroMatch && macroMatch[0]) {
        push("macro", macroMatch[0]);
        i += macroMatch[0].length;
        continue;
      }
    }

    // line comments — // everywhere, # in Python
    const commentMatch = rest.match(
      lang === "py" ? /^#[^\n]*/ : /^\/\/[^\n]*/,
    );
    if (commentMatch && commentMatch[0]) {
      push("comment", commentMatch[0]);
      i += commentMatch[0].length;
      continue;
    }

    // Java annotations (@Override, ...)
    if (lang === "java") {
      const annoMatch = rest.match(/^@[\w.]+/);
      if (annoMatch && annoMatch[0]) {
        push("macro", annoMatch[0]);
        i += annoMatch[0].length;
        continue;
      }
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

    // numbers — with C/Java-style suffixes (10L, 1.5f, 0x1F)
    const numberMatch = rest.match(/^0x[\da-fA-F]+|^\d+(?:\.\d+)?[fFlLdDuU]*/);
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
