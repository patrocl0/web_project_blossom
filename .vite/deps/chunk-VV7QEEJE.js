// node_modules/graphql/version.mjs
var versionInfo = Object.freeze({
  major: 16,
  minor: 11,
  patch: 0,
  preReleaseTag: null
});

// node_modules/graphql/jsutils/devAssert.mjs
function devAssert(condition, message) {
  const booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message);
  }
}

// node_modules/graphql/jsutils/isObjectLike.mjs
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}

// node_modules/graphql/jsutils/invariant.mjs
function invariant(condition, message) {
  const booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(
      message != null ? message : "Unexpected invariant triggered."
    );
  }
}

// node_modules/graphql/language/location.mjs
var LineRegExp = /\r\n|[\n\r]/g;
function getLocation(source, position) {
  let lastLineStart = 0;
  let line = 1;
  for (const match of source.body.matchAll(LineRegExp)) {
    typeof match.index === "number" || invariant(false);
    if (match.index >= position) {
      break;
    }
    lastLineStart = match.index + match[0].length;
    line += 1;
  }
  return {
    line,
    column: position + 1 - lastLineStart
  };
}

// node_modules/graphql/language/printLocation.mjs
function printLocation(location) {
  return printSourceLocation(
    location.source,
    getLocation(location.source, location.start)
  );
}
function printSourceLocation(source, sourceLocation) {
  const firstLineColumnOffset = source.locationOffset.column - 1;
  const body = "".padStart(firstLineColumnOffset) + source.body;
  const lineIndex = sourceLocation.line - 1;
  const lineOffset = source.locationOffset.line - 1;
  const lineNum = sourceLocation.line + lineOffset;
  const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  const columnNum = sourceLocation.column + columnOffset;
  const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
  const lines = body.split(/\r\n|[\n\r]/g);
  const locationLine = lines[lineIndex];
  if (locationLine.length > 120) {
    const subLineIndex = Math.floor(columnNum / 80);
    const subLineColumnNum = columnNum % 80;
    const subLines = [];
    for (let i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }
    return locationStr + printPrefixedLines([
      [`${lineNum} |`, subLines[0]],
      ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
      ["|", "^".padStart(subLineColumnNum)],
      ["|", subLines[subLineIndex + 1]]
    ]);
  }
  return locationStr + printPrefixedLines([
    // Lines specified like this: ["prefix", "string"],
    [`${lineNum - 1} |`, lines[lineIndex - 1]],
    [`${lineNum} |`, locationLine],
    ["|", "^".padStart(columnNum)],
    [`${lineNum + 1} |`, lines[lineIndex + 1]]
  ]);
}
function printPrefixedLines(lines) {
  const existingLines = lines.filter(([_, line]) => line !== void 0);
  const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
  return existingLines.map(([prefix, line]) => prefix.padStart(padLen) + (line ? " " + line : "")).join("\n");
}

// node_modules/graphql/error/GraphQLError.mjs
function toNormalizedOptions(args) {
  const firstArg = args[0];
  if (firstArg == null || "kind" in firstArg || "length" in firstArg) {
    return {
      nodes: firstArg,
      source: args[1],
      positions: args[2],
      path: args[3],
      originalError: args[4],
      extensions: args[5]
    };
  }
  return firstArg;
}
var GraphQLError = class _GraphQLError extends Error {
  /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */
  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */
  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  /**
   * The original error thrown from a field resolver during execution.
   */
  /**
   * Extension fields to add to the formatted error.
   */
  /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */
  constructor(message, ...rawArgs) {
    var _this$nodes, _nodeLocations$, _ref;
    const { nodes, source, positions, path, originalError, extensions } = toNormalizedOptions(rawArgs);
    super(message);
    this.name = "GraphQLError";
    this.path = path !== null && path !== void 0 ? path : void 0;
    this.originalError = originalError !== null && originalError !== void 0 ? originalError : void 0;
    this.nodes = undefinedIfEmpty(
      Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0
    );
    const nodeLocations = undefinedIfEmpty(
      (_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node) => node.loc).filter((loc) => loc != null)
    );
    this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
    this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => loc.start);
    this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => getLocation(loc.source, loc.start));
    const originalExtensions = isObjectLike(
      originalError === null || originalError === void 0 ? void 0 : originalError.extensions
    ) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : void 0;
    this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : /* @__PURE__ */ Object.create(null);
    Object.defineProperties(this, {
      message: {
        writable: true,
        enumerable: true
      },
      name: {
        enumerable: false
      },
      nodes: {
        enumerable: false
      },
      source: {
        enumerable: false
      },
      positions: {
        enumerable: false
      },
      originalError: {
        enumerable: false
      }
    });
    if (originalError !== null && originalError !== void 0 && originalError.stack) {
      Object.defineProperty(this, "stack", {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _GraphQLError);
    } else {
      Object.defineProperty(this, "stack", {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let output = this.message;
    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.loc) {
          output += "\n\n" + printLocation(node.loc);
        }
      }
    } else if (this.source && this.locations) {
      for (const location of this.locations) {
        output += "\n\n" + printSourceLocation(this.source, location);
      }
    }
    return output;
  }
  toJSON() {
    const formattedError = {
      message: this.message
    };
    if (this.locations != null) {
      formattedError.locations = this.locations;
    }
    if (this.path != null) {
      formattedError.path = this.path;
    }
    if (this.extensions != null && Object.keys(this.extensions).length > 0) {
      formattedError.extensions = this.extensions;
    }
    return formattedError;
  }
};
function undefinedIfEmpty(array) {
  return array === void 0 || array.length === 0 ? void 0 : array;
}

// node_modules/graphql/error/syntaxError.mjs
function syntaxError(source, position, description) {
  return new GraphQLError(`Syntax Error: ${description}`, {
    source,
    positions: [position]
  });
}

// node_modules/graphql/language/ast.mjs
var Location = class {
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The Token at which this Node begins.
   */
  /**
   * The Token at which this Node ends.
   */
  /**
   * The Source document the AST represents.
   */
  constructor(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
};
var Token = class {
  /**
   * The kind of Token.
   */
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The 1-indexed line number on which this Token appears.
   */
  /**
   * The 1-indexed column number at which this Token begins.
   */
  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */
  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(kind, start, end, line, column, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
};
var QueryDocumentKeys = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};
var kindValues = new Set(Object.keys(QueryDocumentKeys));
function isNode(maybeNode) {
  const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
  return typeof maybeKind === "string" && kindValues.has(maybeKind);
}
var OperationTypeNode;
(function(OperationTypeNode2) {
  OperationTypeNode2["QUERY"] = "query";
  OperationTypeNode2["MUTATION"] = "mutation";
  OperationTypeNode2["SUBSCRIPTION"] = "subscription";
})(OperationTypeNode || (OperationTypeNode = {}));

// node_modules/graphql/language/directiveLocation.mjs
var DirectiveLocation;
(function(DirectiveLocation2) {
  DirectiveLocation2["QUERY"] = "QUERY";
  DirectiveLocation2["MUTATION"] = "MUTATION";
  DirectiveLocation2["SUBSCRIPTION"] = "SUBSCRIPTION";
  DirectiveLocation2["FIELD"] = "FIELD";
  DirectiveLocation2["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
  DirectiveLocation2["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
  DirectiveLocation2["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
  DirectiveLocation2["VARIABLE_DEFINITION"] = "VARIABLE_DEFINITION";
  DirectiveLocation2["SCHEMA"] = "SCHEMA";
  DirectiveLocation2["SCALAR"] = "SCALAR";
  DirectiveLocation2["OBJECT"] = "OBJECT";
  DirectiveLocation2["FIELD_DEFINITION"] = "FIELD_DEFINITION";
  DirectiveLocation2["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
  DirectiveLocation2["INTERFACE"] = "INTERFACE";
  DirectiveLocation2["UNION"] = "UNION";
  DirectiveLocation2["ENUM"] = "ENUM";
  DirectiveLocation2["ENUM_VALUE"] = "ENUM_VALUE";
  DirectiveLocation2["INPUT_OBJECT"] = "INPUT_OBJECT";
  DirectiveLocation2["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
})(DirectiveLocation || (DirectiveLocation = {}));

// node_modules/graphql/language/kinds.mjs
var Kind;
(function(Kind2) {
  Kind2["NAME"] = "Name";
  Kind2["DOCUMENT"] = "Document";
  Kind2["OPERATION_DEFINITION"] = "OperationDefinition";
  Kind2["VARIABLE_DEFINITION"] = "VariableDefinition";
  Kind2["SELECTION_SET"] = "SelectionSet";
  Kind2["FIELD"] = "Field";
  Kind2["ARGUMENT"] = "Argument";
  Kind2["FRAGMENT_SPREAD"] = "FragmentSpread";
  Kind2["INLINE_FRAGMENT"] = "InlineFragment";
  Kind2["FRAGMENT_DEFINITION"] = "FragmentDefinition";
  Kind2["VARIABLE"] = "Variable";
  Kind2["INT"] = "IntValue";
  Kind2["FLOAT"] = "FloatValue";
  Kind2["STRING"] = "StringValue";
  Kind2["BOOLEAN"] = "BooleanValue";
  Kind2["NULL"] = "NullValue";
  Kind2["ENUM"] = "EnumValue";
  Kind2["LIST"] = "ListValue";
  Kind2["OBJECT"] = "ObjectValue";
  Kind2["OBJECT_FIELD"] = "ObjectField";
  Kind2["DIRECTIVE"] = "Directive";
  Kind2["NAMED_TYPE"] = "NamedType";
  Kind2["LIST_TYPE"] = "ListType";
  Kind2["NON_NULL_TYPE"] = "NonNullType";
  Kind2["SCHEMA_DEFINITION"] = "SchemaDefinition";
  Kind2["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
  Kind2["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
  Kind2["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
  Kind2["FIELD_DEFINITION"] = "FieldDefinition";
  Kind2["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
  Kind2["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
  Kind2["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
  Kind2["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
  Kind2["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
  Kind2["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
  Kind2["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
  Kind2["SCHEMA_EXTENSION"] = "SchemaExtension";
  Kind2["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
  Kind2["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
  Kind2["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
  Kind2["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
  Kind2["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
  Kind2["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
})(Kind || (Kind = {}));

// node_modules/graphql/language/characterClasses.mjs
function isWhiteSpace(code) {
  return code === 9 || code === 32;
}
function isDigit(code) {
  return code >= 48 && code <= 57;
}
function isLetter(code) {
  return code >= 97 && code <= 122 || // A-Z
  code >= 65 && code <= 90;
}
function isNameStart(code) {
  return isLetter(code) || code === 95;
}
function isNameContinue(code) {
  return isLetter(code) || isDigit(code) || code === 95;
}

// node_modules/graphql/language/blockString.mjs
function dedentBlockStringLines(lines) {
  var _firstNonEmptyLine2;
  let commonIndent = Number.MAX_SAFE_INTEGER;
  let firstNonEmptyLine = null;
  let lastNonEmptyLine = -1;
  for (let i = 0; i < lines.length; ++i) {
    var _firstNonEmptyLine;
    const line = lines[i];
    const indent2 = leadingWhitespace(line);
    if (indent2 === line.length) {
      continue;
    }
    firstNonEmptyLine = (_firstNonEmptyLine = firstNonEmptyLine) !== null && _firstNonEmptyLine !== void 0 ? _firstNonEmptyLine : i;
    lastNonEmptyLine = i;
    if (i !== 0 && indent2 < commonIndent) {
      commonIndent = indent2;
    }
  }
  return lines.map((line, i) => i === 0 ? line : line.slice(commonIndent)).slice(
    (_firstNonEmptyLine2 = firstNonEmptyLine) !== null && _firstNonEmptyLine2 !== void 0 ? _firstNonEmptyLine2 : 0,
    lastNonEmptyLine + 1
  );
}
function leadingWhitespace(str) {
  let i = 0;
  while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
    ++i;
  }
  return i;
}
function printBlockString(value, options) {
  const escapedValue = value.replace(/"""/g, '\\"""');
  const lines = escapedValue.split(/\r\n|[\n\r]/g);
  const isSingleLine = lines.length === 1;
  const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
  const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
  const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
  const hasTrailingSlash = value.endsWith("\\");
  const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
  const printAsMultipleLines = !(options !== null && options !== void 0 && options.minimize) && // add leading and trailing new lines only if it improves readability
  (!isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes);
  let result = "";
  const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
  if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
    result += "\n";
  }
  result += escapedValue;
  if (printAsMultipleLines || forceTrailingNewline) {
    result += "\n";
  }
  return '"""' + result + '"""';
}

// node_modules/graphql/language/tokenKind.mjs
var TokenKind;
(function(TokenKind2) {
  TokenKind2["SOF"] = "<SOF>";
  TokenKind2["EOF"] = "<EOF>";
  TokenKind2["BANG"] = "!";
  TokenKind2["DOLLAR"] = "$";
  TokenKind2["AMP"] = "&";
  TokenKind2["PAREN_L"] = "(";
  TokenKind2["PAREN_R"] = ")";
  TokenKind2["SPREAD"] = "...";
  TokenKind2["COLON"] = ":";
  TokenKind2["EQUALS"] = "=";
  TokenKind2["AT"] = "@";
  TokenKind2["BRACKET_L"] = "[";
  TokenKind2["BRACKET_R"] = "]";
  TokenKind2["BRACE_L"] = "{";
  TokenKind2["PIPE"] = "|";
  TokenKind2["BRACE_R"] = "}";
  TokenKind2["NAME"] = "Name";
  TokenKind2["INT"] = "Int";
  TokenKind2["FLOAT"] = "Float";
  TokenKind2["STRING"] = "String";
  TokenKind2["BLOCK_STRING"] = "BlockString";
  TokenKind2["COMMENT"] = "Comment";
})(TokenKind || (TokenKind = {}));

// node_modules/graphql/language/lexer.mjs
var Lexer = class {
  /**
   * The previously focused non-ignored token.
   */
  /**
   * The currently focused non-ignored token.
   */
  /**
   * The (1-indexed) line containing the current token.
   */
  /**
   * The character offset at which the current line begins.
   */
  constructor(source) {
    const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */
  advance() {
    this.lastToken = this.token;
    const token = this.token = this.lookahead();
    return token;
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  lookahead() {
    let token = this.token;
    if (token.kind !== TokenKind.EOF) {
      do {
        if (token.next) {
          token = token.next;
        } else {
          const nextToken = readNextToken(this, token.end);
          token.next = nextToken;
          nextToken.prev = token;
          token = nextToken;
        }
      } while (token.kind === TokenKind.COMMENT);
    }
    return token;
  }
};
function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
}
function isUnicodeScalarValue(code) {
  return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
}
function isSupplementaryCodePoint(body, location) {
  return isLeadingSurrogate(body.charCodeAt(location)) && isTrailingSurrogate(body.charCodeAt(location + 1));
}
function isLeadingSurrogate(code) {
  return code >= 55296 && code <= 56319;
}
function isTrailingSurrogate(code) {
  return code >= 56320 && code <= 57343;
}
function printCodePointAt(lexer, location) {
  const code = lexer.source.body.codePointAt(location);
  if (code === void 0) {
    return TokenKind.EOF;
  } else if (code >= 32 && code <= 126) {
    const char = String.fromCodePoint(code);
    return char === '"' ? `'"'` : `"${char}"`;
  }
  return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
}
function createToken(lexer, kind, start, end, value) {
  const line = lexer.line;
  const col = 1 + start - lexer.lineStart;
  return new Token(kind, start, end, line, col, value);
}
function readNextToken(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    switch (code) {
      // Ignored ::
      //   - UnicodeBOM
      //   - WhiteSpace
      //   - LineTerminator
      //   - Comment
      //   - Comma
      //
      // UnicodeBOM :: "Byte Order Mark (U+FEFF)"
      //
      // WhiteSpace ::
      //   - "Horizontal Tab (U+0009)"
      //   - "Space (U+0020)"
      //
      // Comma :: ,
      case 65279:
      // <BOM>
      case 9:
      // \t
      case 32:
      // <space>
      case 44:
        ++position;
        continue;
      // LineTerminator ::
      //   - "New Line (U+000A)"
      //   - "Carriage Return (U+000D)" [lookahead != "New Line (U+000A)"]
      //   - "Carriage Return (U+000D)" "New Line (U+000A)"
      case 10:
        ++position;
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      case 13:
        if (body.charCodeAt(position + 1) === 10) {
          position += 2;
        } else {
          ++position;
        }
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      // Comment
      case 35:
        return readComment(lexer, position);
      // Token ::
      //   - Punctuator
      //   - Name
      //   - IntValue
      //   - FloatValue
      //   - StringValue
      //
      // Punctuator :: one of ! $ & ( ) ... : = @ [ ] { | }
      case 33:
        return createToken(lexer, TokenKind.BANG, position, position + 1);
      case 36:
        return createToken(lexer, TokenKind.DOLLAR, position, position + 1);
      case 38:
        return createToken(lexer, TokenKind.AMP, position, position + 1);
      case 40:
        return createToken(lexer, TokenKind.PAREN_L, position, position + 1);
      case 41:
        return createToken(lexer, TokenKind.PAREN_R, position, position + 1);
      case 46:
        if (body.charCodeAt(position + 1) === 46 && body.charCodeAt(position + 2) === 46) {
          return createToken(lexer, TokenKind.SPREAD, position, position + 3);
        }
        break;
      case 58:
        return createToken(lexer, TokenKind.COLON, position, position + 1);
      case 61:
        return createToken(lexer, TokenKind.EQUALS, position, position + 1);
      case 64:
        return createToken(lexer, TokenKind.AT, position, position + 1);
      case 91:
        return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);
      case 93:
        return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);
      case 123:
        return createToken(lexer, TokenKind.BRACE_L, position, position + 1);
      case 124:
        return createToken(lexer, TokenKind.PIPE, position, position + 1);
      case 125:
        return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
      // StringValue
      case 34:
        if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
          return readBlockString(lexer, position);
        }
        return readString(lexer, position);
    }
    if (isDigit(code) || code === 45) {
      return readNumber(lexer, position, code);
    }
    if (isNameStart(code)) {
      return readName(lexer, position);
    }
    throw syntaxError(
      lexer.source,
      position,
      code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`
    );
  }
  return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
}
function readComment(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      break;
    }
  }
  return createToken(
    lexer,
    TokenKind.COMMENT,
    start,
    position,
    body.slice(start + 1, position)
  );
}
function readNumber(lexer, start, firstCode) {
  const body = lexer.source.body;
  let position = start;
  let code = firstCode;
  let isFloat = false;
  if (code === 45) {
    code = body.charCodeAt(++position);
  }
  if (code === 48) {
    code = body.charCodeAt(++position);
    if (isDigit(code)) {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid number, unexpected digit after 0: ${printCodePointAt(
          lexer,
          position
        )}.`
      );
    }
  } else {
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46) {
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 69 || code === 101) {
    isFloat = true;
    code = body.charCodeAt(++position);
    if (code === 43 || code === 45) {
      code = body.charCodeAt(++position);
    }
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46 || isNameStart(code)) {
    throw syntaxError(
      lexer.source,
      position,
      `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        position
      )}.`
    );
  }
  return createToken(
    lexer,
    isFloat ? TokenKind.FLOAT : TokenKind.INT,
    start,
    position,
    body.slice(start, position)
  );
}
function readDigits(lexer, start, firstCode) {
  if (!isDigit(firstCode)) {
    throw syntaxError(
      lexer.source,
      start,
      `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        start
      )}.`
    );
  }
  const body = lexer.source.body;
  let position = start + 1;
  while (isDigit(body.charCodeAt(position))) {
    ++position;
  }
  return position;
}
function readString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  let chunkStart = position;
  let value = "";
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return createToken(lexer, TokenKind.STRING, start, position + 1, value);
    }
    if (code === 92) {
      value += body.slice(chunkStart, position);
      const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer, position) : readEscapedUnicodeFixedWidth(lexer, position) : readEscapedCharacter(lexer, position);
      value += escape.value;
      position += escape.size;
      chunkStart = position;
      continue;
    }
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid character within String: ${printCodePointAt(
          lexer,
          position
        )}.`
      );
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
function readEscapedUnicodeVariableWidth(lexer, position) {
  const body = lexer.source.body;
  let point = 0;
  let size = 3;
  while (size < 12) {
    const code = body.charCodeAt(position + size++);
    if (code === 125) {
      if (size < 5 || !isUnicodeScalarValue(point)) {
        break;
      }
      return {
        value: String.fromCodePoint(point),
        size
      };
    }
    point = point << 4 | readHexDigit(code);
    if (point < 0) {
      break;
    }
  }
  throw syntaxError(
    lexer.source,
    position,
    `Invalid Unicode escape sequence: "${body.slice(
      position,
      position + size
    )}".`
  );
}
function readEscapedUnicodeFixedWidth(lexer, position) {
  const body = lexer.source.body;
  const code = read16BitHexCode(body, position + 2);
  if (isUnicodeScalarValue(code)) {
    return {
      value: String.fromCodePoint(code),
      size: 6
    };
  }
  if (isLeadingSurrogate(code)) {
    if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
      const trailingCode = read16BitHexCode(body, position + 8);
      if (isTrailingSurrogate(trailingCode)) {
        return {
          value: String.fromCodePoint(code, trailingCode),
          size: 12
        };
      }
    }
  }
  throw syntaxError(
    lexer.source,
    position,
    `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`
  );
}
function read16BitHexCode(body, position) {
  return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
}
function readHexDigit(code) {
  return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
}
function readEscapedCharacter(lexer, position) {
  const body = lexer.source.body;
  const code = body.charCodeAt(position + 1);
  switch (code) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: "\n",
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw syntaxError(
    lexer.source,
    position,
    `Invalid character escape sequence: "${body.slice(
      position,
      position + 2
    )}".`
  );
}
function readBlockString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let lineStart = lexer.lineStart;
  let position = start + 3;
  let chunkStart = position;
  let currentLine = "";
  const blockLines = [];
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      const token = createToken(
        lexer,
        TokenKind.BLOCK_STRING,
        start,
        position + 3,
        // Return a string of the lines joined with U+000A.
        dedentBlockStringLines(blockLines).join("\n")
      );
      lexer.line += blockLines.length - 1;
      lexer.lineStart = lineStart;
      return token;
    }
    if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      currentLine += body.slice(chunkStart, position);
      chunkStart = position + 1;
      position += 4;
      continue;
    }
    if (code === 10 || code === 13) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      if (code === 13 && body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      currentLine = "";
      chunkStart = position;
      lineStart = position;
      continue;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(
        lexer.source,
        position,
        `Invalid character within String: ${printCodePointAt(
          lexer,
          position
        )}.`
      );
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
function readName(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (isNameContinue(code)) {
      ++position;
    } else {
      break;
    }
  }
  return createToken(
    lexer,
    TokenKind.NAME,
    start,
    position,
    body.slice(start, position)
  );
}

// node_modules/graphql/jsutils/inspect.mjs
var MAX_ARRAY_LENGTH = 10;
var MAX_RECURSIVE_DEPTH = 2;
function inspect(value) {
  return formatValue(value, []);
}
function formatValue(value, seenValues) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "function":
      return value.name ? `[function ${value.name}]` : "[function]";
    case "object":
      return formatObjectValue(value, seenValues);
    default:
      return String(value);
  }
}
function formatObjectValue(value, previouslySeenValues) {
  if (value === null) {
    return "null";
  }
  if (previouslySeenValues.includes(value)) {
    return "[Circular]";
  }
  const seenValues = [...previouslySeenValues, value];
  if (isJSONable(value)) {
    const jsonValue = value.toJSON();
    if (jsonValue !== value) {
      return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }
  return formatObject(value, seenValues);
}
function isJSONable(value) {
  return typeof value.toJSON === "function";
}
function formatObject(object, seenValues) {
  const entries = Object.entries(object);
  if (entries.length === 0) {
    return "{}";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[" + getObjectTag(object) + "]";
  }
  const properties = entries.map(
    ([key, value]) => key + ": " + formatValue(value, seenValues)
  );
  return "{ " + properties.join(", ") + " }";
}
function formatArray(array, seenValues) {
  if (array.length === 0) {
    return "[]";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[Array]";
  }
  const len = Math.min(MAX_ARRAY_LENGTH, array.length);
  const remaining = array.length - len;
  const items = [];
  for (let i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }
  if (remaining === 1) {
    items.push("... 1 more item");
  } else if (remaining > 1) {
    items.push(`... ${remaining} more items`);
  }
  return "[" + items.join(", ") + "]";
}
function getObjectTag(object) {
  const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
  if (tag === "Object" && typeof object.constructor === "function") {
    const name = object.constructor.name;
    if (typeof name === "string" && name !== "") {
      return name;
    }
  }
  return tag;
}

// node_modules/graphql/jsutils/instanceOf.mjs
var isProduction = globalThis.process && // eslint-disable-next-line no-undef
false;
var instanceOf = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  isProduction ? function instanceOf2(value, constructor) {
    return value instanceof constructor;
  } : function instanceOf3(value, constructor) {
    if (value instanceof constructor) {
      return true;
    }
    if (typeof value === "object" && value !== null) {
      var _value$constructor;
      const className = constructor.prototype[Symbol.toStringTag];
      const valueClassName = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in value ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name
      );
      if (className === valueClassName) {
        const stringifiedValue = inspect(value);
        throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
      }
    }
    return false;
  }
);

// node_modules/graphql/language/source.mjs
var Source = class {
  constructor(body, name = "GraphQL request", locationOffset = {
    line: 1,
    column: 1
  }) {
    typeof body === "string" || devAssert(false, `Body must be a string. Received: ${inspect(body)}.`);
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 || devAssert(
      false,
      "line in locationOffset is 1-indexed and must be positive."
    );
    this.locationOffset.column > 0 || devAssert(
      false,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
};
function isSource(source) {
  return instanceOf(source, Source);
}

// node_modules/graphql/language/parser.mjs
function parse(source, options) {
  const parser = new Parser(source, options);
  const document = parser.parseDocument();
  Object.defineProperty(document, "tokenCount", {
    enumerable: false,
    value: parser.tokenCount
  });
  return document;
}
var Parser = class {
  constructor(source, options = {}) {
    const sourceObj = isSource(source) ? source : new Source(source);
    this._lexer = new Lexer(sourceObj);
    this._options = options;
    this._tokenCounter = 0;
  }
  get tokenCount() {
    return this._tokenCounter;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const token = this.expectToken(TokenKind.NAME);
    return this.node(token, {
      kind: Kind.NAME,
      value: token.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: Kind.DOCUMENT,
      definitions: this.many(
        TokenKind.SOF,
        this.parseDefinition,
        TokenKind.EOF
      )
    });
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   *
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  parseDefinition() {
    if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    }
    const hasDescription = this.peekDescription();
    const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (hasDescription) {
        throw syntaxError(
          this._lexer.source,
          this._lexer.token.start,
          "Unexpected description, descriptions are supported only on type definitions."
        );
      }
      switch (keywordToken.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  // Implements the parsing rules in the Operations section.
  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  parseOperationDefinition() {
    const start = this._lexer.token;
    if (this.peek(TokenKind.BRACE_L)) {
      return this.node(start, {
        kind: Kind.OPERATION_DEFINITION,
        operation: OperationTypeNode.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    }
    const operation = this.parseOperationType();
    let name;
    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }
    return this.node(start, {
      kind: Kind.OPERATION_DEFINITION,
      operation,
      name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */
  parseOperationType() {
    const operationToken = this.expectToken(TokenKind.NAME);
    switch (operationToken.value) {
      case "query":
        return OperationTypeNode.QUERY;
      case "mutation":
        return OperationTypeNode.MUTATION;
      case "subscription":
        return OperationTypeNode.SUBSCRIPTION;
    }
    throw this.unexpected(operationToken);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      TokenKind.PAREN_L,
      this.parseVariableDefinition,
      TokenKind.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return this.node(start, {
      kind: Kind.VARIABLE,
      name: this.parseName()
    });
  }
  /**
   * ```
   * SelectionSet : { Selection+ }
   * ```
   */
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: Kind.SELECTION_SET,
      selections: this.many(
        TokenKind.BRACE_L,
        this.parseSelection,
        TokenKind.BRACE_R
      )
    });
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const start = this._lexer.token;
    const nameOrAlias = this.parseName();
    let alias;
    let name;
    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }
    return this.node(start, {
      kind: Kind.FIELD,
      alias,
      name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(isConst) {
    const item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(isConst = false) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: Kind.ARGUMENT,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseConstArgument() {
    return this.parseArgument(true);
  }
  // Implements the parsing rules in the Fragments section.
  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  parseFragment() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    const hasTypeCondition = this.expectOptionalKeyword("on");
    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      return this.node(start, {
        kind: Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false)
      });
    }
    return this.node(start, {
      kind: Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  parseFragmentDefinition() {
    const start = this._lexer.token;
    this.expectKeyword("fragment");
    if (this._options.allowLegacyFragmentVariables === true) {
      return this.node(start, {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    return this.node(start, {
      kind: Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentName : Name but not `on`
   */
  parseFragmentName() {
    if (this._lexer.token.value === "on") {
      throw this.unexpected();
    }
    return this.parseName();
  }
  // Implements the parsing rules in the Values section.
  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseValueLiteral(isConst) {
    const token = this._lexer.token;
    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);
      case TokenKind.BRACE_L:
        return this.parseObject(isConst);
      case TokenKind.INT:
        this.advanceLexer();
        return this.node(token, {
          kind: Kind.INT,
          value: token.value
        });
      case TokenKind.FLOAT:
        this.advanceLexer();
        return this.node(token, {
          kind: Kind.FLOAT,
          value: token.value
        });
      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();
      case TokenKind.NAME:
        this.advanceLexer();
        switch (token.value) {
          case "true":
            return this.node(token, {
              kind: Kind.BOOLEAN,
              value: true
            });
          case "false":
            return this.node(token, {
              kind: Kind.BOOLEAN,
              value: false
            });
          case "null":
            return this.node(token, {
              kind: Kind.NULL
            });
          default:
            return this.node(token, {
              kind: Kind.ENUM,
              value: token.value
            });
        }
      case TokenKind.DOLLAR:
        if (isConst) {
          this.expectToken(TokenKind.DOLLAR);
          if (this._lexer.token.kind === TokenKind.NAME) {
            const varName = this._lexer.token.value;
            throw syntaxError(
              this._lexer.source,
              token.start,
              `Unexpected variable "$${varName}" in constant value.`
            );
          } else {
            throw this.unexpected(token);
          }
        }
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(true);
  }
  parseStringLiteral() {
    const token = this._lexer.token;
    this.advanceLexer();
    return this.node(token, {
      kind: Kind.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING
    });
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  parseList(isConst) {
    const item = () => this.parseValueLiteral(isConst);
    return this.node(this._lexer.token, {
      kind: Kind.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
    });
  }
  /**
   * ```
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   * ```
   */
  parseObject(isConst) {
    const item = () => this.parseObjectField(isConst);
    return this.node(this._lexer.token, {
      kind: Kind.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(isConst) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: Kind.OBJECT_FIELD,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  // Implements the parsing rules in the Directives section.
  /**
   * Directives[Const] : Directive[?Const]+
   */
  parseDirectives(isConst) {
    const directives = [];
    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }
    return directives;
  }
  parseConstDirectives() {
    return this.parseDirectives(true);
  }
  /**
   * ```
   * Directive[Const] : @ Name Arguments[?Const]?
   * ```
   */
  parseDirective(isConst) {
    const start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return this.node(start, {
      kind: Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst)
    });
  }
  // Implements the parsing rules in the Types section.
  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  parseTypeReference() {
    const start = this._lexer.token;
    let type;
    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      const innerType = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = this.node(start, {
        kind: Kind.LIST_TYPE,
        type: innerType
      });
    } else {
      type = this.parseNamedType();
    }
    if (this.expectOptionalToken(TokenKind.BANG)) {
      return this.node(start, {
        kind: Kind.NON_NULL_TYPE,
        type
      });
    }
    return type;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: Kind.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  /**
   * ```
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   * ```
   */
  parseSchemaDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.many(
      TokenKind.BRACE_L,
      this.parseOperationTypeDefinition,
      TokenKind.BRACE_R
    );
    return this.node(start, {
      kind: Kind.SCHEMA_DEFINITION,
      description,
      directives,
      operationTypes
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const start = this._lexer.token;
    const operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    const type = this.parseNamedType();
    return this.node(start, {
      kind: Kind.OPERATION_TYPE_DEFINITION,
      operation,
      type
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.SCALAR_TYPE_DEFINITION,
      description,
      name,
      directives
    });
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  parseObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: Kind.OBJECT_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      TokenKind.BRACE_L,
      this.parseFieldDefinition,
      TokenKind.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.FIELD_DEFINITION,
      description,
      name,
      arguments: args,
      type,
      directives
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      TokenKind.PAREN_L,
      this.parseInputValueDef,
      TokenKind.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    let defaultValue;
    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseConstValueLiteral();
    }
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.INPUT_VALUE_DEFINITION,
      description,
      name,
      type,
      defaultValue,
      directives
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: Kind.INTERFACE_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    return this.node(start, {
      kind: Kind.UNION_TYPE_DEFINITION,
      description,
      name,
      directives,
      types
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    return this.node(start, {
      kind: Kind.ENUM_TYPE_DEFINITION,
      description,
      name,
      directives,
      values
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */
  parseEnumValuesDefinition() {
    return this.optionalMany(
      TokenKind.BRACE_L,
      this.parseEnumValueDefinition,
      TokenKind.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseEnumValueName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.ENUM_VALUE_DEFINITION,
      description,
      name,
      directives
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
      throw syntaxError(
        this._lexer.source,
        this._lexer.token.start,
        `${getTokenDesc(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    }
    return this.parseName();
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  parseInputObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    return this.node(start, {
      kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description,
      name,
      directives,
      fields
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */
  parseInputFieldsDefinition() {
    return this.optionalMany(
      TokenKind.BRACE_L,
      this.parseInputValueDef,
      TokenKind.BRACE_R
    );
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  parseTypeSystemExtension() {
    const keywordToken = this._lexer.lookahead();
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  /**
   * ```
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   * ```
   */
  parseSchemaExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.optionalMany(
      TokenKind.BRACE_L,
      this.parseOperationTypeDefinition,
      TokenKind.BRACE_R
    );
    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.SCHEMA_EXTENSION,
      directives,
      operationTypes
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    if (directives.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.SCALAR_TYPE_EXTENSION,
      name,
      directives
    });
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  parseObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.OBJECT_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  parseInterfaceTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.INTERFACE_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  parseUnionTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.UNION_TYPE_EXTENSION,
      name,
      directives,
      types
    });
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  parseEnumTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.ENUM_TYPE_EXTENSION,
      name,
      directives,
      values
    });
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  parseInputObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name,
      directives,
      fields
    });
  }
  /**
   * ```
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   * ```
   */
  parseDirectiveDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    const repeatable = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const locations = this.parseDirectiveLocations();
    return this.node(start, {
      kind: Kind.DIRECTIVE_DEFINITION,
      description,
      name,
      arguments: args,
      repeatable,
      locations
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  parseDirectiveLocation() {
    const start = this._lexer.token;
    const name = this.parseName();
    if (Object.prototype.hasOwnProperty.call(DirectiveLocation, name.value)) {
      return name;
    }
    throw this.unexpected(start);
  }
  // Core parsing utility functions
  /**
   * Returns a node that, if configured to do so, sets a "loc" field as a
   * location object, used to identify the place in the source that created a
   * given parsed object.
   */
  node(startToken, node) {
    if (this._options.noLocation !== true) {
      node.loc = new Location(
        startToken,
        this._lexer.lastToken,
        this._lexer.source
      );
    }
    return node;
  }
  /**
   * Determines if the next token is of a given kind
   */
  peek(kind) {
    return this._lexer.token.kind === kind;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return token;
    }
    throw syntaxError(
      this._lexer.source,
      token.start,
      `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`
    );
  }
  /**
   * If the next token is of the given kind, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
    } else {
      throw syntaxError(
        this._lexer.source,
        token.start,
        `Expected "${value}", found ${getTokenDesc(token)}.`
      );
    }
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(atToken) {
    const token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return syntaxError(
      this._lexer.source,
      token.start,
      `Unexpected ${getTokenDesc(token)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }
    return nodes;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));
    return nodes;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));
    return nodes;
  }
  advanceLexer() {
    const { maxTokens } = this._options;
    const token = this._lexer.advance();
    if (token.kind !== TokenKind.EOF) {
      ++this._tokenCounter;
      if (maxTokens !== void 0 && this._tokenCounter > maxTokens) {
        throw syntaxError(
          this._lexer.source,
          token.start,
          `Document contains more that ${maxTokens} tokens. Parsing aborted.`
        );
      }
    }
  }
};
function getTokenDesc(token) {
  const value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
}
function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
}

// node_modules/graphql/jsutils/didYouMean.mjs
var MAX_SUGGESTIONS = 5;
function didYouMean(firstArg, secondArg) {
  const [subMessage, suggestionsArg] = secondArg ? [firstArg, secondArg] : [void 0, firstArg];
  let message = " Did you mean ";
  if (subMessage) {
    message += subMessage + " ";
  }
  const suggestions = suggestionsArg.map((x) => `"${x}"`);
  switch (suggestions.length) {
    case 0:
      return "";
    case 1:
      return message + suggestions[0] + "?";
    case 2:
      return message + suggestions[0] + " or " + suggestions[1] + "?";
  }
  const selected = suggestions.slice(0, MAX_SUGGESTIONS);
  const lastItem = selected.pop();
  return message + selected.join(", ") + ", or " + lastItem + "?";
}

// node_modules/graphql/jsutils/identityFunc.mjs
function identityFunc(x) {
  return x;
}

// node_modules/graphql/jsutils/keyMap.mjs
function keyMap(list, keyFn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const item of list) {
    result[keyFn(item)] = item;
  }
  return result;
}

// node_modules/graphql/jsutils/keyValMap.mjs
function keyValMap(list, keyFn, valFn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const item of list) {
    result[keyFn(item)] = valFn(item);
  }
  return result;
}

// node_modules/graphql/jsutils/mapValue.mjs
function mapValue(map2, fn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(map2)) {
    result[key] = fn(map2[key], key);
  }
  return result;
}

// node_modules/graphql/jsutils/naturalCompare.mjs
function naturalCompare(aStr, bStr) {
  let aIndex = 0;
  let bIndex = 0;
  while (aIndex < aStr.length && bIndex < bStr.length) {
    let aChar = aStr.charCodeAt(aIndex);
    let bChar = bStr.charCodeAt(bIndex);
    if (isDigit2(aChar) && isDigit2(bChar)) {
      let aNum = 0;
      do {
        ++aIndex;
        aNum = aNum * 10 + aChar - DIGIT_0;
        aChar = aStr.charCodeAt(aIndex);
      } while (isDigit2(aChar) && aNum > 0);
      let bNum = 0;
      do {
        ++bIndex;
        bNum = bNum * 10 + bChar - DIGIT_0;
        bChar = bStr.charCodeAt(bIndex);
      } while (isDigit2(bChar) && bNum > 0);
      if (aNum < bNum) {
        return -1;
      }
      if (aNum > bNum) {
        return 1;
      }
    } else {
      if (aChar < bChar) {
        return -1;
      }
      if (aChar > bChar) {
        return 1;
      }
      ++aIndex;
      ++bIndex;
    }
  }
  return aStr.length - bStr.length;
}
var DIGIT_0 = 48;
var DIGIT_9 = 57;
function isDigit2(code) {
  return !isNaN(code) && DIGIT_0 <= code && code <= DIGIT_9;
}

// node_modules/graphql/jsutils/suggestionList.mjs
function suggestionList(input, options) {
  const optionsByDistance = /* @__PURE__ */ Object.create(null);
  const lexicalDistance = new LexicalDistance(input);
  const threshold = Math.floor(input.length * 0.4) + 1;
  for (const option of options) {
    const distance = lexicalDistance.measure(option, threshold);
    if (distance !== void 0) {
      optionsByDistance[option] = distance;
    }
  }
  return Object.keys(optionsByDistance).sort((a, b) => {
    const distanceDiff = optionsByDistance[a] - optionsByDistance[b];
    return distanceDiff !== 0 ? distanceDiff : naturalCompare(a, b);
  });
}
var LexicalDistance = class {
  constructor(input) {
    this._input = input;
    this._inputLowerCase = input.toLowerCase();
    this._inputArray = stringToArray(this._inputLowerCase);
    this._rows = [
      new Array(input.length + 1).fill(0),
      new Array(input.length + 1).fill(0),
      new Array(input.length + 1).fill(0)
    ];
  }
  measure(option, threshold) {
    if (this._input === option) {
      return 0;
    }
    const optionLowerCase = option.toLowerCase();
    if (this._inputLowerCase === optionLowerCase) {
      return 1;
    }
    let a = stringToArray(optionLowerCase);
    let b = this._inputArray;
    if (a.length < b.length) {
      const tmp = a;
      a = b;
      b = tmp;
    }
    const aLength = a.length;
    const bLength = b.length;
    if (aLength - bLength > threshold) {
      return void 0;
    }
    const rows = this._rows;
    for (let j = 0; j <= bLength; j++) {
      rows[0][j] = j;
    }
    for (let i = 1; i <= aLength; i++) {
      const upRow = rows[(i - 1) % 3];
      const currentRow = rows[i % 3];
      let smallestCell = currentRow[0] = i;
      for (let j = 1; j <= bLength; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let currentCell = Math.min(
          upRow[j] + 1,
          // delete
          currentRow[j - 1] + 1,
          // insert
          upRow[j - 1] + cost
          // substitute
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          const doubleDiagonalCell = rows[(i - 2) % 3][j - 2];
          currentCell = Math.min(currentCell, doubleDiagonalCell + 1);
        }
        if (currentCell < smallestCell) {
          smallestCell = currentCell;
        }
        currentRow[j] = currentCell;
      }
      if (smallestCell > threshold) {
        return void 0;
      }
    }
    const distance = rows[aLength % 3][bLength];
    return distance <= threshold ? distance : void 0;
  }
};
function stringToArray(str) {
  const strLength = str.length;
  const array = new Array(strLength);
  for (let i = 0; i < strLength; ++i) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}

// node_modules/graphql/jsutils/toObjMap.mjs
function toObjMap(obj) {
  if (obj == null) {
    return /* @__PURE__ */ Object.create(null);
  }
  if (Object.getPrototypeOf(obj) === null) {
    return obj;
  }
  const map2 = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of Object.entries(obj)) {
    map2[key] = value;
  }
  return map2;
}

// node_modules/graphql/language/printString.mjs
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
}
var escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
}
var escapeSequences = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
];

// node_modules/graphql/language/visitor.mjs
var BREAK = Object.freeze({});
function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
  const enterLeaveMap = /* @__PURE__ */ new Map();
  for (const kind of Object.values(Kind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }
  let stack = void 0;
  let inArray = Array.isArray(root);
  let keys = [root];
  let index = -1;
  let edits = [];
  let node = root;
  let key = void 0;
  let parent = void 0;
  const path = [];
  const ancestors = [];
  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? void 0 : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
          let editOffset = 0;
          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;
            if (editValue === null) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = { ...node };
          for (const [editKey, editValue] of edits) {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else if (parent) {
      key = inArray ? index : keys[index];
      node = parent[key];
      if (node === null || node === void 0) {
        continue;
      }
      path.push(key);
    }
    let result;
    if (!Array.isArray(node)) {
      var _enterLeaveMap$get, _enterLeaveMap$get2;
      isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
      const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
      result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path, ancestors);
      if (result === BREAK) {
        break;
      }
      if (result === false) {
        if (!isLeaving) {
          path.pop();
          continue;
        }
      } else if (result !== void 0) {
        edits.push([key, result]);
        if (!isLeaving) {
          if (isNode(result)) {
            node = result;
          } else {
            path.pop();
            continue;
          }
        }
      }
    }
    if (result === void 0 && isEdited) {
      edits.push([key, node]);
    }
    if (isLeaving) {
      path.pop();
    } else {
      var _node$kind;
      stack = {
        inArray,
        index,
        keys,
        edits,
        prev: stack
      };
      inArray = Array.isArray(node);
      keys = inArray ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== void 0);
  if (edits.length !== 0) {
    return edits[edits.length - 1][1];
  }
  return root;
}
function getEnterLeaveForKind(visitor, kind) {
  const kindVisitor = visitor[kind];
  if (typeof kindVisitor === "object") {
    return kindVisitor;
  } else if (typeof kindVisitor === "function") {
    return {
      enter: kindVisitor,
      leave: void 0
    };
  }
  return {
    enter: visitor.enter,
    leave: visitor.leave
  };
}

// node_modules/graphql/language/printer.mjs
function print(ast) {
  return visit(ast, printDocASTReducer);
}
var MAX_LINE_LENGTH = 80;
var printDocASTReducer = {
  Name: {
    leave: (node) => node.value
  },
  Variable: {
    leave: (node) => "$" + node.name
  },
  // Document
  Document: {
    leave: (node) => join(node.definitions, "\n\n")
  },
  OperationDefinition: {
    leave(node) {
      const varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
      const prefix = join(
        [
          node.operation,
          join([node.name, varDefs]),
          join(node.directives, " ")
        ],
        " "
      );
      return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " "))
  },
  SelectionSet: {
    leave: ({ selections }) => block(selections)
  },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap("", alias, ": ") + name;
      let argsLine = prefix + wrap("(", join(args, ", "), ")");
      if (argsLine.length > MAX_LINE_LENGTH) {
        argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
      }
      return join([argsLine, join(directives, " "), selectionSet], " ");
    }
  },
  Argument: {
    leave: ({ name, value }) => name + ": " + value
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name, directives }) => "..." + name + wrap(" ", join(directives, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition, directives, selectionSet }) => join(
      [
        "...",
        wrap("on ", typeCondition),
        join(directives, " "),
        selectionSet
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name, typeCondition, variableDefinitions, directives, selectionSet }) => (
      // or removed in the future.
      `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
    )
  },
  // Value
  IntValue: {
    leave: ({ value }) => value
  },
  FloatValue: {
    leave: ({ value }) => value
  },
  StringValue: {
    leave: ({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value)
  },
  BooleanValue: {
    leave: ({ value }) => value ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value }) => value
  },
  ListValue: {
    leave: ({ values }) => "[" + join(values, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields }) => "{" + join(fields, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name, value }) => name + ": " + value
  },
  // Directive
  Directive: {
    leave: ({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")")
  },
  // Type
  NamedType: {
    leave: ({ name }) => name
  },
  ListType: {
    leave: ({ type }) => "[" + type + "]"
  },
  NonNullType: {
    leave: ({ type }) => type + "!"
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description, directives, operationTypes }) => wrap("", description, "\n") + join(["schema", join(directives, " "), block(operationTypes)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation, type }) => operation + ": " + type
  },
  ScalarTypeDefinition: {
    leave: ({ description, name, directives }) => wrap("", description, "\n") + join(["scalar", name, join(directives, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
      [
        "type",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " "))
  },
  InputValueDefinition: {
    leave: ({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join(
      [name + ": " + type, wrap("= ", defaultValue), join(directives, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
      [
        "interface",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description, name, directives, types }) => wrap("", description, "\n") + join(
      ["union", name, join(directives, " "), wrap("= ", join(types, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description, name, directives, values }) => wrap("", description, "\n") + join(["enum", name, join(directives, " "), block(values)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description, name, directives, fields }) => wrap("", description, "\n") + join(["input", name, join(directives, " "), block(fields)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description, name, arguments: args, repeatable, locations }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ")
  },
  SchemaExtension: {
    leave: ({ directives, operationTypes }) => join(
      ["extend schema", join(directives, " "), block(operationTypes)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name, directives }) => join(["extend scalar", name, join(directives, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) => join(
      [
        "extend type",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) => join(
      [
        "extend interface",
        name,
        wrap("implements ", join(interfaces, " & ")),
        join(directives, " "),
        block(fields)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name, directives, types }) => join(
      [
        "extend union",
        name,
        join(directives, " "),
        wrap("= ", join(types, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name, directives, values }) => join(["extend enum", name, join(directives, " "), block(values)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name, directives, fields }) => join(["extend input", name, join(directives, " "), block(fields)], " ")
  }
};
function join(maybeArray, separator = "") {
  var _maybeArray$filter$jo;
  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
}
function block(array) {
  return wrap("{\n", indent(join(array, "\n")), "\n}");
}
function wrap(start, maybeString, end = "") {
  return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
}
function indent(str) {
  return wrap("  ", str.replace(/\n/g, "\n  "));
}
function hasMultilineItems(maybeArray) {
  var _maybeArray$some;
  return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
}

// node_modules/graphql/utilities/valueFromASTUntyped.mjs
function valueFromASTUntyped(valueNode, variables) {
  switch (valueNode.kind) {
    case Kind.NULL:
      return null;
    case Kind.INT:
      return parseInt(valueNode.value, 10);
    case Kind.FLOAT:
      return parseFloat(valueNode.value);
    case Kind.STRING:
    case Kind.ENUM:
    case Kind.BOOLEAN:
      return valueNode.value;
    case Kind.LIST:
      return valueNode.values.map(
        (node) => valueFromASTUntyped(node, variables)
      );
    case Kind.OBJECT:
      return keyValMap(
        valueNode.fields,
        (field) => field.name.value,
        (field) => valueFromASTUntyped(field.value, variables)
      );
    case Kind.VARIABLE:
      return variables === null || variables === void 0 ? void 0 : variables[valueNode.name.value];
  }
}

// node_modules/graphql/type/assertName.mjs
function assertName(name) {
  name != null || devAssert(false, "Must provide name.");
  typeof name === "string" || devAssert(false, "Expected name to be a string.");
  if (name.length === 0) {
    throw new GraphQLError("Expected name to be a non-empty string.");
  }
  for (let i = 1; i < name.length; ++i) {
    if (!isNameContinue(name.charCodeAt(i))) {
      throw new GraphQLError(
        `Names must only contain [_a-zA-Z0-9] but "${name}" does not.`
      );
    }
  }
  if (!isNameStart(name.charCodeAt(0))) {
    throw new GraphQLError(
      `Names must start with [_a-zA-Z] but "${name}" does not.`
    );
  }
  return name;
}
function assertEnumValueName(name) {
  if (name === "true" || name === "false" || name === "null") {
    throw new GraphQLError(`Enum values cannot be named: ${name}`);
  }
  return assertName(name);
}

// node_modules/graphql/type/definition.mjs
function isType(type) {
  return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type) || isListType(type) || isNonNullType(type);
}
function isScalarType(type) {
  return instanceOf(type, GraphQLScalarType);
}
function isObjectType(type) {
  return instanceOf(type, GraphQLObjectType);
}
function isInterfaceType(type) {
  return instanceOf(type, GraphQLInterfaceType);
}
function isUnionType(type) {
  return instanceOf(type, GraphQLUnionType);
}
function isEnumType(type) {
  return instanceOf(type, GraphQLEnumType);
}
function isInputObjectType(type) {
  return instanceOf(type, GraphQLInputObjectType);
}
function isListType(type) {
  return instanceOf(type, GraphQLList);
}
function isNonNullType(type) {
  return instanceOf(type, GraphQLNonNull);
}
function isInputType(type) {
  return isScalarType(type) || isEnumType(type) || isInputObjectType(type) || isWrappingType(type) && isInputType(type.ofType);
}
function isLeafType(type) {
  return isScalarType(type) || isEnumType(type);
}
function isCompositeType(type) {
  return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
}
function isAbstractType(type) {
  return isInterfaceType(type) || isUnionType(type);
}
var GraphQLList = class {
  constructor(ofType) {
    isType(ofType) || devAssert(false, `Expected ${inspect(ofType)} to be a GraphQL type.`);
    this.ofType = ofType;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLList";
  }
  toString() {
    return "[" + String(this.ofType) + "]";
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLNonNull = class {
  constructor(ofType) {
    isNullableType(ofType) || devAssert(
      false,
      `Expected ${inspect(ofType)} to be a GraphQL nullable type.`
    );
    this.ofType = ofType;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLNonNull";
  }
  toString() {
    return String(this.ofType) + "!";
  }
  toJSON() {
    return this.toString();
  }
};
function isWrappingType(type) {
  return isListType(type) || isNonNullType(type);
}
function isNullableType(type) {
  return isType(type) && !isNonNullType(type);
}
function getNullableType(type) {
  if (type) {
    return isNonNullType(type) ? type.ofType : type;
  }
}
function getNamedType(type) {
  if (type) {
    let unwrappedType = type;
    while (isWrappingType(unwrappedType)) {
      unwrappedType = unwrappedType.ofType;
    }
    return unwrappedType;
  }
}
function resolveReadonlyArrayThunk(thunk) {
  return typeof thunk === "function" ? thunk() : thunk;
}
function resolveObjMapThunk(thunk) {
  return typeof thunk === "function" ? thunk() : thunk;
}
var GraphQLScalarType = class {
  constructor(config2) {
    var _config$parseValue, _config$serialize, _config$parseLiteral, _config$extensionASTN;
    const parseValue2 = (_config$parseValue = config2.parseValue) !== null && _config$parseValue !== void 0 ? _config$parseValue : identityFunc;
    this.name = assertName(config2.name);
    this.description = config2.description;
    this.specifiedByURL = config2.specifiedByURL;
    this.serialize = (_config$serialize = config2.serialize) !== null && _config$serialize !== void 0 ? _config$serialize : identityFunc;
    this.parseValue = parseValue2;
    this.parseLiteral = (_config$parseLiteral = config2.parseLiteral) !== null && _config$parseLiteral !== void 0 ? _config$parseLiteral : (node, variables) => parseValue2(valueFromASTUntyped(node, variables));
    this.extensions = toObjMap(config2.extensions);
    this.astNode = config2.astNode;
    this.extensionASTNodes = (_config$extensionASTN = config2.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
    config2.specifiedByURL == null || typeof config2.specifiedByURL === "string" || devAssert(
      false,
      `${this.name} must provide "specifiedByURL" as a string, but got: ${inspect(config2.specifiedByURL)}.`
    );
    config2.serialize == null || typeof config2.serialize === "function" || devAssert(
      false,
      `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`
    );
    if (config2.parseLiteral) {
      typeof config2.parseValue === "function" && typeof config2.parseLiteral === "function" || devAssert(
        false,
        `${this.name} must provide both "parseValue" and "parseLiteral" functions.`
      );
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLScalarType";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      specifiedByURL: this.specifiedByURL,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLObjectType = class {
  constructor(config2) {
    var _config$extensionASTN2;
    this.name = assertName(config2.name);
    this.description = config2.description;
    this.isTypeOf = config2.isTypeOf;
    this.extensions = toObjMap(config2.extensions);
    this.astNode = config2.astNode;
    this.extensionASTNodes = (_config$extensionASTN2 = config2.extensionASTNodes) !== null && _config$extensionASTN2 !== void 0 ? _config$extensionASTN2 : [];
    this._fields = () => defineFieldMap(config2);
    this._interfaces = () => defineInterfaces(config2);
    config2.isTypeOf == null || typeof config2.isTypeOf === "function" || devAssert(
      false,
      `${this.name} must provide "isTypeOf" as a function, but got: ${inspect(config2.isTypeOf)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLObjectType";
  }
  getFields() {
    if (typeof this._fields === "function") {
      this._fields = this._fields();
    }
    return this._fields;
  }
  getInterfaces() {
    if (typeof this._interfaces === "function") {
      this._interfaces = this._interfaces();
    }
    return this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function defineInterfaces(config2) {
  var _config$interfaces;
  const interfaces = resolveReadonlyArrayThunk(
    (_config$interfaces = config2.interfaces) !== null && _config$interfaces !== void 0 ? _config$interfaces : []
  );
  Array.isArray(interfaces) || devAssert(
    false,
    `${config2.name} interfaces must be an Array or a function which returns an Array.`
  );
  return interfaces;
}
function defineFieldMap(config2) {
  const fieldMap = resolveObjMapThunk(config2.fields);
  isPlainObj(fieldMap) || devAssert(
    false,
    `${config2.name} fields must be an object with field names as keys or a function which returns such an object.`
  );
  return mapValue(fieldMap, (fieldConfig, fieldName) => {
    var _fieldConfig$args;
    isPlainObj(fieldConfig) || devAssert(
      false,
      `${config2.name}.${fieldName} field config must be an object.`
    );
    fieldConfig.resolve == null || typeof fieldConfig.resolve === "function" || devAssert(
      false,
      `${config2.name}.${fieldName} field resolver must be a function if provided, but got: ${inspect(fieldConfig.resolve)}.`
    );
    const argsConfig = (_fieldConfig$args = fieldConfig.args) !== null && _fieldConfig$args !== void 0 ? _fieldConfig$args : {};
    isPlainObj(argsConfig) || devAssert(
      false,
      `${config2.name}.${fieldName} args must be an object with argument names as keys.`
    );
    return {
      name: assertName(fieldName),
      description: fieldConfig.description,
      type: fieldConfig.type,
      args: defineArguments(argsConfig),
      resolve: fieldConfig.resolve,
      subscribe: fieldConfig.subscribe,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: toObjMap(fieldConfig.extensions),
      astNode: fieldConfig.astNode
    };
  });
}
function defineArguments(config2) {
  return Object.entries(config2).map(([argName, argConfig]) => ({
    name: assertName(argName),
    description: argConfig.description,
    type: argConfig.type,
    defaultValue: argConfig.defaultValue,
    deprecationReason: argConfig.deprecationReason,
    extensions: toObjMap(argConfig.extensions),
    astNode: argConfig.astNode
  }));
}
function isPlainObj(obj) {
  return isObjectLike(obj) && !Array.isArray(obj);
}
function fieldsToFieldsConfig(fields) {
  return mapValue(fields, (field) => ({
    description: field.description,
    type: field.type,
    args: argsToArgsConfig(field.args),
    resolve: field.resolve,
    subscribe: field.subscribe,
    deprecationReason: field.deprecationReason,
    extensions: field.extensions,
    astNode: field.astNode
  }));
}
function argsToArgsConfig(args) {
  return keyValMap(
    args,
    (arg) => arg.name,
    (arg) => ({
      description: arg.description,
      type: arg.type,
      defaultValue: arg.defaultValue,
      deprecationReason: arg.deprecationReason,
      extensions: arg.extensions,
      astNode: arg.astNode
    })
  );
}
function isRequiredArgument(arg) {
  return isNonNullType(arg.type) && arg.defaultValue === void 0;
}
var GraphQLInterfaceType = class {
  constructor(config2) {
    var _config$extensionASTN3;
    this.name = assertName(config2.name);
    this.description = config2.description;
    this.resolveType = config2.resolveType;
    this.extensions = toObjMap(config2.extensions);
    this.astNode = config2.astNode;
    this.extensionASTNodes = (_config$extensionASTN3 = config2.extensionASTNodes) !== null && _config$extensionASTN3 !== void 0 ? _config$extensionASTN3 : [];
    this._fields = defineFieldMap.bind(void 0, config2);
    this._interfaces = defineInterfaces.bind(void 0, config2);
    config2.resolveType == null || typeof config2.resolveType === "function" || devAssert(
      false,
      `${this.name} must provide "resolveType" as a function, but got: ${inspect(config2.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInterfaceType";
  }
  getFields() {
    if (typeof this._fields === "function") {
      this._fields = this._fields();
    }
    return this._fields;
  }
  getInterfaces() {
    if (typeof this._interfaces === "function") {
      this._interfaces = this._interfaces();
    }
    return this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: fieldsToFieldsConfig(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLUnionType = class {
  constructor(config2) {
    var _config$extensionASTN4;
    this.name = assertName(config2.name);
    this.description = config2.description;
    this.resolveType = config2.resolveType;
    this.extensions = toObjMap(config2.extensions);
    this.astNode = config2.astNode;
    this.extensionASTNodes = (_config$extensionASTN4 = config2.extensionASTNodes) !== null && _config$extensionASTN4 !== void 0 ? _config$extensionASTN4 : [];
    this._types = defineTypes.bind(void 0, config2);
    config2.resolveType == null || typeof config2.resolveType === "function" || devAssert(
      false,
      `${this.name} must provide "resolveType" as a function, but got: ${inspect(config2.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLUnionType";
  }
  getTypes() {
    if (typeof this._types === "function") {
      this._types = this._types();
    }
    return this._types;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function defineTypes(config2) {
  const types = resolveReadonlyArrayThunk(config2.types);
  Array.isArray(types) || devAssert(
    false,
    `Must provide Array of types or a function which returns such an array for Union ${config2.name}.`
  );
  return types;
}
var GraphQLEnumType = class {
  /* <T> */
  constructor(config2) {
    var _config$extensionASTN5;
    this.name = assertName(config2.name);
    this.description = config2.description;
    this.extensions = toObjMap(config2.extensions);
    this.astNode = config2.astNode;
    this.extensionASTNodes = (_config$extensionASTN5 = config2.extensionASTNodes) !== null && _config$extensionASTN5 !== void 0 ? _config$extensionASTN5 : [];
    this._values = typeof config2.values === "function" ? config2.values : defineEnumValues(this.name, config2.values);
    this._valueLookup = null;
    this._nameLookup = null;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLEnumType";
  }
  getValues() {
    if (typeof this._values === "function") {
      this._values = defineEnumValues(this.name, this._values());
    }
    return this._values;
  }
  getValue(name) {
    if (this._nameLookup === null) {
      this._nameLookup = keyMap(this.getValues(), (value) => value.name);
    }
    return this._nameLookup[name];
  }
  serialize(outputValue) {
    if (this._valueLookup === null) {
      this._valueLookup = new Map(
        this.getValues().map((enumValue2) => [enumValue2.value, enumValue2])
      );
    }
    const enumValue = this._valueLookup.get(outputValue);
    if (enumValue === void 0) {
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent value: ${inspect(outputValue)}`
      );
    }
    return enumValue.name;
  }
  parseValue(inputValue) {
    if (typeof inputValue !== "string") {
      const valueStr = inspect(inputValue);
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent non-string value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr)
      );
    }
    const enumValue = this.getValue(inputValue);
    if (enumValue == null) {
      throw new GraphQLError(
        `Value "${inputValue}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, inputValue)
      );
    }
    return enumValue.value;
  }
  parseLiteral(valueNode, _variables) {
    if (valueNode.kind !== Kind.ENUM) {
      const valueStr = print(valueNode);
      throw new GraphQLError(
        `Enum "${this.name}" cannot represent non-enum value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr),
        {
          nodes: valueNode
        }
      );
    }
    const enumValue = this.getValue(valueNode.value);
    if (enumValue == null) {
      const valueStr = print(valueNode);
      throw new GraphQLError(
        `Value "${valueStr}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, valueStr),
        {
          nodes: valueNode
        }
      );
    }
    return enumValue.value;
  }
  toConfig() {
    const values = keyValMap(
      this.getValues(),
      (value) => value.name,
      (value) => ({
        description: value.description,
        value: value.value,
        deprecationReason: value.deprecationReason,
        extensions: value.extensions,
        astNode: value.astNode
      })
    );
    return {
      name: this.name,
      description: this.description,
      values,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function didYouMeanEnumValue(enumType, unknownValueStr) {
  const allNames = enumType.getValues().map((value) => value.name);
  const suggestedValues = suggestionList(unknownValueStr, allNames);
  return didYouMean("the enum value", suggestedValues);
}
function defineEnumValues(typeName, valueMap) {
  isPlainObj(valueMap) || devAssert(
    false,
    `${typeName} values must be an object with value names as keys.`
  );
  return Object.entries(valueMap).map(([valueName, valueConfig]) => {
    isPlainObj(valueConfig) || devAssert(
      false,
      `${typeName}.${valueName} must refer to an object with a "value" key representing an internal value but got: ${inspect(valueConfig)}.`
    );
    return {
      name: assertEnumValueName(valueName),
      description: valueConfig.description,
      value: valueConfig.value !== void 0 ? valueConfig.value : valueName,
      deprecationReason: valueConfig.deprecationReason,
      extensions: toObjMap(valueConfig.extensions),
      astNode: valueConfig.astNode
    };
  });
}
var GraphQLInputObjectType = class {
  constructor(config2) {
    var _config$extensionASTN6, _config$isOneOf;
    this.name = assertName(config2.name);
    this.description = config2.description;
    this.extensions = toObjMap(config2.extensions);
    this.astNode = config2.astNode;
    this.extensionASTNodes = (_config$extensionASTN6 = config2.extensionASTNodes) !== null && _config$extensionASTN6 !== void 0 ? _config$extensionASTN6 : [];
    this.isOneOf = (_config$isOneOf = config2.isOneOf) !== null && _config$isOneOf !== void 0 ? _config$isOneOf : false;
    this._fields = defineInputFieldMap.bind(void 0, config2);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInputObjectType";
  }
  getFields() {
    if (typeof this._fields === "function") {
      this._fields = this._fields();
    }
    return this._fields;
  }
  toConfig() {
    const fields = mapValue(this.getFields(), (field) => ({
      description: field.description,
      type: field.type,
      defaultValue: field.defaultValue,
      deprecationReason: field.deprecationReason,
      extensions: field.extensions,
      astNode: field.astNode
    }));
    return {
      name: this.name,
      description: this.description,
      fields,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      isOneOf: this.isOneOf
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
};
function defineInputFieldMap(config2) {
  const fieldMap = resolveObjMapThunk(config2.fields);
  isPlainObj(fieldMap) || devAssert(
    false,
    `${config2.name} fields must be an object with field names as keys or a function which returns such an object.`
  );
  return mapValue(fieldMap, (fieldConfig, fieldName) => {
    !("resolve" in fieldConfig) || devAssert(
      false,
      `${config2.name}.${fieldName} field has a resolve property, but Input Types cannot define resolvers.`
    );
    return {
      name: assertName(fieldName),
      description: fieldConfig.description,
      type: fieldConfig.type,
      defaultValue: fieldConfig.defaultValue,
      deprecationReason: fieldConfig.deprecationReason,
      extensions: toObjMap(fieldConfig.extensions),
      astNode: fieldConfig.astNode
    };
  });
}
function isRequiredInputField(field) {
  return isNonNullType(field.type) && field.defaultValue === void 0;
}

// node_modules/graphql/utilities/typeComparators.mjs
function isTypeSubTypeOf(schema, maybeSubType, superType) {
  if (maybeSubType === superType) {
    return true;
  }
  if (isNonNullType(superType)) {
    if (isNonNullType(maybeSubType)) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }
    return false;
  }
  if (isNonNullType(maybeSubType)) {
    return isTypeSubTypeOf(schema, maybeSubType.ofType, superType);
  }
  if (isListType(superType)) {
    if (isListType(maybeSubType)) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }
    return false;
  }
  if (isListType(maybeSubType)) {
    return false;
  }
  return isAbstractType(superType) && (isInterfaceType(maybeSubType) || isObjectType(maybeSubType)) && schema.isSubType(superType, maybeSubType);
}
function doTypesOverlap(schema, typeA, typeB) {
  if (typeA === typeB) {
    return true;
  }
  if (isAbstractType(typeA)) {
    if (isAbstractType(typeB)) {
      return schema.getPossibleTypes(typeA).some((type) => schema.isSubType(typeB, type));
    }
    return schema.isSubType(typeA, typeB);
  }
  if (isAbstractType(typeB)) {
    return schema.isSubType(typeB, typeA);
  }
  return false;
}

// node_modules/graphql/type/scalars.mjs
var GRAPHQL_MAX_INT = 2147483647;
var GRAPHQL_MIN_INT = -2147483648;
var GraphQLInt = new GraphQLScalarType({
  name: "Int",
  description: "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "boolean") {
      return coercedValue ? 1 : 0;
    }
    let num = coercedValue;
    if (typeof coercedValue === "string" && coercedValue !== "") {
      num = Number(coercedValue);
    }
    if (typeof num !== "number" || !Number.isInteger(num)) {
      throw new GraphQLError(
        `Int cannot represent non-integer value: ${inspect(coercedValue)}`
      );
    }
    if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
      throw new GraphQLError(
        "Int cannot represent non 32-bit signed integer value: " + inspect(coercedValue)
      );
    }
    return num;
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "number" || !Number.isInteger(inputValue)) {
      throw new GraphQLError(
        `Int cannot represent non-integer value: ${inspect(inputValue)}`
      );
    }
    if (inputValue > GRAPHQL_MAX_INT || inputValue < GRAPHQL_MIN_INT) {
      throw new GraphQLError(
        `Int cannot represent non 32-bit signed integer value: ${inputValue}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.INT) {
      throw new GraphQLError(
        `Int cannot represent non-integer value: ${print(valueNode)}`,
        {
          nodes: valueNode
        }
      );
    }
    const num = parseInt(valueNode.value, 10);
    if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
      throw new GraphQLError(
        `Int cannot represent non 32-bit signed integer value: ${valueNode.value}`,
        {
          nodes: valueNode
        }
      );
    }
    return num;
  }
});
var GraphQLFloat = new GraphQLScalarType({
  name: "Float",
  description: "The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "boolean") {
      return coercedValue ? 1 : 0;
    }
    let num = coercedValue;
    if (typeof coercedValue === "string" && coercedValue !== "") {
      num = Number(coercedValue);
    }
    if (typeof num !== "number" || !Number.isFinite(num)) {
      throw new GraphQLError(
        `Float cannot represent non numeric value: ${inspect(coercedValue)}`
      );
    }
    return num;
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "number" || !Number.isFinite(inputValue)) {
      throw new GraphQLError(
        `Float cannot represent non numeric value: ${inspect(inputValue)}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.FLOAT && valueNode.kind !== Kind.INT) {
      throw new GraphQLError(
        `Float cannot represent non numeric value: ${print(valueNode)}`,
        valueNode
      );
    }
    return parseFloat(valueNode.value);
  }
});
var GraphQLString = new GraphQLScalarType({
  name: "String",
  description: "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "string") {
      return coercedValue;
    }
    if (typeof coercedValue === "boolean") {
      return coercedValue ? "true" : "false";
    }
    if (typeof coercedValue === "number" && Number.isFinite(coercedValue)) {
      return coercedValue.toString();
    }
    throw new GraphQLError(
      `String cannot represent value: ${inspect(outputValue)}`
    );
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "string") {
      throw new GraphQLError(
        `String cannot represent a non string value: ${inspect(inputValue)}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.STRING) {
      throw new GraphQLError(
        `String cannot represent a non string value: ${print(valueNode)}`,
        {
          nodes: valueNode
        }
      );
    }
    return valueNode.value;
  }
});
var GraphQLBoolean = new GraphQLScalarType({
  name: "Boolean",
  description: "The `Boolean` scalar type represents `true` or `false`.",
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "boolean") {
      return coercedValue;
    }
    if (Number.isFinite(coercedValue)) {
      return coercedValue !== 0;
    }
    throw new GraphQLError(
      `Boolean cannot represent a non boolean value: ${inspect(coercedValue)}`
    );
  },
  parseValue(inputValue) {
    if (typeof inputValue !== "boolean") {
      throw new GraphQLError(
        `Boolean cannot represent a non boolean value: ${inspect(inputValue)}`
      );
    }
    return inputValue;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.BOOLEAN) {
      throw new GraphQLError(
        `Boolean cannot represent a non boolean value: ${print(valueNode)}`,
        {
          nodes: valueNode
        }
      );
    }
    return valueNode.value;
  }
});
var GraphQLID = new GraphQLScalarType({
  name: "ID",
  description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue);
    if (typeof coercedValue === "string") {
      return coercedValue;
    }
    if (Number.isInteger(coercedValue)) {
      return String(coercedValue);
    }
    throw new GraphQLError(
      `ID cannot represent value: ${inspect(outputValue)}`
    );
  },
  parseValue(inputValue) {
    if (typeof inputValue === "string") {
      return inputValue;
    }
    if (typeof inputValue === "number" && Number.isInteger(inputValue)) {
      return inputValue.toString();
    }
    throw new GraphQLError(`ID cannot represent value: ${inspect(inputValue)}`);
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.STRING && valueNode.kind !== Kind.INT) {
      throw new GraphQLError(
        "ID cannot represent a non-string and non-integer value: " + print(valueNode),
        {
          nodes: valueNode
        }
      );
    }
    return valueNode.value;
  }
});
var specifiedScalarTypes = Object.freeze([
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID
]);
function serializeObject(outputValue) {
  if (isObjectLike(outputValue)) {
    if (typeof outputValue.valueOf === "function") {
      const valueOfResult = outputValue.valueOf();
      if (!isObjectLike(valueOfResult)) {
        return valueOfResult;
      }
    }
    if (typeof outputValue.toJSON === "function") {
      return outputValue.toJSON();
    }
  }
  return outputValue;
}

// node_modules/graphql/type/directives.mjs
var GraphQLDirective = class {
  constructor(config2) {
    var _config$isRepeatable, _config$args;
    this.name = assertName(config2.name);
    this.description = config2.description;
    this.locations = config2.locations;
    this.isRepeatable = (_config$isRepeatable = config2.isRepeatable) !== null && _config$isRepeatable !== void 0 ? _config$isRepeatable : false;
    this.extensions = toObjMap(config2.extensions);
    this.astNode = config2.astNode;
    Array.isArray(config2.locations) || devAssert(false, `@${config2.name} locations must be an Array.`);
    const args = (_config$args = config2.args) !== null && _config$args !== void 0 ? _config$args : {};
    isObjectLike(args) && !Array.isArray(args) || devAssert(
      false,
      `@${config2.name} args must be an object with argument names as keys.`
    );
    this.args = defineArguments(args);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLDirective";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: argsToArgsConfig(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode
    };
  }
  toString() {
    return "@" + this.name;
  }
  toJSON() {
    return this.toString();
  }
};
var GraphQLIncludeDirective = new GraphQLDirective({
  name: "include",
  description: "Directs the executor to include this field or fragment only when the `if` argument is true.",
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.FRAGMENT_SPREAD,
    DirectiveLocation.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Included when true."
    }
  }
});
var GraphQLSkipDirective = new GraphQLDirective({
  name: "skip",
  description: "Directs the executor to skip this field or fragment when the `if` argument is true.",
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.FRAGMENT_SPREAD,
    DirectiveLocation.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Skipped when true."
    }
  }
});
var DEFAULT_DEPRECATION_REASON = "No longer supported";
var GraphQLDeprecatedDirective = new GraphQLDirective({
  name: "deprecated",
  description: "Marks an element of a GraphQL schema as no longer supported.",
  locations: [
    DirectiveLocation.FIELD_DEFINITION,
    DirectiveLocation.ARGUMENT_DEFINITION,
    DirectiveLocation.INPUT_FIELD_DEFINITION,
    DirectiveLocation.ENUM_VALUE
  ],
  args: {
    reason: {
      type: GraphQLString,
      description: "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
      defaultValue: DEFAULT_DEPRECATION_REASON
    }
  }
});
var GraphQLSpecifiedByDirective = new GraphQLDirective({
  name: "specifiedBy",
  description: "Exposes a URL that specifies the behavior of this scalar.",
  locations: [DirectiveLocation.SCALAR],
  args: {
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The URL that specifies the behavior of this scalar."
    }
  }
});
var GraphQLOneOfDirective = new GraphQLDirective({
  name: "oneOf",
  description: "Indicates exactly one field must be supplied and this field must not be `null`.",
  locations: [DirectiveLocation.INPUT_OBJECT],
  args: {}
});
var specifiedDirectives = Object.freeze([
  GraphQLIncludeDirective,
  GraphQLSkipDirective,
  GraphQLDeprecatedDirective,
  GraphQLSpecifiedByDirective,
  GraphQLOneOfDirective
]);

// node_modules/graphql/jsutils/isIterableObject.mjs
function isIterableObject(maybeIterable) {
  return typeof maybeIterable === "object" && typeof (maybeIterable === null || maybeIterable === void 0 ? void 0 : maybeIterable[Symbol.iterator]) === "function";
}

// node_modules/graphql/utilities/astFromValue.mjs
function astFromValue(value, type) {
  if (isNonNullType(type)) {
    const astValue = astFromValue(value, type.ofType);
    if ((astValue === null || astValue === void 0 ? void 0 : astValue.kind) === Kind.NULL) {
      return null;
    }
    return astValue;
  }
  if (value === null) {
    return {
      kind: Kind.NULL
    };
  }
  if (value === void 0) {
    return null;
  }
  if (isListType(type)) {
    const itemType = type.ofType;
    if (isIterableObject(value)) {
      const valuesNodes = [];
      for (const item of value) {
        const itemNode = astFromValue(item, itemType);
        if (itemNode != null) {
          valuesNodes.push(itemNode);
        }
      }
      return {
        kind: Kind.LIST,
        values: valuesNodes
      };
    }
    return astFromValue(value, itemType);
  }
  if (isInputObjectType(type)) {
    if (!isObjectLike(value)) {
      return null;
    }
    const fieldNodes = [];
    for (const field of Object.values(type.getFields())) {
      const fieldValue = astFromValue(value[field.name], field.type);
      if (fieldValue) {
        fieldNodes.push({
          kind: Kind.OBJECT_FIELD,
          name: {
            kind: Kind.NAME,
            value: field.name
          },
          value: fieldValue
        });
      }
    }
    return {
      kind: Kind.OBJECT,
      fields: fieldNodes
    };
  }
  if (isLeafType(type)) {
    const serialized = type.serialize(value);
    if (serialized == null) {
      return null;
    }
    if (typeof serialized === "boolean") {
      return {
        kind: Kind.BOOLEAN,
        value: serialized
      };
    }
    if (typeof serialized === "number" && Number.isFinite(serialized)) {
      const stringNum = String(serialized);
      return integerStringRegExp.test(stringNum) ? {
        kind: Kind.INT,
        value: stringNum
      } : {
        kind: Kind.FLOAT,
        value: stringNum
      };
    }
    if (typeof serialized === "string") {
      if (isEnumType(type)) {
        return {
          kind: Kind.ENUM,
          value: serialized
        };
      }
      if (type === GraphQLID && integerStringRegExp.test(serialized)) {
        return {
          kind: Kind.INT,
          value: serialized
        };
      }
      return {
        kind: Kind.STRING,
        value: serialized
      };
    }
    throw new TypeError(`Cannot convert value to AST: ${inspect(serialized)}.`);
  }
  invariant(false, "Unexpected input type: " + inspect(type));
}
var integerStringRegExp = /^-?(?:0|[1-9][0-9]*)$/;

// node_modules/graphql/type/introspection.mjs
var __Schema = new GraphQLObjectType({
  name: "__Schema",
  description: "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
  fields: () => ({
    description: {
      type: GraphQLString,
      resolve: (schema) => schema.description
    },
    types: {
      description: "A list of all types supported by this server.",
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(__Type))),
      resolve(schema) {
        return Object.values(schema.getTypeMap());
      }
    },
    queryType: {
      description: "The type that query operations will be rooted at.",
      type: new GraphQLNonNull(__Type),
      resolve: (schema) => schema.getQueryType()
    },
    mutationType: {
      description: "If this server supports mutation, the type that mutation operations will be rooted at.",
      type: __Type,
      resolve: (schema) => schema.getMutationType()
    },
    subscriptionType: {
      description: "If this server support subscription, the type that subscription operations will be rooted at.",
      type: __Type,
      resolve: (schema) => schema.getSubscriptionType()
    },
    directives: {
      description: "A list of all directives supported by this server.",
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__Directive))
      ),
      resolve: (schema) => schema.getDirectives()
    }
  })
});
var __Directive = new GraphQLObjectType({
  name: "__Directive",
  description: "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (directive) => directive.name
    },
    description: {
      type: GraphQLString,
      resolve: (directive) => directive.description
    },
    isRepeatable: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (directive) => directive.isRepeatable
    },
    locations: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__DirectiveLocation))
      ),
      resolve: (directive) => directive.locations
    },
    args: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__InputValue))
      ),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(field, { includeDeprecated }) {
        return includeDeprecated ? field.args : field.args.filter((arg) => arg.deprecationReason == null);
      }
    }
  })
});
var __DirectiveLocation = new GraphQLEnumType({
  name: "__DirectiveLocation",
  description: "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
  values: {
    QUERY: {
      value: DirectiveLocation.QUERY,
      description: "Location adjacent to a query operation."
    },
    MUTATION: {
      value: DirectiveLocation.MUTATION,
      description: "Location adjacent to a mutation operation."
    },
    SUBSCRIPTION: {
      value: DirectiveLocation.SUBSCRIPTION,
      description: "Location adjacent to a subscription operation."
    },
    FIELD: {
      value: DirectiveLocation.FIELD,
      description: "Location adjacent to a field."
    },
    FRAGMENT_DEFINITION: {
      value: DirectiveLocation.FRAGMENT_DEFINITION,
      description: "Location adjacent to a fragment definition."
    },
    FRAGMENT_SPREAD: {
      value: DirectiveLocation.FRAGMENT_SPREAD,
      description: "Location adjacent to a fragment spread."
    },
    INLINE_FRAGMENT: {
      value: DirectiveLocation.INLINE_FRAGMENT,
      description: "Location adjacent to an inline fragment."
    },
    VARIABLE_DEFINITION: {
      value: DirectiveLocation.VARIABLE_DEFINITION,
      description: "Location adjacent to a variable definition."
    },
    SCHEMA: {
      value: DirectiveLocation.SCHEMA,
      description: "Location adjacent to a schema definition."
    },
    SCALAR: {
      value: DirectiveLocation.SCALAR,
      description: "Location adjacent to a scalar definition."
    },
    OBJECT: {
      value: DirectiveLocation.OBJECT,
      description: "Location adjacent to an object type definition."
    },
    FIELD_DEFINITION: {
      value: DirectiveLocation.FIELD_DEFINITION,
      description: "Location adjacent to a field definition."
    },
    ARGUMENT_DEFINITION: {
      value: DirectiveLocation.ARGUMENT_DEFINITION,
      description: "Location adjacent to an argument definition."
    },
    INTERFACE: {
      value: DirectiveLocation.INTERFACE,
      description: "Location adjacent to an interface definition."
    },
    UNION: {
      value: DirectiveLocation.UNION,
      description: "Location adjacent to a union definition."
    },
    ENUM: {
      value: DirectiveLocation.ENUM,
      description: "Location adjacent to an enum definition."
    },
    ENUM_VALUE: {
      value: DirectiveLocation.ENUM_VALUE,
      description: "Location adjacent to an enum value definition."
    },
    INPUT_OBJECT: {
      value: DirectiveLocation.INPUT_OBJECT,
      description: "Location adjacent to an input object type definition."
    },
    INPUT_FIELD_DEFINITION: {
      value: DirectiveLocation.INPUT_FIELD_DEFINITION,
      description: "Location adjacent to an input object field definition."
    }
  }
});
var __Type = new GraphQLObjectType({
  name: "__Type",
  description: "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
  fields: () => ({
    kind: {
      type: new GraphQLNonNull(__TypeKind),
      resolve(type) {
        if (isScalarType(type)) {
          return TypeKind.SCALAR;
        }
        if (isObjectType(type)) {
          return TypeKind.OBJECT;
        }
        if (isInterfaceType(type)) {
          return TypeKind.INTERFACE;
        }
        if (isUnionType(type)) {
          return TypeKind.UNION;
        }
        if (isEnumType(type)) {
          return TypeKind.ENUM;
        }
        if (isInputObjectType(type)) {
          return TypeKind.INPUT_OBJECT;
        }
        if (isListType(type)) {
          return TypeKind.LIST;
        }
        if (isNonNullType(type)) {
          return TypeKind.NON_NULL;
        }
        invariant(false, `Unexpected type: "${inspect(type)}".`);
      }
    },
    name: {
      type: GraphQLString,
      resolve: (type) => "name" in type ? type.name : void 0
    },
    description: {
      type: GraphQLString,
      resolve: (type) => (
        /* c8 ignore next */
        "description" in type ? type.description : void 0
      )
    },
    specifiedByURL: {
      type: GraphQLString,
      resolve: (obj) => "specifiedByURL" in obj ? obj.specifiedByURL : void 0
    },
    fields: {
      type: new GraphQLList(new GraphQLNonNull(__Field)),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(type, { includeDeprecated }) {
        if (isObjectType(type) || isInterfaceType(type)) {
          const fields = Object.values(type.getFields());
          return includeDeprecated ? fields : fields.filter((field) => field.deprecationReason == null);
        }
      }
    },
    interfaces: {
      type: new GraphQLList(new GraphQLNonNull(__Type)),
      resolve(type) {
        if (isObjectType(type) || isInterfaceType(type)) {
          return type.getInterfaces();
        }
      }
    },
    possibleTypes: {
      type: new GraphQLList(new GraphQLNonNull(__Type)),
      resolve(type, _args, _context, { schema }) {
        if (isAbstractType(type)) {
          return schema.getPossibleTypes(type);
        }
      }
    },
    enumValues: {
      type: new GraphQLList(new GraphQLNonNull(__EnumValue)),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(type, { includeDeprecated }) {
        if (isEnumType(type)) {
          const values = type.getValues();
          return includeDeprecated ? values : values.filter((field) => field.deprecationReason == null);
        }
      }
    },
    inputFields: {
      type: new GraphQLList(new GraphQLNonNull(__InputValue)),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(type, { includeDeprecated }) {
        if (isInputObjectType(type)) {
          const values = Object.values(type.getFields());
          return includeDeprecated ? values : values.filter((field) => field.deprecationReason == null);
        }
      }
    },
    ofType: {
      type: __Type,
      resolve: (type) => "ofType" in type ? type.ofType : void 0
    },
    isOneOf: {
      type: GraphQLBoolean,
      resolve: (type) => {
        if (isInputObjectType(type)) {
          return type.isOneOf;
        }
      }
    }
  })
});
var __Field = new GraphQLObjectType({
  name: "__Field",
  description: "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (field) => field.name
    },
    description: {
      type: GraphQLString,
      resolve: (field) => field.description
    },
    args: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(__InputValue))
      ),
      args: {
        includeDeprecated: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      },
      resolve(field, { includeDeprecated }) {
        return includeDeprecated ? field.args : field.args.filter((arg) => arg.deprecationReason == null);
      }
    },
    type: {
      type: new GraphQLNonNull(__Type),
      resolve: (field) => field.type
    },
    isDeprecated: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (field) => field.deprecationReason != null
    },
    deprecationReason: {
      type: GraphQLString,
      resolve: (field) => field.deprecationReason
    }
  })
});
var __InputValue = new GraphQLObjectType({
  name: "__InputValue",
  description: "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (inputValue) => inputValue.name
    },
    description: {
      type: GraphQLString,
      resolve: (inputValue) => inputValue.description
    },
    type: {
      type: new GraphQLNonNull(__Type),
      resolve: (inputValue) => inputValue.type
    },
    defaultValue: {
      type: GraphQLString,
      description: "A GraphQL-formatted string representing the default value for this input value.",
      resolve(inputValue) {
        const { type, defaultValue } = inputValue;
        const valueAST = astFromValue(defaultValue, type);
        return valueAST ? print(valueAST) : null;
      }
    },
    isDeprecated: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (field) => field.deprecationReason != null
    },
    deprecationReason: {
      type: GraphQLString,
      resolve: (obj) => obj.deprecationReason
    }
  })
});
var __EnumValue = new GraphQLObjectType({
  name: "__EnumValue",
  description: "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (enumValue) => enumValue.name
    },
    description: {
      type: GraphQLString,
      resolve: (enumValue) => enumValue.description
    },
    isDeprecated: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (enumValue) => enumValue.deprecationReason != null
    },
    deprecationReason: {
      type: GraphQLString,
      resolve: (enumValue) => enumValue.deprecationReason
    }
  })
});
var TypeKind;
(function(TypeKind2) {
  TypeKind2["SCALAR"] = "SCALAR";
  TypeKind2["OBJECT"] = "OBJECT";
  TypeKind2["INTERFACE"] = "INTERFACE";
  TypeKind2["UNION"] = "UNION";
  TypeKind2["ENUM"] = "ENUM";
  TypeKind2["INPUT_OBJECT"] = "INPUT_OBJECT";
  TypeKind2["LIST"] = "LIST";
  TypeKind2["NON_NULL"] = "NON_NULL";
})(TypeKind || (TypeKind = {}));
var __TypeKind = new GraphQLEnumType({
  name: "__TypeKind",
  description: "An enum describing what kind of type a given `__Type` is.",
  values: {
    SCALAR: {
      value: TypeKind.SCALAR,
      description: "Indicates this type is a scalar."
    },
    OBJECT: {
      value: TypeKind.OBJECT,
      description: "Indicates this type is an object. `fields` and `interfaces` are valid fields."
    },
    INTERFACE: {
      value: TypeKind.INTERFACE,
      description: "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields."
    },
    UNION: {
      value: TypeKind.UNION,
      description: "Indicates this type is a union. `possibleTypes` is a valid field."
    },
    ENUM: {
      value: TypeKind.ENUM,
      description: "Indicates this type is an enum. `enumValues` is a valid field."
    },
    INPUT_OBJECT: {
      value: TypeKind.INPUT_OBJECT,
      description: "Indicates this type is an input object. `inputFields` is a valid field."
    },
    LIST: {
      value: TypeKind.LIST,
      description: "Indicates this type is a list. `ofType` is a valid field."
    },
    NON_NULL: {
      value: TypeKind.NON_NULL,
      description: "Indicates this type is a non-null. `ofType` is a valid field."
    }
  }
});
var SchemaMetaFieldDef = {
  name: "__schema",
  type: new GraphQLNonNull(__Schema),
  description: "Access the current type schema of this server.",
  args: [],
  resolve: (_source, _args, _context, { schema }) => schema,
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
};
var TypeMetaFieldDef = {
  name: "__type",
  type: __Type,
  description: "Request the type information of a single type.",
  args: [
    {
      name: "name",
      description: void 0,
      type: new GraphQLNonNull(GraphQLString),
      defaultValue: void 0,
      deprecationReason: void 0,
      extensions: /* @__PURE__ */ Object.create(null),
      astNode: void 0
    }
  ],
  resolve: (_source, { name }, _context, { schema }) => schema.getType(name),
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
};
var TypeNameMetaFieldDef = {
  name: "__typename",
  type: new GraphQLNonNull(GraphQLString),
  description: "The name of the current Object type at runtime.",
  args: [],
  resolve: (_source, _args, _context, { parentType }) => parentType.name,
  deprecationReason: void 0,
  extensions: /* @__PURE__ */ Object.create(null),
  astNode: void 0
};
var introspectionTypes = Object.freeze([
  __Schema,
  __Directive,
  __DirectiveLocation,
  __Type,
  __Field,
  __InputValue,
  __EnumValue,
  __TypeKind
]);

// node_modules/graphql/utilities/typeFromAST.mjs
function typeFromAST(schema, typeNode) {
  switch (typeNode.kind) {
    case Kind.LIST_TYPE: {
      const innerType = typeFromAST(schema, typeNode.type);
      return innerType && new GraphQLList(innerType);
    }
    case Kind.NON_NULL_TYPE: {
      const innerType = typeFromAST(schema, typeNode.type);
      return innerType && new GraphQLNonNull(innerType);
    }
    case Kind.NAMED_TYPE:
      return schema.getType(typeNode.name.value);
  }
}

// node_modules/graphql/language/predicates.mjs
function isExecutableDefinitionNode(node) {
  return node.kind === Kind.OPERATION_DEFINITION || node.kind === Kind.FRAGMENT_DEFINITION;
}
function isTypeSystemDefinitionNode(node) {
  return node.kind === Kind.SCHEMA_DEFINITION || isTypeDefinitionNode(node) || node.kind === Kind.DIRECTIVE_DEFINITION;
}
function isTypeDefinitionNode(node) {
  return node.kind === Kind.SCALAR_TYPE_DEFINITION || node.kind === Kind.OBJECT_TYPE_DEFINITION || node.kind === Kind.INTERFACE_TYPE_DEFINITION || node.kind === Kind.UNION_TYPE_DEFINITION || node.kind === Kind.ENUM_TYPE_DEFINITION || node.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION;
}
function isTypeSystemExtensionNode(node) {
  return node.kind === Kind.SCHEMA_EXTENSION || isTypeExtensionNode(node);
}
function isTypeExtensionNode(node) {
  return node.kind === Kind.SCALAR_TYPE_EXTENSION || node.kind === Kind.OBJECT_TYPE_EXTENSION || node.kind === Kind.INTERFACE_TYPE_EXTENSION || node.kind === Kind.UNION_TYPE_EXTENSION || node.kind === Kind.ENUM_TYPE_EXTENSION || node.kind === Kind.INPUT_OBJECT_TYPE_EXTENSION;
}

// node_modules/graphql/validation/rules/ExecutableDefinitionsRule.mjs
function ExecutableDefinitionsRule(context2) {
  return {
    Document(node) {
      for (const definition of node.definitions) {
        if (!isExecutableDefinitionNode(definition)) {
          const defName = definition.kind === Kind.SCHEMA_DEFINITION || definition.kind === Kind.SCHEMA_EXTENSION ? "schema" : '"' + definition.name.value + '"';
          context2.reportError(
            new GraphQLError(`The ${defName} definition is not executable.`, {
              nodes: definition
            })
          );
        }
      }
      return false;
    }
  };
}

// node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.mjs
function FieldsOnCorrectTypeRule(context2) {
  return {
    Field(node) {
      const type = context2.getParentType();
      if (type) {
        const fieldDef = context2.getFieldDef();
        if (!fieldDef) {
          const schema = context2.getSchema();
          const fieldName = node.name.value;
          let suggestion = didYouMean(
            "to use an inline fragment on",
            getSuggestedTypeNames(schema, type, fieldName)
          );
          if (suggestion === "") {
            suggestion = didYouMean(getSuggestedFieldNames(type, fieldName));
          }
          context2.reportError(
            new GraphQLError(
              `Cannot query field "${fieldName}" on type "${type.name}".` + suggestion,
              {
                nodes: node
              }
            )
          );
        }
      }
    }
  };
}
function getSuggestedTypeNames(schema, type, fieldName) {
  if (!isAbstractType(type)) {
    return [];
  }
  const suggestedTypes = /* @__PURE__ */ new Set();
  const usageCount = /* @__PURE__ */ Object.create(null);
  for (const possibleType of schema.getPossibleTypes(type)) {
    if (!possibleType.getFields()[fieldName]) {
      continue;
    }
    suggestedTypes.add(possibleType);
    usageCount[possibleType.name] = 1;
    for (const possibleInterface of possibleType.getInterfaces()) {
      var _usageCount$possibleI;
      if (!possibleInterface.getFields()[fieldName]) {
        continue;
      }
      suggestedTypes.add(possibleInterface);
      usageCount[possibleInterface.name] = ((_usageCount$possibleI = usageCount[possibleInterface.name]) !== null && _usageCount$possibleI !== void 0 ? _usageCount$possibleI : 0) + 1;
    }
  }
  return [...suggestedTypes].sort((typeA, typeB) => {
    const usageCountDiff = usageCount[typeB.name] - usageCount[typeA.name];
    if (usageCountDiff !== 0) {
      return usageCountDiff;
    }
    if (isInterfaceType(typeA) && schema.isSubType(typeA, typeB)) {
      return -1;
    }
    if (isInterfaceType(typeB) && schema.isSubType(typeB, typeA)) {
      return 1;
    }
    return naturalCompare(typeA.name, typeB.name);
  }).map((x) => x.name);
}
function getSuggestedFieldNames(type, fieldName) {
  if (isObjectType(type) || isInterfaceType(type)) {
    const possibleFieldNames = Object.keys(type.getFields());
    return suggestionList(fieldName, possibleFieldNames);
  }
  return [];
}

// node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.mjs
function FragmentsOnCompositeTypesRule(context2) {
  return {
    InlineFragment(node) {
      const typeCondition = node.typeCondition;
      if (typeCondition) {
        const type = typeFromAST(context2.getSchema(), typeCondition);
        if (type && !isCompositeType(type)) {
          const typeStr = print(typeCondition);
          context2.reportError(
            new GraphQLError(
              `Fragment cannot condition on non composite type "${typeStr}".`,
              {
                nodes: typeCondition
              }
            )
          );
        }
      }
    },
    FragmentDefinition(node) {
      const type = typeFromAST(context2.getSchema(), node.typeCondition);
      if (type && !isCompositeType(type)) {
        const typeStr = print(node.typeCondition);
        context2.reportError(
          new GraphQLError(
            `Fragment "${node.name.value}" cannot condition on non composite type "${typeStr}".`,
            {
              nodes: node.typeCondition
            }
          )
        );
      }
    }
  };
}

// node_modules/graphql/validation/rules/KnownArgumentNamesRule.mjs
function KnownArgumentNamesRule(context2) {
  return {
    // eslint-disable-next-line new-cap
    ...KnownArgumentNamesOnDirectivesRule(context2),
    Argument(argNode) {
      const argDef = context2.getArgument();
      const fieldDef = context2.getFieldDef();
      const parentType = context2.getParentType();
      if (!argDef && fieldDef && parentType) {
        const argName = argNode.name.value;
        const knownArgsNames = fieldDef.args.map((arg) => arg.name);
        const suggestions = suggestionList(argName, knownArgsNames);
        context2.reportError(
          new GraphQLError(
            `Unknown argument "${argName}" on field "${parentType.name}.${fieldDef.name}".` + didYouMean(suggestions),
            {
              nodes: argNode
            }
          )
        );
      }
    }
  };
}
function KnownArgumentNamesOnDirectivesRule(context2) {
  const directiveArgs = /* @__PURE__ */ Object.create(null);
  const schema = context2.getSchema();
  const definedDirectives = schema ? schema.getDirectives() : specifiedDirectives;
  for (const directive of definedDirectives) {
    directiveArgs[directive.name] = directive.args.map((arg) => arg.name);
  }
  const astDefinitions = context2.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;
      const argsNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
      directiveArgs[def.name.value] = argsNodes.map((arg) => arg.name.value);
    }
  }
  return {
    Directive(directiveNode) {
      const directiveName = directiveNode.name.value;
      const knownArgs = directiveArgs[directiveName];
      if (directiveNode.arguments && knownArgs) {
        for (const argNode of directiveNode.arguments) {
          const argName = argNode.name.value;
          if (!knownArgs.includes(argName)) {
            const suggestions = suggestionList(argName, knownArgs);
            context2.reportError(
              new GraphQLError(
                `Unknown argument "${argName}" on directive "@${directiveName}".` + didYouMean(suggestions),
                {
                  nodes: argNode
                }
              )
            );
          }
        }
      }
      return false;
    }
  };
}

// node_modules/graphql/validation/rules/KnownDirectivesRule.mjs
function KnownDirectivesRule(context2) {
  const locationsMap = /* @__PURE__ */ Object.create(null);
  const schema = context2.getSchema();
  const definedDirectives = schema ? schema.getDirectives() : specifiedDirectives;
  for (const directive of definedDirectives) {
    locationsMap[directive.name] = directive.locations;
  }
  const astDefinitions = context2.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      locationsMap[def.name.value] = def.locations.map((name) => name.value);
    }
  }
  return {
    Directive(node, _key, _parent, _path, ancestors) {
      const name = node.name.value;
      const locations = locationsMap[name];
      if (!locations) {
        context2.reportError(
          new GraphQLError(`Unknown directive "@${name}".`, {
            nodes: node
          })
        );
        return;
      }
      const candidateLocation = getDirectiveLocationForASTPath(ancestors);
      if (candidateLocation && !locations.includes(candidateLocation)) {
        context2.reportError(
          new GraphQLError(
            `Directive "@${name}" may not be used on ${candidateLocation}.`,
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}
function getDirectiveLocationForASTPath(ancestors) {
  const appliedTo = ancestors[ancestors.length - 1];
  "kind" in appliedTo || invariant(false);
  switch (appliedTo.kind) {
    case Kind.OPERATION_DEFINITION:
      return getDirectiveLocationForOperation(appliedTo.operation);
    case Kind.FIELD:
      return DirectiveLocation.FIELD;
    case Kind.FRAGMENT_SPREAD:
      return DirectiveLocation.FRAGMENT_SPREAD;
    case Kind.INLINE_FRAGMENT:
      return DirectiveLocation.INLINE_FRAGMENT;
    case Kind.FRAGMENT_DEFINITION:
      return DirectiveLocation.FRAGMENT_DEFINITION;
    case Kind.VARIABLE_DEFINITION:
      return DirectiveLocation.VARIABLE_DEFINITION;
    case Kind.SCHEMA_DEFINITION:
    case Kind.SCHEMA_EXTENSION:
      return DirectiveLocation.SCHEMA;
    case Kind.SCALAR_TYPE_DEFINITION:
    case Kind.SCALAR_TYPE_EXTENSION:
      return DirectiveLocation.SCALAR;
    case Kind.OBJECT_TYPE_DEFINITION:
    case Kind.OBJECT_TYPE_EXTENSION:
      return DirectiveLocation.OBJECT;
    case Kind.FIELD_DEFINITION:
      return DirectiveLocation.FIELD_DEFINITION;
    case Kind.INTERFACE_TYPE_DEFINITION:
    case Kind.INTERFACE_TYPE_EXTENSION:
      return DirectiveLocation.INTERFACE;
    case Kind.UNION_TYPE_DEFINITION:
    case Kind.UNION_TYPE_EXTENSION:
      return DirectiveLocation.UNION;
    case Kind.ENUM_TYPE_DEFINITION:
    case Kind.ENUM_TYPE_EXTENSION:
      return DirectiveLocation.ENUM;
    case Kind.ENUM_VALUE_DEFINITION:
      return DirectiveLocation.ENUM_VALUE;
    case Kind.INPUT_OBJECT_TYPE_DEFINITION:
    case Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return DirectiveLocation.INPUT_OBJECT;
    case Kind.INPUT_VALUE_DEFINITION: {
      const parentNode = ancestors[ancestors.length - 3];
      "kind" in parentNode || invariant(false);
      return parentNode.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION ? DirectiveLocation.INPUT_FIELD_DEFINITION : DirectiveLocation.ARGUMENT_DEFINITION;
    }
    // Not reachable, all possible types have been considered.
    /* c8 ignore next */
    default:
      invariant(false, "Unexpected kind: " + inspect(appliedTo.kind));
  }
}
function getDirectiveLocationForOperation(operation) {
  switch (operation) {
    case OperationTypeNode.QUERY:
      return DirectiveLocation.QUERY;
    case OperationTypeNode.MUTATION:
      return DirectiveLocation.MUTATION;
    case OperationTypeNode.SUBSCRIPTION:
      return DirectiveLocation.SUBSCRIPTION;
  }
}

// node_modules/graphql/validation/rules/KnownFragmentNamesRule.mjs
function KnownFragmentNamesRule(context2) {
  return {
    FragmentSpread(node) {
      const fragmentName = node.name.value;
      const fragment = context2.getFragment(fragmentName);
      if (!fragment) {
        context2.reportError(
          new GraphQLError(`Unknown fragment "${fragmentName}".`, {
            nodes: node.name
          })
        );
      }
    }
  };
}

// node_modules/graphql/validation/rules/KnownTypeNamesRule.mjs
function KnownTypeNamesRule(context2) {
  const schema = context2.getSchema();
  const existingTypesMap = schema ? schema.getTypeMap() : /* @__PURE__ */ Object.create(null);
  const definedTypes = /* @__PURE__ */ Object.create(null);
  for (const def of context2.getDocument().definitions) {
    if (isTypeDefinitionNode(def)) {
      definedTypes[def.name.value] = true;
    }
  }
  const typeNames = [
    ...Object.keys(existingTypesMap),
    ...Object.keys(definedTypes)
  ];
  return {
    NamedType(node, _1, parent, _2, ancestors) {
      const typeName = node.name.value;
      if (!existingTypesMap[typeName] && !definedTypes[typeName]) {
        var _ancestors$;
        const definitionNode = (_ancestors$ = ancestors[2]) !== null && _ancestors$ !== void 0 ? _ancestors$ : parent;
        const isSDL = definitionNode != null && isSDLNode(definitionNode);
        if (isSDL && standardTypeNames.includes(typeName)) {
          return;
        }
        const suggestedTypes = suggestionList(
          typeName,
          isSDL ? standardTypeNames.concat(typeNames) : typeNames
        );
        context2.reportError(
          new GraphQLError(
            `Unknown type "${typeName}".` + didYouMean(suggestedTypes),
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}
var standardTypeNames = [...specifiedScalarTypes, ...introspectionTypes].map(
  (type) => type.name
);
function isSDLNode(value) {
  return "kind" in value && (isTypeSystemDefinitionNode(value) || isTypeSystemExtensionNode(value));
}

// node_modules/graphql/validation/rules/LoneAnonymousOperationRule.mjs
function LoneAnonymousOperationRule(context2) {
  let operationCount = 0;
  return {
    Document(node) {
      operationCount = node.definitions.filter(
        (definition) => definition.kind === Kind.OPERATION_DEFINITION
      ).length;
    },
    OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context2.reportError(
          new GraphQLError(
            "This anonymous operation must be the only defined operation.",
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}

// node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.mjs
function LoneSchemaDefinitionRule(context2) {
  var _ref, _ref2, _oldSchema$astNode;
  const oldSchema = context2.getSchema();
  const alreadyDefined = (_ref = (_ref2 = (_oldSchema$astNode = oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.astNode) !== null && _oldSchema$astNode !== void 0 ? _oldSchema$astNode : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getQueryType()) !== null && _ref2 !== void 0 ? _ref2 : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getMutationType()) !== null && _ref !== void 0 ? _ref : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getSubscriptionType();
  let schemaDefinitionsCount = 0;
  return {
    SchemaDefinition(node) {
      if (alreadyDefined) {
        context2.reportError(
          new GraphQLError(
            "Cannot define a new schema within a schema extension.",
            {
              nodes: node
            }
          )
        );
        return;
      }
      if (schemaDefinitionsCount > 0) {
        context2.reportError(
          new GraphQLError("Must provide only one schema definition.", {
            nodes: node
          })
        );
      }
      ++schemaDefinitionsCount;
    }
  };
}

// node_modules/graphql/validation/rules/MaxIntrospectionDepthRule.mjs
var MAX_LISTS_DEPTH = 3;
function MaxIntrospectionDepthRule(context2) {
  function checkDepth(node, visitedFragments = /* @__PURE__ */ Object.create(null), depth = 0) {
    if (node.kind === Kind.FRAGMENT_SPREAD) {
      const fragmentName = node.name.value;
      if (visitedFragments[fragmentName] === true) {
        return false;
      }
      const fragment = context2.getFragment(fragmentName);
      if (!fragment) {
        return false;
      }
      try {
        visitedFragments[fragmentName] = true;
        return checkDepth(fragment, visitedFragments, depth);
      } finally {
        visitedFragments[fragmentName] = void 0;
      }
    }
    if (node.kind === Kind.FIELD && // check all introspection lists
    (node.name.value === "fields" || node.name.value === "interfaces" || node.name.value === "possibleTypes" || node.name.value === "inputFields")) {
      depth++;
      if (depth >= MAX_LISTS_DEPTH) {
        return true;
      }
    }
    if ("selectionSet" in node && node.selectionSet) {
      for (const child of node.selectionSet.selections) {
        if (checkDepth(child, visitedFragments, depth)) {
          return true;
        }
      }
    }
    return false;
  }
  return {
    Field(node) {
      if (node.name.value === "__schema" || node.name.value === "__type") {
        if (checkDepth(node)) {
          context2.reportError(
            new GraphQLError("Maximum introspection depth exceeded", {
              nodes: [node]
            })
          );
          return false;
        }
      }
    }
  };
}

// node_modules/graphql/validation/rules/NoFragmentCyclesRule.mjs
function NoFragmentCyclesRule(context2) {
  const visitedFrags = /* @__PURE__ */ Object.create(null);
  const spreadPath = [];
  const spreadPathIndexByName = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: () => false,
    FragmentDefinition(node) {
      detectCycleRecursive(node);
      return false;
    }
  };
  function detectCycleRecursive(fragment) {
    if (visitedFrags[fragment.name.value]) {
      return;
    }
    const fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;
    const spreadNodes = context2.getFragmentSpreads(fragment.selectionSet);
    if (spreadNodes.length === 0) {
      return;
    }
    spreadPathIndexByName[fragmentName] = spreadPath.length;
    for (const spreadNode of spreadNodes) {
      const spreadName = spreadNode.name.value;
      const cycleIndex = spreadPathIndexByName[spreadName];
      spreadPath.push(spreadNode);
      if (cycleIndex === void 0) {
        const spreadFragment = context2.getFragment(spreadName);
        if (spreadFragment) {
          detectCycleRecursive(spreadFragment);
        }
      } else {
        const cyclePath = spreadPath.slice(cycleIndex);
        const viaPath = cyclePath.slice(0, -1).map((s) => '"' + s.name.value + '"').join(", ");
        context2.reportError(
          new GraphQLError(
            `Cannot spread fragment "${spreadName}" within itself` + (viaPath !== "" ? ` via ${viaPath}.` : "."),
            {
              nodes: cyclePath
            }
          )
        );
      }
      spreadPath.pop();
    }
    spreadPathIndexByName[fragmentName] = void 0;
  }
}

// node_modules/graphql/validation/rules/NoUndefinedVariablesRule.mjs
function NoUndefinedVariablesRule(context2) {
  let variableNameDefined = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        variableNameDefined = /* @__PURE__ */ Object.create(null);
      },
      leave(operation) {
        const usages = context2.getRecursiveVariableUsages(operation);
        for (const { node } of usages) {
          const varName = node.name.value;
          if (variableNameDefined[varName] !== true) {
            context2.reportError(
              new GraphQLError(
                operation.name ? `Variable "$${varName}" is not defined by operation "${operation.name.value}".` : `Variable "$${varName}" is not defined.`,
                {
                  nodes: [node, operation]
                }
              )
            );
          }
        }
      }
    },
    VariableDefinition(node) {
      variableNameDefined[node.variable.name.value] = true;
    }
  };
}

// node_modules/graphql/validation/rules/NoUnusedFragmentsRule.mjs
function NoUnusedFragmentsRule(context2) {
  const operationDefs = [];
  const fragmentDefs = [];
  return {
    OperationDefinition(node) {
      operationDefs.push(node);
      return false;
    },
    FragmentDefinition(node) {
      fragmentDefs.push(node);
      return false;
    },
    Document: {
      leave() {
        const fragmentNameUsed = /* @__PURE__ */ Object.create(null);
        for (const operation of operationDefs) {
          for (const fragment of context2.getRecursivelyReferencedFragments(
            operation
          )) {
            fragmentNameUsed[fragment.name.value] = true;
          }
        }
        for (const fragmentDef of fragmentDefs) {
          const fragName = fragmentDef.name.value;
          if (fragmentNameUsed[fragName] !== true) {
            context2.reportError(
              new GraphQLError(`Fragment "${fragName}" is never used.`, {
                nodes: fragmentDef
              })
            );
          }
        }
      }
    }
  };
}

// node_modules/graphql/validation/rules/NoUnusedVariablesRule.mjs
function NoUnusedVariablesRule(context2) {
  let variableDefs = [];
  return {
    OperationDefinition: {
      enter() {
        variableDefs = [];
      },
      leave(operation) {
        const variableNameUsed = /* @__PURE__ */ Object.create(null);
        const usages = context2.getRecursiveVariableUsages(operation);
        for (const { node } of usages) {
          variableNameUsed[node.name.value] = true;
        }
        for (const variableDef of variableDefs) {
          const variableName = variableDef.variable.name.value;
          if (variableNameUsed[variableName] !== true) {
            context2.reportError(
              new GraphQLError(
                operation.name ? `Variable "$${variableName}" is never used in operation "${operation.name.value}".` : `Variable "$${variableName}" is never used.`,
                {
                  nodes: variableDef
                }
              )
            );
          }
        }
      }
    },
    VariableDefinition(def) {
      variableDefs.push(def);
    }
  };
}

// node_modules/graphql/utilities/sortValueNode.mjs
function sortValueNode(valueNode) {
  switch (valueNode.kind) {
    case Kind.OBJECT:
      return { ...valueNode, fields: sortFields(valueNode.fields) };
    case Kind.LIST:
      return { ...valueNode, values: valueNode.values.map(sortValueNode) };
    case Kind.INT:
    case Kind.FLOAT:
    case Kind.STRING:
    case Kind.BOOLEAN:
    case Kind.NULL:
    case Kind.ENUM:
    case Kind.VARIABLE:
      return valueNode;
  }
}
function sortFields(fields) {
  return fields.map((fieldNode) => ({
    ...fieldNode,
    value: sortValueNode(fieldNode.value)
  })).sort(
    (fieldA, fieldB) => naturalCompare(fieldA.name.value, fieldB.name.value)
  );
}

// node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.mjs
function reasonMessage(reason) {
  if (Array.isArray(reason)) {
    return reason.map(
      ([responseName, subReason]) => `subfields "${responseName}" conflict because ` + reasonMessage(subReason)
    ).join(" and ");
  }
  return reason;
}
function OverlappingFieldsCanBeMergedRule(context2) {
  const comparedFieldsAndFragmentPairs = new OrderedPairSet();
  const comparedFragmentPairs = new PairSet();
  const cachedFieldsAndFragmentNames = /* @__PURE__ */ new Map();
  return {
    SelectionSet(selectionSet) {
      const conflicts = findConflictsWithinSelectionSet(
        context2,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        context2.getParentType(),
        selectionSet
      );
      for (const [[responseName, reason], fields1, fields2] of conflicts) {
        const reasonMsg = reasonMessage(reason);
        context2.reportError(
          new GraphQLError(
            `Fields "${responseName}" conflict because ${reasonMsg}. Use different aliases on the fields to fetch both if this was intentional.`,
            {
              nodes: fields1.concat(fields2)
            }
          )
        );
      }
    }
  };
}
function findConflictsWithinSelectionSet(context2, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentType, selectionSet) {
  const conflicts = [];
  const [fieldMap, fragmentNames] = getFieldsAndFragmentNames(
    context2,
    cachedFieldsAndFragmentNames,
    parentType,
    selectionSet
  );
  collectConflictsWithin(
    context2,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    fieldMap
  );
  if (fragmentNames.length !== 0) {
    for (let i = 0; i < fragmentNames.length; i++) {
      collectConflictsBetweenFieldsAndFragment(
        context2,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        false,
        fieldMap,
        fragmentNames[i]
      );
      for (let j = i + 1; j < fragmentNames.length; j++) {
        collectConflictsBetweenFragments(
          context2,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          false,
          fragmentNames[i],
          fragmentNames[j]
        );
      }
    }
  }
  return conflicts;
}
function collectConflictsBetweenFieldsAndFragment(context2, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fragmentName) {
  if (comparedFieldsAndFragmentPairs.has(
    fieldMap,
    fragmentName,
    areMutuallyExclusive
  )) {
    return;
  }
  comparedFieldsAndFragmentPairs.add(
    fieldMap,
    fragmentName,
    areMutuallyExclusive
  );
  const fragment = context2.getFragment(fragmentName);
  if (!fragment) {
    return;
  }
  const [fieldMap2, referencedFragmentNames] = getReferencedFieldsAndFragmentNames(
    context2,
    cachedFieldsAndFragmentNames,
    fragment
  );
  if (fieldMap === fieldMap2) {
    return;
  }
  collectConflictsBetween(
    context2,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap,
    fieldMap2
  );
  for (const referencedFragmentName of referencedFragmentNames) {
    collectConflictsBetweenFieldsAndFragment(
      context2,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap,
      referencedFragmentName
    );
  }
}
function collectConflictsBetweenFragments(context2, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, fragmentName2) {
  if (fragmentName1 === fragmentName2) {
    return;
  }
  if (comparedFragmentPairs.has(
    fragmentName1,
    fragmentName2,
    areMutuallyExclusive
  )) {
    return;
  }
  comparedFragmentPairs.add(fragmentName1, fragmentName2, areMutuallyExclusive);
  const fragment1 = context2.getFragment(fragmentName1);
  const fragment2 = context2.getFragment(fragmentName2);
  if (!fragment1 || !fragment2) {
    return;
  }
  const [fieldMap1, referencedFragmentNames1] = getReferencedFieldsAndFragmentNames(
    context2,
    cachedFieldsAndFragmentNames,
    fragment1
  );
  const [fieldMap2, referencedFragmentNames2] = getReferencedFieldsAndFragmentNames(
    context2,
    cachedFieldsAndFragmentNames,
    fragment2
  );
  collectConflictsBetween(
    context2,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap1,
    fieldMap2
  );
  for (const referencedFragmentName2 of referencedFragmentNames2) {
    collectConflictsBetweenFragments(
      context2,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fragmentName1,
      referencedFragmentName2
    );
  }
  for (const referencedFragmentName1 of referencedFragmentNames1) {
    collectConflictsBetweenFragments(
      context2,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      referencedFragmentName1,
      fragmentName2
    );
  }
}
function findConflictsBetweenSubSelectionSets(context2, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, parentType1, selectionSet1, parentType2, selectionSet2) {
  const conflicts = [];
  const [fieldMap1, fragmentNames1] = getFieldsAndFragmentNames(
    context2,
    cachedFieldsAndFragmentNames,
    parentType1,
    selectionSet1
  );
  const [fieldMap2, fragmentNames2] = getFieldsAndFragmentNames(
    context2,
    cachedFieldsAndFragmentNames,
    parentType2,
    selectionSet2
  );
  collectConflictsBetween(
    context2,
    conflicts,
    cachedFieldsAndFragmentNames,
    comparedFieldsAndFragmentPairs,
    comparedFragmentPairs,
    areMutuallyExclusive,
    fieldMap1,
    fieldMap2
  );
  for (const fragmentName2 of fragmentNames2) {
    collectConflictsBetweenFieldsAndFragment(
      context2,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap1,
      fragmentName2
    );
  }
  for (const fragmentName1 of fragmentNames1) {
    collectConflictsBetweenFieldsAndFragment(
      context2,
      conflicts,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      fieldMap2,
      fragmentName1
    );
  }
  for (const fragmentName1 of fragmentNames1) {
    for (const fragmentName2 of fragmentNames2) {
      collectConflictsBetweenFragments(
        context2,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        areMutuallyExclusive,
        fragmentName1,
        fragmentName2
      );
    }
  }
  return conflicts;
}
function collectConflictsWithin(context2, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, fieldMap) {
  for (const [responseName, fields] of Object.entries(fieldMap)) {
    if (fields.length > 1) {
      for (let i = 0; i < fields.length; i++) {
        for (let j = i + 1; j < fields.length; j++) {
          const conflict = findConflict(
            context2,
            cachedFieldsAndFragmentNames,
            comparedFieldsAndFragmentPairs,
            comparedFragmentPairs,
            false,
            // within one collection is never mutually exclusive
            responseName,
            fields[i],
            fields[j]
          );
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
}
function collectConflictsBetween(context2, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, fieldMap1, fieldMap2) {
  for (const [responseName, fields1] of Object.entries(fieldMap1)) {
    const fields2 = fieldMap2[responseName];
    if (fields2) {
      for (const field1 of fields1) {
        for (const field2 of fields2) {
          const conflict = findConflict(
            context2,
            cachedFieldsAndFragmentNames,
            comparedFieldsAndFragmentPairs,
            comparedFragmentPairs,
            parentFieldsAreMutuallyExclusive,
            responseName,
            field1,
            field2
          );
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  }
}
function findConflict(context2, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, responseName, field1, field2) {
  const [parentType1, node1, def1] = field1;
  const [parentType2, node2, def2] = field2;
  const areMutuallyExclusive = parentFieldsAreMutuallyExclusive || parentType1 !== parentType2 && isObjectType(parentType1) && isObjectType(parentType2);
  if (!areMutuallyExclusive) {
    const name1 = node1.name.value;
    const name2 = node2.name.value;
    if (name1 !== name2) {
      return [
        [responseName, `"${name1}" and "${name2}" are different fields`],
        [node1],
        [node2]
      ];
    }
    if (!sameArguments(node1, node2)) {
      return [
        [responseName, "they have differing arguments"],
        [node1],
        [node2]
      ];
    }
  }
  const type1 = def1 === null || def1 === void 0 ? void 0 : def1.type;
  const type2 = def2 === null || def2 === void 0 ? void 0 : def2.type;
  if (type1 && type2 && doTypesConflict(type1, type2)) {
    return [
      [
        responseName,
        `they return conflicting types "${inspect(type1)}" and "${inspect(
          type2
        )}"`
      ],
      [node1],
      [node2]
    ];
  }
  const selectionSet1 = node1.selectionSet;
  const selectionSet2 = node2.selectionSet;
  if (selectionSet1 && selectionSet2) {
    const conflicts = findConflictsBetweenSubSelectionSets(
      context2,
      cachedFieldsAndFragmentNames,
      comparedFieldsAndFragmentPairs,
      comparedFragmentPairs,
      areMutuallyExclusive,
      getNamedType(type1),
      selectionSet1,
      getNamedType(type2),
      selectionSet2
    );
    return subfieldConflicts(conflicts, responseName, node1, node2);
  }
}
function sameArguments(node1, node2) {
  const args1 = node1.arguments;
  const args2 = node2.arguments;
  if (args1 === void 0 || args1.length === 0) {
    return args2 === void 0 || args2.length === 0;
  }
  if (args2 === void 0 || args2.length === 0) {
    return false;
  }
  if (args1.length !== args2.length) {
    return false;
  }
  const values2 = new Map(args2.map(({ name, value }) => [name.value, value]));
  return args1.every((arg1) => {
    const value1 = arg1.value;
    const value2 = values2.get(arg1.name.value);
    if (value2 === void 0) {
      return false;
    }
    return stringifyValue(value1) === stringifyValue(value2);
  });
}
function stringifyValue(value) {
  return print(sortValueNode(value));
}
function doTypesConflict(type1, type2) {
  if (isListType(type1)) {
    return isListType(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (isListType(type2)) {
    return true;
  }
  if (isNonNullType(type1)) {
    return isNonNullType(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (isNonNullType(type2)) {
    return true;
  }
  if (isLeafType(type1) || isLeafType(type2)) {
    return type1 !== type2;
  }
  return false;
}
function getFieldsAndFragmentNames(context2, cachedFieldsAndFragmentNames, parentType, selectionSet) {
  const cached = cachedFieldsAndFragmentNames.get(selectionSet);
  if (cached) {
    return cached;
  }
  const nodeAndDefs = /* @__PURE__ */ Object.create(null);
  const fragmentNames = /* @__PURE__ */ Object.create(null);
  _collectFieldsAndFragmentNames(
    context2,
    parentType,
    selectionSet,
    nodeAndDefs,
    fragmentNames
  );
  const result = [nodeAndDefs, Object.keys(fragmentNames)];
  cachedFieldsAndFragmentNames.set(selectionSet, result);
  return result;
}
function getReferencedFieldsAndFragmentNames(context2, cachedFieldsAndFragmentNames, fragment) {
  const cached = cachedFieldsAndFragmentNames.get(fragment.selectionSet);
  if (cached) {
    return cached;
  }
  const fragmentType = typeFromAST(context2.getSchema(), fragment.typeCondition);
  return getFieldsAndFragmentNames(
    context2,
    cachedFieldsAndFragmentNames,
    fragmentType,
    fragment.selectionSet
  );
}
function _collectFieldsAndFragmentNames(context2, parentType, selectionSet, nodeAndDefs, fragmentNames) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        const fieldName = selection.name.value;
        let fieldDef;
        if (isObjectType(parentType) || isInterfaceType(parentType)) {
          fieldDef = parentType.getFields()[fieldName];
        }
        const responseName = selection.alias ? selection.alias.value : fieldName;
        if (!nodeAndDefs[responseName]) {
          nodeAndDefs[responseName] = [];
        }
        nodeAndDefs[responseName].push([parentType, selection, fieldDef]);
        break;
      }
      case Kind.FRAGMENT_SPREAD:
        fragmentNames[selection.name.value] = true;
        break;
      case Kind.INLINE_FRAGMENT: {
        const typeCondition = selection.typeCondition;
        const inlineFragmentType = typeCondition ? typeFromAST(context2.getSchema(), typeCondition) : parentType;
        _collectFieldsAndFragmentNames(
          context2,
          inlineFragmentType,
          selection.selectionSet,
          nodeAndDefs,
          fragmentNames
        );
        break;
      }
    }
  }
}
function subfieldConflicts(conflicts, responseName, node1, node2) {
  if (conflicts.length > 0) {
    return [
      [responseName, conflicts.map(([reason]) => reason)],
      [node1, ...conflicts.map(([, fields1]) => fields1).flat()],
      [node2, ...conflicts.map(([, , fields2]) => fields2).flat()]
    ];
  }
}
var OrderedPairSet = class {
  constructor() {
    this._data = /* @__PURE__ */ new Map();
  }
  has(a, b, weaklyPresent) {
    var _this$_data$get;
    const result = (_this$_data$get = this._data.get(a)) === null || _this$_data$get === void 0 ? void 0 : _this$_data$get.get(b);
    if (result === void 0) {
      return false;
    }
    return weaklyPresent ? true : weaklyPresent === result;
  }
  add(a, b, weaklyPresent) {
    const map2 = this._data.get(a);
    if (map2 === void 0) {
      this._data.set(a, /* @__PURE__ */ new Map([[b, weaklyPresent]]));
    } else {
      map2.set(b, weaklyPresent);
    }
  }
};
var PairSet = class {
  constructor() {
    this._orderedPairSet = new OrderedPairSet();
  }
  has(a, b, weaklyPresent) {
    return a < b ? this._orderedPairSet.has(a, b, weaklyPresent) : this._orderedPairSet.has(b, a, weaklyPresent);
  }
  add(a, b, weaklyPresent) {
    if (a < b) {
      this._orderedPairSet.add(a, b, weaklyPresent);
    } else {
      this._orderedPairSet.add(b, a, weaklyPresent);
    }
  }
};

// node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.mjs
function PossibleFragmentSpreadsRule(context2) {
  return {
    InlineFragment(node) {
      const fragType = context2.getType();
      const parentType = context2.getParentType();
      if (isCompositeType(fragType) && isCompositeType(parentType) && !doTypesOverlap(context2.getSchema(), fragType, parentType)) {
        const parentTypeStr = inspect(parentType);
        const fragTypeStr = inspect(fragType);
        context2.reportError(
          new GraphQLError(
            `Fragment cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
            {
              nodes: node
            }
          )
        );
      }
    },
    FragmentSpread(node) {
      const fragName = node.name.value;
      const fragType = getFragmentType(context2, fragName);
      const parentType = context2.getParentType();
      if (fragType && parentType && !doTypesOverlap(context2.getSchema(), fragType, parentType)) {
        const parentTypeStr = inspect(parentType);
        const fragTypeStr = inspect(fragType);
        context2.reportError(
          new GraphQLError(
            `Fragment "${fragName}" cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
            {
              nodes: node
            }
          )
        );
      }
    }
  };
}
function getFragmentType(context2, name) {
  const frag = context2.getFragment(name);
  if (frag) {
    const type = typeFromAST(context2.getSchema(), frag.typeCondition);
    if (isCompositeType(type)) {
      return type;
    }
  }
}

// node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.mjs
function PossibleTypeExtensionsRule(context2) {
  const schema = context2.getSchema();
  const definedTypes = /* @__PURE__ */ Object.create(null);
  for (const def of context2.getDocument().definitions) {
    if (isTypeDefinitionNode(def)) {
      definedTypes[def.name.value] = def;
    }
  }
  return {
    ScalarTypeExtension: checkExtension,
    ObjectTypeExtension: checkExtension,
    InterfaceTypeExtension: checkExtension,
    UnionTypeExtension: checkExtension,
    EnumTypeExtension: checkExtension,
    InputObjectTypeExtension: checkExtension
  };
  function checkExtension(node) {
    const typeName = node.name.value;
    const defNode = definedTypes[typeName];
    const existingType = schema === null || schema === void 0 ? void 0 : schema.getType(typeName);
    let expectedKind;
    if (defNode) {
      expectedKind = defKindToExtKind[defNode.kind];
    } else if (existingType) {
      expectedKind = typeToExtKind(existingType);
    }
    if (expectedKind) {
      if (expectedKind !== node.kind) {
        const kindStr = extensionKindToTypeName(node.kind);
        context2.reportError(
          new GraphQLError(`Cannot extend non-${kindStr} type "${typeName}".`, {
            nodes: defNode ? [defNode, node] : node
          })
        );
      }
    } else {
      const allTypeNames = Object.keys({
        ...definedTypes,
        ...schema === null || schema === void 0 ? void 0 : schema.getTypeMap()
      });
      const suggestedTypes = suggestionList(typeName, allTypeNames);
      context2.reportError(
        new GraphQLError(
          `Cannot extend type "${typeName}" because it is not defined.` + didYouMean(suggestedTypes),
          {
            nodes: node.name
          }
        )
      );
    }
  }
}
var defKindToExtKind = {
  [Kind.SCALAR_TYPE_DEFINITION]: Kind.SCALAR_TYPE_EXTENSION,
  [Kind.OBJECT_TYPE_DEFINITION]: Kind.OBJECT_TYPE_EXTENSION,
  [Kind.INTERFACE_TYPE_DEFINITION]: Kind.INTERFACE_TYPE_EXTENSION,
  [Kind.UNION_TYPE_DEFINITION]: Kind.UNION_TYPE_EXTENSION,
  [Kind.ENUM_TYPE_DEFINITION]: Kind.ENUM_TYPE_EXTENSION,
  [Kind.INPUT_OBJECT_TYPE_DEFINITION]: Kind.INPUT_OBJECT_TYPE_EXTENSION
};
function typeToExtKind(type) {
  if (isScalarType(type)) {
    return Kind.SCALAR_TYPE_EXTENSION;
  }
  if (isObjectType(type)) {
    return Kind.OBJECT_TYPE_EXTENSION;
  }
  if (isInterfaceType(type)) {
    return Kind.INTERFACE_TYPE_EXTENSION;
  }
  if (isUnionType(type)) {
    return Kind.UNION_TYPE_EXTENSION;
  }
  if (isEnumType(type)) {
    return Kind.ENUM_TYPE_EXTENSION;
  }
  if (isInputObjectType(type)) {
    return Kind.INPUT_OBJECT_TYPE_EXTENSION;
  }
  invariant(false, "Unexpected type: " + inspect(type));
}
function extensionKindToTypeName(kind) {
  switch (kind) {
    case Kind.SCALAR_TYPE_EXTENSION:
      return "scalar";
    case Kind.OBJECT_TYPE_EXTENSION:
      return "object";
    case Kind.INTERFACE_TYPE_EXTENSION:
      return "interface";
    case Kind.UNION_TYPE_EXTENSION:
      return "union";
    case Kind.ENUM_TYPE_EXTENSION:
      return "enum";
    case Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return "input object";
    // Not reachable. All possible types have been considered
    /* c8 ignore next */
    default:
      invariant(false, "Unexpected kind: " + inspect(kind));
  }
}

// node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.mjs
function ProvidedRequiredArgumentsRule(context2) {
  return {
    // eslint-disable-next-line new-cap
    ...ProvidedRequiredArgumentsOnDirectivesRule(context2),
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(fieldNode) {
        var _fieldNode$arguments;
        const fieldDef = context2.getFieldDef();
        if (!fieldDef) {
          return false;
        }
        const providedArgs = new Set(
          // FIXME: https://github.com/graphql/graphql-js/issues/2203
          /* c8 ignore next */
          (_fieldNode$arguments = fieldNode.arguments) === null || _fieldNode$arguments === void 0 ? void 0 : _fieldNode$arguments.map((arg) => arg.name.value)
        );
        for (const argDef of fieldDef.args) {
          if (!providedArgs.has(argDef.name) && isRequiredArgument(argDef)) {
            const argTypeStr = inspect(argDef.type);
            context2.reportError(
              new GraphQLError(
                `Field "${fieldDef.name}" argument "${argDef.name}" of type "${argTypeStr}" is required, but it was not provided.`,
                {
                  nodes: fieldNode
                }
              )
            );
          }
        }
      }
    }
  };
}
function ProvidedRequiredArgumentsOnDirectivesRule(context2) {
  var _schema$getDirectives;
  const requiredArgsMap = /* @__PURE__ */ Object.create(null);
  const schema = context2.getSchema();
  const definedDirectives = (_schema$getDirectives = schema === null || schema === void 0 ? void 0 : schema.getDirectives()) !== null && _schema$getDirectives !== void 0 ? _schema$getDirectives : specifiedDirectives;
  for (const directive of definedDirectives) {
    requiredArgsMap[directive.name] = keyMap(
      directive.args.filter(isRequiredArgument),
      (arg) => arg.name
    );
  }
  const astDefinitions = context2.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      var _def$arguments;
      const argNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
      requiredArgsMap[def.name.value] = keyMap(
        argNodes.filter(isRequiredArgumentNode),
        (arg) => arg.name.value
      );
    }
  }
  return {
    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(directiveNode) {
        const directiveName = directiveNode.name.value;
        const requiredArgs = requiredArgsMap[directiveName];
        if (requiredArgs) {
          var _directiveNode$argume;
          const argNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
          const argNodeMap = new Set(argNodes.map((arg) => arg.name.value));
          for (const [argName, argDef] of Object.entries(requiredArgs)) {
            if (!argNodeMap.has(argName)) {
              const argType = isType(argDef.type) ? inspect(argDef.type) : print(argDef.type);
              context2.reportError(
                new GraphQLError(
                  `Directive "@${directiveName}" argument "${argName}" of type "${argType}" is required, but it was not provided.`,
                  {
                    nodes: directiveNode
                  }
                )
              );
            }
          }
        }
      }
    }
  };
}
function isRequiredArgumentNode(arg) {
  return arg.type.kind === Kind.NON_NULL_TYPE && arg.defaultValue == null;
}

// node_modules/graphql/validation/rules/ScalarLeafsRule.mjs
function ScalarLeafsRule(context2) {
  return {
    Field(node) {
      const type = context2.getType();
      const selectionSet = node.selectionSet;
      if (type) {
        if (isLeafType(getNamedType(type))) {
          if (selectionSet) {
            const fieldName = node.name.value;
            const typeStr = inspect(type);
            context2.reportError(
              new GraphQLError(
                `Field "${fieldName}" must not have a selection since type "${typeStr}" has no subfields.`,
                {
                  nodes: selectionSet
                }
              )
            );
          }
        } else if (!selectionSet) {
          const fieldName = node.name.value;
          const typeStr = inspect(type);
          context2.reportError(
            new GraphQLError(
              `Field "${fieldName}" of type "${typeStr}" must have a selection of subfields. Did you mean "${fieldName} { ... }"?`,
              {
                nodes: node
              }
            )
          );
        } else if (selectionSet.selections.length === 0) {
          const fieldName = node.name.value;
          const typeStr = inspect(type);
          context2.reportError(
            new GraphQLError(
              `Field "${fieldName}" of type "${typeStr}" must have at least one field selected.`,
              {
                nodes: node
              }
            )
          );
        }
      }
    }
  };
}

// node_modules/graphql/utilities/valueFromAST.mjs
function valueFromAST(valueNode, type, variables) {
  if (!valueNode) {
    return;
  }
  if (valueNode.kind === Kind.VARIABLE) {
    const variableName = valueNode.name.value;
    if (variables == null || variables[variableName] === void 0) {
      return;
    }
    const variableValue = variables[variableName];
    if (variableValue === null && isNonNullType(type)) {
      return;
    }
    return variableValue;
  }
  if (isNonNullType(type)) {
    if (valueNode.kind === Kind.NULL) {
      return;
    }
    return valueFromAST(valueNode, type.ofType, variables);
  }
  if (valueNode.kind === Kind.NULL) {
    return null;
  }
  if (isListType(type)) {
    const itemType = type.ofType;
    if (valueNode.kind === Kind.LIST) {
      const coercedValues = [];
      for (const itemNode of valueNode.values) {
        if (isMissingVariable(itemNode, variables)) {
          if (isNonNullType(itemType)) {
            return;
          }
          coercedValues.push(null);
        } else {
          const itemValue = valueFromAST(itemNode, itemType, variables);
          if (itemValue === void 0) {
            return;
          }
          coercedValues.push(itemValue);
        }
      }
      return coercedValues;
    }
    const coercedValue = valueFromAST(valueNode, itemType, variables);
    if (coercedValue === void 0) {
      return;
    }
    return [coercedValue];
  }
  if (isInputObjectType(type)) {
    if (valueNode.kind !== Kind.OBJECT) {
      return;
    }
    const coercedObj = /* @__PURE__ */ Object.create(null);
    const fieldNodes = keyMap(valueNode.fields, (field) => field.name.value);
    for (const field of Object.values(type.getFields())) {
      const fieldNode = fieldNodes[field.name];
      if (!fieldNode || isMissingVariable(fieldNode.value, variables)) {
        if (field.defaultValue !== void 0) {
          coercedObj[field.name] = field.defaultValue;
        } else if (isNonNullType(field.type)) {
          return;
        }
        continue;
      }
      const fieldValue = valueFromAST(fieldNode.value, field.type, variables);
      if (fieldValue === void 0) {
        return;
      }
      coercedObj[field.name] = fieldValue;
    }
    if (type.isOneOf) {
      const keys = Object.keys(coercedObj);
      if (keys.length !== 1) {
        return;
      }
      if (coercedObj[keys[0]] === null) {
        return;
      }
    }
    return coercedObj;
  }
  if (isLeafType(type)) {
    let result;
    try {
      result = type.parseLiteral(valueNode, variables);
    } catch (_error) {
      return;
    }
    if (result === void 0) {
      return;
    }
    return result;
  }
  invariant(false, "Unexpected input type: " + inspect(type));
}
function isMissingVariable(valueNode, variables) {
  return valueNode.kind === Kind.VARIABLE && (variables == null || variables[valueNode.name.value] === void 0);
}

// node_modules/graphql/execution/values.mjs
function getArgumentValues(def, node, variableValues) {
  var _node$arguments;
  const coercedValues = {};
  const argumentNodes = (_node$arguments = node.arguments) !== null && _node$arguments !== void 0 ? _node$arguments : [];
  const argNodeMap = keyMap(argumentNodes, (arg) => arg.name.value);
  for (const argDef of def.args) {
    const name = argDef.name;
    const argType = argDef.type;
    const argumentNode = argNodeMap[name];
    if (!argumentNode) {
      if (argDef.defaultValue !== void 0) {
        coercedValues[name] = argDef.defaultValue;
      } else if (isNonNullType(argType)) {
        throw new GraphQLError(
          `Argument "${name}" of required type "${inspect(argType)}" was not provided.`,
          {
            nodes: node
          }
        );
      }
      continue;
    }
    const valueNode = argumentNode.value;
    let isNull = valueNode.kind === Kind.NULL;
    if (valueNode.kind === Kind.VARIABLE) {
      const variableName = valueNode.name.value;
      if (variableValues == null || !hasOwnProperty(variableValues, variableName)) {
        if (argDef.defaultValue !== void 0) {
          coercedValues[name] = argDef.defaultValue;
        } else if (isNonNullType(argType)) {
          throw new GraphQLError(
            `Argument "${name}" of required type "${inspect(argType)}" was provided the variable "$${variableName}" which was not provided a runtime value.`,
            {
              nodes: valueNode
            }
          );
        }
        continue;
      }
      isNull = variableValues[variableName] == null;
    }
    if (isNull && isNonNullType(argType)) {
      throw new GraphQLError(
        `Argument "${name}" of non-null type "${inspect(argType)}" must not be null.`,
        {
          nodes: valueNode
        }
      );
    }
    const coercedValue = valueFromAST(valueNode, argType, variableValues);
    if (coercedValue === void 0) {
      throw new GraphQLError(
        `Argument "${name}" has invalid value ${print(valueNode)}.`,
        {
          nodes: valueNode
        }
      );
    }
    coercedValues[name] = coercedValue;
  }
  return coercedValues;
}
function getDirectiveValues(directiveDef, node, variableValues) {
  var _node$directives;
  const directiveNode = (_node$directives = node.directives) === null || _node$directives === void 0 ? void 0 : _node$directives.find(
    (directive) => directive.name.value === directiveDef.name
  );
  if (directiveNode) {
    return getArgumentValues(directiveDef, directiveNode, variableValues);
  }
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// node_modules/graphql/execution/collectFields.mjs
function collectFields(schema, fragments, variableValues, runtimeType, selectionSet) {
  const fields = /* @__PURE__ */ new Map();
  collectFieldsImpl(
    schema,
    fragments,
    variableValues,
    runtimeType,
    selectionSet,
    fields,
    /* @__PURE__ */ new Set()
  );
  return fields;
}
function collectSubfields(schema, fragments, variableValues, returnType, fieldNodes) {
  const subFieldNodes = /* @__PURE__ */ new Map();
  const visitedFragmentNames = /* @__PURE__ */ new Set();
  for (const node of fieldNodes) {
    if (node.selectionSet) {
      collectFieldsImpl(
        schema,
        fragments,
        variableValues,
        returnType,
        node.selectionSet,
        subFieldNodes,
        visitedFragmentNames
      );
    }
  }
  return subFieldNodes;
}
function collectFieldsImpl(schema, fragments, variableValues, runtimeType, selectionSet, fields, visitedFragmentNames) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        if (!shouldIncludeNode(variableValues, selection)) {
          continue;
        }
        const name = getFieldEntryKey(selection);
        const fieldList = fields.get(name);
        if (fieldList !== void 0) {
          fieldList.push(selection);
        } else {
          fields.set(name, [selection]);
        }
        break;
      }
      case Kind.INLINE_FRAGMENT: {
        if (!shouldIncludeNode(variableValues, selection) || !doesFragmentConditionMatch(schema, selection, runtimeType)) {
          continue;
        }
        collectFieldsImpl(
          schema,
          fragments,
          variableValues,
          runtimeType,
          selection.selectionSet,
          fields,
          visitedFragmentNames
        );
        break;
      }
      case Kind.FRAGMENT_SPREAD: {
        const fragName = selection.name.value;
        if (visitedFragmentNames.has(fragName) || !shouldIncludeNode(variableValues, selection)) {
          continue;
        }
        visitedFragmentNames.add(fragName);
        const fragment = fragments[fragName];
        if (!fragment || !doesFragmentConditionMatch(schema, fragment, runtimeType)) {
          continue;
        }
        collectFieldsImpl(
          schema,
          fragments,
          variableValues,
          runtimeType,
          fragment.selectionSet,
          fields,
          visitedFragmentNames
        );
        break;
      }
    }
  }
}
function shouldIncludeNode(variableValues, node) {
  const skip2 = getDirectiveValues(GraphQLSkipDirective, node, variableValues);
  if ((skip2 === null || skip2 === void 0 ? void 0 : skip2.if) === true) {
    return false;
  }
  const include = getDirectiveValues(
    GraphQLIncludeDirective,
    node,
    variableValues
  );
  if ((include === null || include === void 0 ? void 0 : include.if) === false) {
    return false;
  }
  return true;
}
function doesFragmentConditionMatch(schema, fragment, type) {
  const typeConditionNode = fragment.typeCondition;
  if (!typeConditionNode) {
    return true;
  }
  const conditionalType = typeFromAST(schema, typeConditionNode);
  if (conditionalType === type) {
    return true;
  }
  if (isAbstractType(conditionalType)) {
    return schema.isSubType(conditionalType, type);
  }
  return false;
}
function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}

// node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.mjs
function SingleFieldSubscriptionsRule(context2) {
  return {
    OperationDefinition(node) {
      if (node.operation === "subscription") {
        const schema = context2.getSchema();
        const subscriptionType = schema.getSubscriptionType();
        if (subscriptionType) {
          const operationName = node.name ? node.name.value : null;
          const variableValues = /* @__PURE__ */ Object.create(null);
          const document = context2.getDocument();
          const fragments = /* @__PURE__ */ Object.create(null);
          for (const definition of document.definitions) {
            if (definition.kind === Kind.FRAGMENT_DEFINITION) {
              fragments[definition.name.value] = definition;
            }
          }
          const fields = collectFields(
            schema,
            fragments,
            variableValues,
            subscriptionType,
            node.selectionSet
          );
          if (fields.size > 1) {
            const fieldSelectionLists = [...fields.values()];
            const extraFieldSelectionLists = fieldSelectionLists.slice(1);
            const extraFieldSelections = extraFieldSelectionLists.flat();
            context2.reportError(
              new GraphQLError(
                operationName != null ? `Subscription "${operationName}" must select only one top level field.` : "Anonymous Subscription must select only one top level field.",
                {
                  nodes: extraFieldSelections
                }
              )
            );
          }
          for (const fieldNodes of fields.values()) {
            const field = fieldNodes[0];
            const fieldName = field.name.value;
            if (fieldName.startsWith("__")) {
              context2.reportError(
                new GraphQLError(
                  operationName != null ? `Subscription "${operationName}" must not select an introspection top level field.` : "Anonymous Subscription must not select an introspection top level field.",
                  {
                    nodes: fieldNodes
                  }
                )
              );
            }
          }
        }
      }
    }
  };
}

// node_modules/graphql/jsutils/groupBy.mjs
function groupBy(list, keyFn) {
  const result = /* @__PURE__ */ new Map();
  for (const item of list) {
    const key = keyFn(item);
    const group = result.get(key);
    if (group === void 0) {
      result.set(key, [item]);
    } else {
      group.push(item);
    }
  }
  return result;
}

// node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.mjs
function UniqueArgumentDefinitionNamesRule(context2) {
  return {
    DirectiveDefinition(directiveNode) {
      var _directiveNode$argume;
      const argumentNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
      return checkArgUniqueness(`@${directiveNode.name.value}`, argumentNodes);
    },
    InterfaceTypeDefinition: checkArgUniquenessPerField,
    InterfaceTypeExtension: checkArgUniquenessPerField,
    ObjectTypeDefinition: checkArgUniquenessPerField,
    ObjectTypeExtension: checkArgUniquenessPerField
  };
  function checkArgUniquenessPerField(typeNode) {
    var _typeNode$fields;
    const typeName = typeNode.name.value;
    const fieldNodes = (_typeNode$fields = typeNode.fields) !== null && _typeNode$fields !== void 0 ? _typeNode$fields : [];
    for (const fieldDef of fieldNodes) {
      var _fieldDef$arguments;
      const fieldName = fieldDef.name.value;
      const argumentNodes = (_fieldDef$arguments = fieldDef.arguments) !== null && _fieldDef$arguments !== void 0 ? _fieldDef$arguments : [];
      checkArgUniqueness(`${typeName}.${fieldName}`, argumentNodes);
    }
    return false;
  }
  function checkArgUniqueness(parentName, argumentNodes) {
    const seenArgs = groupBy(argumentNodes, (arg) => arg.name.value);
    for (const [argName, argNodes] of seenArgs) {
      if (argNodes.length > 1) {
        context2.reportError(
          new GraphQLError(
            `Argument "${parentName}(${argName}:)" can only be defined once.`,
            {
              nodes: argNodes.map((node) => node.name)
            }
          )
        );
      }
    }
    return false;
  }
}

// node_modules/graphql/validation/rules/UniqueArgumentNamesRule.mjs
function UniqueArgumentNamesRule(context2) {
  return {
    Field: checkArgUniqueness,
    Directive: checkArgUniqueness
  };
  function checkArgUniqueness(parentNode) {
    var _parentNode$arguments;
    const argumentNodes = (_parentNode$arguments = parentNode.arguments) !== null && _parentNode$arguments !== void 0 ? _parentNode$arguments : [];
    const seenArgs = groupBy(argumentNodes, (arg) => arg.name.value);
    for (const [argName, argNodes] of seenArgs) {
      if (argNodes.length > 1) {
        context2.reportError(
          new GraphQLError(
            `There can be only one argument named "${argName}".`,
            {
              nodes: argNodes.map((node) => node.name)
            }
          )
        );
      }
    }
  }
}

// node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.mjs
function UniqueDirectiveNamesRule(context2) {
  const knownDirectiveNames = /* @__PURE__ */ Object.create(null);
  const schema = context2.getSchema();
  return {
    DirectiveDefinition(node) {
      const directiveName = node.name.value;
      if (schema !== null && schema !== void 0 && schema.getDirective(directiveName)) {
        context2.reportError(
          new GraphQLError(
            `Directive "@${directiveName}" already exists in the schema. It cannot be redefined.`,
            {
              nodes: node.name
            }
          )
        );
        return;
      }
      if (knownDirectiveNames[directiveName]) {
        context2.reportError(
          new GraphQLError(
            `There can be only one directive named "@${directiveName}".`,
            {
              nodes: [knownDirectiveNames[directiveName], node.name]
            }
          )
        );
      } else {
        knownDirectiveNames[directiveName] = node.name;
      }
      return false;
    }
  };
}

// node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.mjs
function UniqueDirectivesPerLocationRule(context2) {
  const uniqueDirectiveMap = /* @__PURE__ */ Object.create(null);
  const schema = context2.getSchema();
  const definedDirectives = schema ? schema.getDirectives() : specifiedDirectives;
  for (const directive of definedDirectives) {
    uniqueDirectiveMap[directive.name] = !directive.isRepeatable;
  }
  const astDefinitions = context2.getDocument().definitions;
  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      uniqueDirectiveMap[def.name.value] = !def.repeatable;
    }
  }
  const schemaDirectives = /* @__PURE__ */ Object.create(null);
  const typeDirectivesMap = /* @__PURE__ */ Object.create(null);
  return {
    // Many different AST nodes may contain directives. Rather than listing
    // them all, just listen for entering any node, and check to see if it
    // defines any directives.
    enter(node) {
      if (!("directives" in node) || !node.directives) {
        return;
      }
      let seenDirectives;
      if (node.kind === Kind.SCHEMA_DEFINITION || node.kind === Kind.SCHEMA_EXTENSION) {
        seenDirectives = schemaDirectives;
      } else if (isTypeDefinitionNode(node) || isTypeExtensionNode(node)) {
        const typeName = node.name.value;
        seenDirectives = typeDirectivesMap[typeName];
        if (seenDirectives === void 0) {
          typeDirectivesMap[typeName] = seenDirectives = /* @__PURE__ */ Object.create(null);
        }
      } else {
        seenDirectives = /* @__PURE__ */ Object.create(null);
      }
      for (const directive of node.directives) {
        const directiveName = directive.name.value;
        if (uniqueDirectiveMap[directiveName]) {
          if (seenDirectives[directiveName]) {
            context2.reportError(
              new GraphQLError(
                `The directive "@${directiveName}" can only be used once at this location.`,
                {
                  nodes: [seenDirectives[directiveName], directive]
                }
              )
            );
          } else {
            seenDirectives[directiveName] = directive;
          }
        }
      }
    }
  };
}

// node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.mjs
function UniqueEnumValueNamesRule(context2) {
  const schema = context2.getSchema();
  const existingTypeMap = schema ? schema.getTypeMap() : /* @__PURE__ */ Object.create(null);
  const knownValueNames = /* @__PURE__ */ Object.create(null);
  return {
    EnumTypeDefinition: checkValueUniqueness,
    EnumTypeExtension: checkValueUniqueness
  };
  function checkValueUniqueness(node) {
    var _node$values;
    const typeName = node.name.value;
    if (!knownValueNames[typeName]) {
      knownValueNames[typeName] = /* @__PURE__ */ Object.create(null);
    }
    const valueNodes = (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : [];
    const valueNames = knownValueNames[typeName];
    for (const valueDef of valueNodes) {
      const valueName = valueDef.name.value;
      const existingType = existingTypeMap[typeName];
      if (isEnumType(existingType) && existingType.getValue(valueName)) {
        context2.reportError(
          new GraphQLError(
            `Enum value "${typeName}.${valueName}" already exists in the schema. It cannot also be defined in this type extension.`,
            {
              nodes: valueDef.name
            }
          )
        );
      } else if (valueNames[valueName]) {
        context2.reportError(
          new GraphQLError(
            `Enum value "${typeName}.${valueName}" can only be defined once.`,
            {
              nodes: [valueNames[valueName], valueDef.name]
            }
          )
        );
      } else {
        valueNames[valueName] = valueDef.name;
      }
    }
    return false;
  }
}

// node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.mjs
function UniqueFieldDefinitionNamesRule(context2) {
  const schema = context2.getSchema();
  const existingTypeMap = schema ? schema.getTypeMap() : /* @__PURE__ */ Object.create(null);
  const knownFieldNames = /* @__PURE__ */ Object.create(null);
  return {
    InputObjectTypeDefinition: checkFieldUniqueness,
    InputObjectTypeExtension: checkFieldUniqueness,
    InterfaceTypeDefinition: checkFieldUniqueness,
    InterfaceTypeExtension: checkFieldUniqueness,
    ObjectTypeDefinition: checkFieldUniqueness,
    ObjectTypeExtension: checkFieldUniqueness
  };
  function checkFieldUniqueness(node) {
    var _node$fields;
    const typeName = node.name.value;
    if (!knownFieldNames[typeName]) {
      knownFieldNames[typeName] = /* @__PURE__ */ Object.create(null);
    }
    const fieldNodes = (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : [];
    const fieldNames = knownFieldNames[typeName];
    for (const fieldDef of fieldNodes) {
      const fieldName = fieldDef.name.value;
      if (hasField(existingTypeMap[typeName], fieldName)) {
        context2.reportError(
          new GraphQLError(
            `Field "${typeName}.${fieldName}" already exists in the schema. It cannot also be defined in this type extension.`,
            {
              nodes: fieldDef.name
            }
          )
        );
      } else if (fieldNames[fieldName]) {
        context2.reportError(
          new GraphQLError(
            `Field "${typeName}.${fieldName}" can only be defined once.`,
            {
              nodes: [fieldNames[fieldName], fieldDef.name]
            }
          )
        );
      } else {
        fieldNames[fieldName] = fieldDef.name;
      }
    }
    return false;
  }
}
function hasField(type, fieldName) {
  if (isObjectType(type) || isInterfaceType(type) || isInputObjectType(type)) {
    return type.getFields()[fieldName] != null;
  }
  return false;
}

// node_modules/graphql/validation/rules/UniqueFragmentNamesRule.mjs
function UniqueFragmentNamesRule(context2) {
  const knownFragmentNames = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: () => false,
    FragmentDefinition(node) {
      const fragmentName = node.name.value;
      if (knownFragmentNames[fragmentName]) {
        context2.reportError(
          new GraphQLError(
            `There can be only one fragment named "${fragmentName}".`,
            {
              nodes: [knownFragmentNames[fragmentName], node.name]
            }
          )
        );
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }
      return false;
    }
  };
}

// node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.mjs
function UniqueInputFieldNamesRule(context2) {
  const knownNameStack = [];
  let knownNames = /* @__PURE__ */ Object.create(null);
  return {
    ObjectValue: {
      enter() {
        knownNameStack.push(knownNames);
        knownNames = /* @__PURE__ */ Object.create(null);
      },
      leave() {
        const prevKnownNames = knownNameStack.pop();
        prevKnownNames || invariant(false);
        knownNames = prevKnownNames;
      }
    },
    ObjectField(node) {
      const fieldName = node.name.value;
      if (knownNames[fieldName]) {
        context2.reportError(
          new GraphQLError(
            `There can be only one input field named "${fieldName}".`,
            {
              nodes: [knownNames[fieldName], node.name]
            }
          )
        );
      } else {
        knownNames[fieldName] = node.name;
      }
    }
  };
}

// node_modules/graphql/validation/rules/UniqueOperationNamesRule.mjs
function UniqueOperationNamesRule(context2) {
  const knownOperationNames = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition(node) {
      const operationName = node.name;
      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context2.reportError(
            new GraphQLError(
              `There can be only one operation named "${operationName.value}".`,
              {
                nodes: [
                  knownOperationNames[operationName.value],
                  operationName
                ]
              }
            )
          );
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }
      return false;
    },
    FragmentDefinition: () => false
  };
}

// node_modules/graphql/validation/rules/UniqueOperationTypesRule.mjs
function UniqueOperationTypesRule(context2) {
  const schema = context2.getSchema();
  const definedOperationTypes = /* @__PURE__ */ Object.create(null);
  const existingOperationTypes = schema ? {
    query: schema.getQueryType(),
    mutation: schema.getMutationType(),
    subscription: schema.getSubscriptionType()
  } : {};
  return {
    SchemaDefinition: checkOperationTypes,
    SchemaExtension: checkOperationTypes
  };
  function checkOperationTypes(node) {
    var _node$operationTypes;
    const operationTypesNodes = (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : [];
    for (const operationType of operationTypesNodes) {
      const operation = operationType.operation;
      const alreadyDefinedOperationType = definedOperationTypes[operation];
      if (existingOperationTypes[operation]) {
        context2.reportError(
          new GraphQLError(
            `Type for ${operation} already defined in the schema. It cannot be redefined.`,
            {
              nodes: operationType
            }
          )
        );
      } else if (alreadyDefinedOperationType) {
        context2.reportError(
          new GraphQLError(
            `There can be only one ${operation} type in schema.`,
            {
              nodes: [alreadyDefinedOperationType, operationType]
            }
          )
        );
      } else {
        definedOperationTypes[operation] = operationType;
      }
    }
    return false;
  }
}

// node_modules/graphql/validation/rules/UniqueTypeNamesRule.mjs
function UniqueTypeNamesRule(context2) {
  const knownTypeNames = /* @__PURE__ */ Object.create(null);
  const schema = context2.getSchema();
  return {
    ScalarTypeDefinition: checkTypeName,
    ObjectTypeDefinition: checkTypeName,
    InterfaceTypeDefinition: checkTypeName,
    UnionTypeDefinition: checkTypeName,
    EnumTypeDefinition: checkTypeName,
    InputObjectTypeDefinition: checkTypeName
  };
  function checkTypeName(node) {
    const typeName = node.name.value;
    if (schema !== null && schema !== void 0 && schema.getType(typeName)) {
      context2.reportError(
        new GraphQLError(
          `Type "${typeName}" already exists in the schema. It cannot also be defined in this type definition.`,
          {
            nodes: node.name
          }
        )
      );
      return;
    }
    if (knownTypeNames[typeName]) {
      context2.reportError(
        new GraphQLError(`There can be only one type named "${typeName}".`, {
          nodes: [knownTypeNames[typeName], node.name]
        })
      );
    } else {
      knownTypeNames[typeName] = node.name;
    }
    return false;
  }
}

// node_modules/graphql/validation/rules/UniqueVariableNamesRule.mjs
function UniqueVariableNamesRule(context2) {
  return {
    OperationDefinition(operationNode) {
      var _operationNode$variab;
      const variableDefinitions = (_operationNode$variab = operationNode.variableDefinitions) !== null && _operationNode$variab !== void 0 ? _operationNode$variab : [];
      const seenVariableDefinitions = groupBy(
        variableDefinitions,
        (node) => node.variable.name.value
      );
      for (const [variableName, variableNodes] of seenVariableDefinitions) {
        if (variableNodes.length > 1) {
          context2.reportError(
            new GraphQLError(
              `There can be only one variable named "$${variableName}".`,
              {
                nodes: variableNodes.map((node) => node.variable.name)
              }
            )
          );
        }
      }
    }
  };
}

// node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.mjs
function ValuesOfCorrectTypeRule(context2) {
  let variableDefinitions = {};
  return {
    OperationDefinition: {
      enter() {
        variableDefinitions = {};
      }
    },
    VariableDefinition(definition) {
      variableDefinitions[definition.variable.name.value] = definition;
    },
    ListValue(node) {
      const type = getNullableType(context2.getParentInputType());
      if (!isListType(type)) {
        isValidValueNode(context2, node);
        return false;
      }
    },
    ObjectValue(node) {
      const type = getNamedType(context2.getInputType());
      if (!isInputObjectType(type)) {
        isValidValueNode(context2, node);
        return false;
      }
      const fieldNodeMap = keyMap(node.fields, (field) => field.name.value);
      for (const fieldDef of Object.values(type.getFields())) {
        const fieldNode = fieldNodeMap[fieldDef.name];
        if (!fieldNode && isRequiredInputField(fieldDef)) {
          const typeStr = inspect(fieldDef.type);
          context2.reportError(
            new GraphQLError(
              `Field "${type.name}.${fieldDef.name}" of required type "${typeStr}" was not provided.`,
              {
                nodes: node
              }
            )
          );
        }
      }
      if (type.isOneOf) {
        validateOneOfInputObject(
          context2,
          node,
          type,
          fieldNodeMap,
          variableDefinitions
        );
      }
    },
    ObjectField(node) {
      const parentType = getNamedType(context2.getParentInputType());
      const fieldType = context2.getInputType();
      if (!fieldType && isInputObjectType(parentType)) {
        const suggestions = suggestionList(
          node.name.value,
          Object.keys(parentType.getFields())
        );
        context2.reportError(
          new GraphQLError(
            `Field "${node.name.value}" is not defined by type "${parentType.name}".` + didYouMean(suggestions),
            {
              nodes: node
            }
          )
        );
      }
    },
    NullValue(node) {
      const type = context2.getInputType();
      if (isNonNullType(type)) {
        context2.reportError(
          new GraphQLError(
            `Expected value of type "${inspect(type)}", found ${print(node)}.`,
            {
              nodes: node
            }
          )
        );
      }
    },
    EnumValue: (node) => isValidValueNode(context2, node),
    IntValue: (node) => isValidValueNode(context2, node),
    FloatValue: (node) => isValidValueNode(context2, node),
    StringValue: (node) => isValidValueNode(context2, node),
    BooleanValue: (node) => isValidValueNode(context2, node)
  };
}
function isValidValueNode(context2, node) {
  const locationType = context2.getInputType();
  if (!locationType) {
    return;
  }
  const type = getNamedType(locationType);
  if (!isLeafType(type)) {
    const typeStr = inspect(locationType);
    context2.reportError(
      new GraphQLError(
        `Expected value of type "${typeStr}", found ${print(node)}.`,
        {
          nodes: node
        }
      )
    );
    return;
  }
  try {
    const parseResult = type.parseLiteral(
      node,
      void 0
      /* variables */
    );
    if (parseResult === void 0) {
      const typeStr = inspect(locationType);
      context2.reportError(
        new GraphQLError(
          `Expected value of type "${typeStr}", found ${print(node)}.`,
          {
            nodes: node
          }
        )
      );
    }
  } catch (error) {
    const typeStr = inspect(locationType);
    if (error instanceof GraphQLError) {
      context2.reportError(error);
    } else {
      context2.reportError(
        new GraphQLError(
          `Expected value of type "${typeStr}", found ${print(node)}; ` + error.message,
          {
            nodes: node,
            originalError: error
          }
        )
      );
    }
  }
}
function validateOneOfInputObject(context2, node, type, fieldNodeMap, variableDefinitions) {
  var _fieldNodeMap$keys$;
  const keys = Object.keys(fieldNodeMap);
  const isNotExactlyOneField = keys.length !== 1;
  if (isNotExactlyOneField) {
    context2.reportError(
      new GraphQLError(
        `OneOf Input Object "${type.name}" must specify exactly one key.`,
        {
          nodes: [node]
        }
      )
    );
    return;
  }
  const value = (_fieldNodeMap$keys$ = fieldNodeMap[keys[0]]) === null || _fieldNodeMap$keys$ === void 0 ? void 0 : _fieldNodeMap$keys$.value;
  const isNullLiteral = !value || value.kind === Kind.NULL;
  const isVariable = (value === null || value === void 0 ? void 0 : value.kind) === Kind.VARIABLE;
  if (isNullLiteral) {
    context2.reportError(
      new GraphQLError(`Field "${type.name}.${keys[0]}" must be non-null.`, {
        nodes: [node]
      })
    );
    return;
  }
  if (isVariable) {
    const variableName = value.name.value;
    const definition = variableDefinitions[variableName];
    const isNullableVariable = definition.type.kind !== Kind.NON_NULL_TYPE;
    if (isNullableVariable) {
      context2.reportError(
        new GraphQLError(
          `Variable "${variableName}" must be non-nullable to be used for OneOf Input Object "${type.name}".`,
          {
            nodes: [node]
          }
        )
      );
    }
  }
}

// node_modules/graphql/validation/rules/VariablesAreInputTypesRule.mjs
function VariablesAreInputTypesRule(context2) {
  return {
    VariableDefinition(node) {
      const type = typeFromAST(context2.getSchema(), node.type);
      if (type !== void 0 && !isInputType(type)) {
        const variableName = node.variable.name.value;
        const typeName = print(node.type);
        context2.reportError(
          new GraphQLError(
            `Variable "$${variableName}" cannot be non-input type "${typeName}".`,
            {
              nodes: node.type
            }
          )
        );
      }
    }
  };
}

// node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.mjs
function VariablesInAllowedPositionRule(context2) {
  let varDefMap = /* @__PURE__ */ Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        varDefMap = /* @__PURE__ */ Object.create(null);
      },
      leave(operation) {
        const usages = context2.getRecursiveVariableUsages(operation);
        for (const { node, type, defaultValue, parentType } of usages) {
          const varName = node.name.value;
          const varDef = varDefMap[varName];
          if (varDef && type) {
            const schema = context2.getSchema();
            const varType = typeFromAST(schema, varDef.type);
            if (varType && !allowedVariableUsage(
              schema,
              varType,
              varDef.defaultValue,
              type,
              defaultValue
            )) {
              const varTypeStr = inspect(varType);
              const typeStr = inspect(type);
              context2.reportError(
                new GraphQLError(
                  `Variable "$${varName}" of type "${varTypeStr}" used in position expecting type "${typeStr}".`,
                  {
                    nodes: [varDef, node]
                  }
                )
              );
            }
            if (isInputObjectType(parentType) && parentType.isOneOf && isNullableType(varType)) {
              context2.reportError(
                new GraphQLError(
                  `Variable "$${varName}" is of type "${varType}" but must be non-nullable to be used for OneOf Input Object "${parentType}".`,
                  {
                    nodes: [varDef, node]
                  }
                )
              );
            }
          }
        }
      }
    },
    VariableDefinition(node) {
      varDefMap[node.variable.name.value] = node;
    }
  };
}
function allowedVariableUsage(schema, varType, varDefaultValue, locationType, locationDefaultValue) {
  if (isNonNullType(locationType) && !isNonNullType(varType)) {
    const hasNonNullVariableDefaultValue = varDefaultValue != null && varDefaultValue.kind !== Kind.NULL;
    const hasLocationDefaultValue = locationDefaultValue !== void 0;
    if (!hasNonNullVariableDefaultValue && !hasLocationDefaultValue) {
      return false;
    }
    const nullableLocationType = locationType.ofType;
    return isTypeSubTypeOf(schema, varType, nullableLocationType);
  }
  return isTypeSubTypeOf(schema, varType, locationType);
}

// node_modules/graphql/validation/specifiedRules.mjs
var recommendedRules = Object.freeze([MaxIntrospectionDepthRule]);
var specifiedRules = Object.freeze([
  ExecutableDefinitionsRule,
  UniqueOperationNamesRule,
  LoneAnonymousOperationRule,
  SingleFieldSubscriptionsRule,
  KnownTypeNamesRule,
  FragmentsOnCompositeTypesRule,
  VariablesAreInputTypesRule,
  ScalarLeafsRule,
  FieldsOnCorrectTypeRule,
  UniqueFragmentNamesRule,
  KnownFragmentNamesRule,
  NoUnusedFragmentsRule,
  PossibleFragmentSpreadsRule,
  NoFragmentCyclesRule,
  UniqueVariableNamesRule,
  NoUndefinedVariablesRule,
  NoUnusedVariablesRule,
  KnownDirectivesRule,
  UniqueDirectivesPerLocationRule,
  KnownArgumentNamesRule,
  UniqueArgumentNamesRule,
  ValuesOfCorrectTypeRule,
  ProvidedRequiredArgumentsRule,
  VariablesInAllowedPositionRule,
  OverlappingFieldsCanBeMergedRule,
  UniqueInputFieldNamesRule,
  ...recommendedRules
]);
var specifiedSDLRules = Object.freeze([
  LoneSchemaDefinitionRule,
  UniqueOperationTypesRule,
  UniqueTypeNamesRule,
  UniqueEnumValueNamesRule,
  UniqueFieldDefinitionNamesRule,
  UniqueArgumentDefinitionNamesRule,
  UniqueDirectiveNamesRule,
  KnownTypeNamesRule,
  KnownDirectivesRule,
  UniqueDirectivesPerLocationRule,
  PossibleTypeExtensionsRule,
  KnownArgumentNamesOnDirectivesRule,
  UniqueArgumentNamesRule,
  UniqueInputFieldNamesRule,
  ProvidedRequiredArgumentsOnDirectivesRule
]);

// node_modules/graphql/jsutils/memoize3.mjs
function memoize3(fn) {
  let cache0;
  return function memoized(a1, a2, a3) {
    if (cache0 === void 0) {
      cache0 = /* @__PURE__ */ new WeakMap();
    }
    let cache1 = cache0.get(a1);
    if (cache1 === void 0) {
      cache1 = /* @__PURE__ */ new WeakMap();
      cache0.set(a1, cache1);
    }
    let cache2 = cache1.get(a2);
    if (cache2 === void 0) {
      cache2 = /* @__PURE__ */ new WeakMap();
      cache1.set(a2, cache2);
    }
    let fnResult = cache2.get(a3);
    if (fnResult === void 0) {
      fnResult = fn(a1, a2, a3);
      cache2.set(a3, fnResult);
    }
    return fnResult;
  };
}

// node_modules/graphql/execution/execute.mjs
var collectSubfields2 = memoize3(
  (exeContext, returnType, fieldNodes) => collectSubfields(
    exeContext.schema,
    exeContext.fragments,
    exeContext.variableValues,
    returnType,
    fieldNodes
  )
);

// node_modules/graphql/utilities/extendSchema.mjs
var stdTypeMap = keyMap(
  [...specifiedScalarTypes, ...introspectionTypes],
  (type) => type.name
);

// node_modules/graphql/utilities/findBreakingChanges.mjs
var BreakingChangeType;
(function(BreakingChangeType2) {
  BreakingChangeType2["TYPE_REMOVED"] = "TYPE_REMOVED";
  BreakingChangeType2["TYPE_CHANGED_KIND"] = "TYPE_CHANGED_KIND";
  BreakingChangeType2["TYPE_REMOVED_FROM_UNION"] = "TYPE_REMOVED_FROM_UNION";
  BreakingChangeType2["VALUE_REMOVED_FROM_ENUM"] = "VALUE_REMOVED_FROM_ENUM";
  BreakingChangeType2["REQUIRED_INPUT_FIELD_ADDED"] = "REQUIRED_INPUT_FIELD_ADDED";
  BreakingChangeType2["IMPLEMENTED_INTERFACE_REMOVED"] = "IMPLEMENTED_INTERFACE_REMOVED";
  BreakingChangeType2["FIELD_REMOVED"] = "FIELD_REMOVED";
  BreakingChangeType2["FIELD_CHANGED_KIND"] = "FIELD_CHANGED_KIND";
  BreakingChangeType2["REQUIRED_ARG_ADDED"] = "REQUIRED_ARG_ADDED";
  BreakingChangeType2["ARG_REMOVED"] = "ARG_REMOVED";
  BreakingChangeType2["ARG_CHANGED_KIND"] = "ARG_CHANGED_KIND";
  BreakingChangeType2["DIRECTIVE_REMOVED"] = "DIRECTIVE_REMOVED";
  BreakingChangeType2["DIRECTIVE_ARG_REMOVED"] = "DIRECTIVE_ARG_REMOVED";
  BreakingChangeType2["REQUIRED_DIRECTIVE_ARG_ADDED"] = "REQUIRED_DIRECTIVE_ARG_ADDED";
  BreakingChangeType2["DIRECTIVE_REPEATABLE_REMOVED"] = "DIRECTIVE_REPEATABLE_REMOVED";
  BreakingChangeType2["DIRECTIVE_LOCATION_REMOVED"] = "DIRECTIVE_LOCATION_REMOVED";
})(BreakingChangeType || (BreakingChangeType = {}));
var DangerousChangeType;
(function(DangerousChangeType2) {
  DangerousChangeType2["VALUE_ADDED_TO_ENUM"] = "VALUE_ADDED_TO_ENUM";
  DangerousChangeType2["TYPE_ADDED_TO_UNION"] = "TYPE_ADDED_TO_UNION";
  DangerousChangeType2["OPTIONAL_INPUT_FIELD_ADDED"] = "OPTIONAL_INPUT_FIELD_ADDED";
  DangerousChangeType2["OPTIONAL_ARG_ADDED"] = "OPTIONAL_ARG_ADDED";
  DangerousChangeType2["IMPLEMENTED_INTERFACE_ADDED"] = "IMPLEMENTED_INTERFACE_ADDED";
  DangerousChangeType2["ARG_DEFAULT_VALUE_CHANGE"] = "ARG_DEFAULT_VALUE_CHANGE";
})(DangerousChangeType || (DangerousChangeType = {}));

// node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from3, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from3.length, ar; i < l; i++) {
    if (ar || !(i in from3)) {
      if (!ar) ar = Array.prototype.slice.call(from3, 0, i);
      ar[i] = from3[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from3));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}

// node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscription.js
var Subscription = (function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = (function() {
    var empty4 = new Subscription2();
    empty4.closed = true;
    return empty4;
  })();
  return Subscription2;
})();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}

// node_modules/rxjs/dist/esm5/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout: function(handler2, timeout2) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout.apply(delegate, __spreadArray([handler2, timeout2], __read(args)));
    }
    return setTimeout.apply(void 0, __spreadArray([handler2, timeout2], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var COMPLETE_NOTIFICATION = (function() {
  return createNotification("C", void 0, void 0);
})();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}

// node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscriber.js
var Subscriber = (function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
})(Subscription);
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = (function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
})();
var SafeSubscriber = (function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
})(Subscriber);
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification && timeoutProvider.setTimeout(function() {
    return onStoppedNotification(notification, subscriber);
  });
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm5/internal/symbol/observable.js
var observable = (function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
})();

// node_modules/rxjs/dist/esm5/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm5/internal/util/pipe.js
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}

// node_modules/rxjs/dist/esm5/internal/Observable.js
var Observable = (function() {
  function Observable2(subscribe2) {
    if (subscribe2) {
      this._subscribe = subscribe2;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe2) {
    return new Observable2(subscribe2);
  };
  return Observable2;
})();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}

// node_modules/rxjs/dist/esm5/internal/util/lift.js
function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = (function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  };
  return OperatorSubscriber2;
})(Subscriber);

// node_modules/rxjs/dist/esm5/internal/operators/refCount.js
function refCount() {
  return operate(function(source, subscriber) {
    var connection = null;
    source._refCount++;
    var refCounter = createOperatorSubscriber(subscriber, void 0, void 0, void 0, function() {
      if (!source || source._refCount <= 0 || 0 < --source._refCount) {
        connection = null;
        return;
      }
      var sharedConnection = source._connection;
      var conn = connection;
      connection = null;
      if (sharedConnection && (!conn || sharedConnection === conn)) {
        sharedConnection.unsubscribe();
      }
      subscriber.unsubscribe();
    });
    source.subscribe(refCounter);
    if (!refCounter.closed) {
      connection = source.connect();
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/observable/ConnectableObservable.js
var ConnectableObservable = (function(_super) {
  __extends(ConnectableObservable2, _super);
  function ConnectableObservable2(source, subjectFactory) {
    var _this = _super.call(this) || this;
    _this.source = source;
    _this.subjectFactory = subjectFactory;
    _this._subject = null;
    _this._refCount = 0;
    _this._connection = null;
    if (hasLift(source)) {
      _this.lift = source.lift;
    }
    return _this;
  }
  ConnectableObservable2.prototype._subscribe = function(subscriber) {
    return this.getSubject().subscribe(subscriber);
  };
  ConnectableObservable2.prototype.getSubject = function() {
    var subject = this._subject;
    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }
    return this._subject;
  };
  ConnectableObservable2.prototype._teardown = function() {
    this._refCount = 0;
    var _connection = this._connection;
    this._subject = this._connection = null;
    _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
  };
  ConnectableObservable2.prototype.connect = function() {
    var _this = this;
    var connection = this._connection;
    if (!connection) {
      connection = this._connection = new Subscription();
      var subject_1 = this.getSubject();
      connection.add(this.source.subscribe(createOperatorSubscriber(subject_1, void 0, function() {
        _this._teardown();
        subject_1.complete();
      }, function(err) {
        _this._teardown();
        subject_1.error(err);
      }, function() {
        return _this._teardown();
      })));
      if (connection.closed) {
        this._connection = null;
        connection = Subscription.EMPTY;
      }
    }
    return connection;
  };
  ConnectableObservable2.prototype.refCount = function() {
    return refCount()(this);
  };
  return ConnectableObservable2;
})(Observable);

// node_modules/rxjs/dist/esm5/internal/scheduler/performanceTimestampProvider.js
var performanceTimestampProvider = {
  now: function() {
    return (performanceTimestampProvider.delegate || performance).now();
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js
var animationFrameProvider = {
  schedule: function(callback) {
    var request = requestAnimationFrame;
    var cancel = cancelAnimationFrame;
    var delegate = animationFrameProvider.delegate;
    if (delegate) {
      request = delegate.requestAnimationFrame;
      cancel = delegate.cancelAnimationFrame;
    }
    var handle = request(function(timestamp2) {
      cancel = void 0;
      callback(timestamp2);
    });
    return new Subscription(function() {
      return cancel === null || cancel === void 0 ? void 0 : cancel(handle);
    });
  },
  requestAnimationFrame: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = animationFrameProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
  },
  cancelAnimationFrame: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = animationFrameProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/observable/dom/animationFrames.js
function animationFramesFactory(timestampProvider) {
  return new Observable(function(subscriber) {
    var provider = timestampProvider || performanceTimestampProvider;
    var start = provider.now();
    var id = 0;
    var run = function() {
      if (!subscriber.closed) {
        id = animationFrameProvider.requestAnimationFrame(function(timestamp2) {
          id = 0;
          var now = provider.now();
          subscriber.next({
            timestamp: timestampProvider ? now : timestamp2,
            elapsed: now - start
          });
          run();
        });
      }
    };
    run();
    return function() {
      if (id) {
        animationFrameProvider.cancelAnimationFrame(id);
      }
    };
  });
}
var DEFAULT_ANIMATION_FRAMES = animationFramesFactory();

// node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});

// node_modules/rxjs/dist/esm5/internal/Subject.js
var Subject = (function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
})(Observable);
var AnonymousSubject = (function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
})(Subject);

// node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
var BehaviorSubject = (function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
})(Subject);

// node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/ReplaySubject.js
var ReplaySubject = (function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
    var copy = _buffer.slice();
    for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now = _timestampProvider.now();
      var last3 = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
        last3 = i;
      }
      last3 && _buffer.splice(0, last3 + 1);
    }
  };
  return ReplaySubject2;
})(Subject);

// node_modules/rxjs/dist/esm5/internal/AsyncSubject.js
var AsyncSubject = (function(_super) {
  __extends(AsyncSubject2, _super);
  function AsyncSubject2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this._value = null;
    _this._hasValue = false;
    _this._isComplete = false;
    return _this;
  }
  AsyncSubject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, _hasValue = _a._hasValue, _value = _a._value, thrownError = _a.thrownError, isStopped = _a.isStopped, _isComplete = _a._isComplete;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped || _isComplete) {
      _hasValue && subscriber.next(_value);
      subscriber.complete();
    }
  };
  AsyncSubject2.prototype.next = function(value) {
    if (!this.isStopped) {
      this._value = value;
      this._hasValue = true;
    }
  };
  AsyncSubject2.prototype.complete = function() {
    var _a = this, _hasValue = _a._hasValue, _value = _a._value, _isComplete = _a._isComplete;
    if (!_isComplete) {
      this._isComplete = true;
      _hasValue && _super.prototype.next.call(this, _value);
      _super.prototype.complete.call(this);
    }
  };
  return AsyncSubject2;
})(Subject);

// node_modules/rxjs/dist/esm5/internal/scheduler/Action.js
var Action = (function(_super) {
  __extends(Action2, _super);
  function Action2(scheduler, work) {
    return _super.call(this) || this;
  }
  Action2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return this;
  };
  return Action2;
})(Subscription);

// node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js
var intervalProvider = {
  setInterval: function(handler2, timeout2) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = intervalProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
      return delegate.setInterval.apply(delegate, __spreadArray([handler2, timeout2], __read(args)));
    }
    return setInterval.apply(void 0, __spreadArray([handler2, timeout2], __read(args)));
  },
  clearInterval: function(handle) {
    var delegate = intervalProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js
var AsyncAction = (function(_super) {
  __extends(AsyncAction2, _super);
  function AsyncAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }
  AsyncAction2.prototype.schedule = function(state, delay2) {
    var _a;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (this.closed) {
      return this;
    }
    this.state = state;
    var id = this.id;
    var scheduler = this.scheduler;
    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay2);
    }
    this.pending = true;
    this.delay = delay2;
    this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay2);
    return this;
  };
  AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
  };
  AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && this.delay === delay2 && this.pending === false) {
      return id;
    }
    if (id != null) {
      intervalProvider.clearInterval(id);
    }
    return void 0;
  };
  AsyncAction2.prototype.execute = function(state, delay2) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }
    this.pending = false;
    var error = this._execute(state, delay2);
    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };
  AsyncAction2.prototype._execute = function(state, _delay) {
    var errored = false;
    var errorValue;
    try {
      this.work(state);
    } catch (e) {
      errored = true;
      errorValue = e ? e : new Error("Scheduled action threw falsy error");
    }
    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };
  AsyncAction2.prototype.unsubscribe = function() {
    if (!this.closed) {
      var _a = this, id = _a.id, scheduler = _a.scheduler;
      var actions = scheduler.actions;
      this.work = this.state = this.scheduler = null;
      this.pending = false;
      arrRemove(actions, this);
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
      this.delay = null;
      _super.prototype.unsubscribe.call(this);
    }
  };
  return AsyncAction2;
})(Action);

// node_modules/rxjs/dist/esm5/internal/util/Immediate.js
var nextHandle = 1;
var resolved;
var activeHandles = {};
function findAndClearHandle(handle) {
  if (handle in activeHandles) {
    delete activeHandles[handle];
    return true;
  }
  return false;
}
var Immediate = {
  setImmediate: function(cb) {
    var handle = nextHandle++;
    activeHandles[handle] = true;
    if (!resolved) {
      resolved = Promise.resolve();
    }
    resolved.then(function() {
      return findAndClearHandle(handle) && cb();
    });
    return handle;
  },
  clearImmediate: function(handle) {
    findAndClearHandle(handle);
  }
};

// node_modules/rxjs/dist/esm5/internal/scheduler/immediateProvider.js
var setImmediate = Immediate.setImmediate;
var clearImmediate = Immediate.clearImmediate;
var immediateProvider = {
  setImmediate: function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = immediateProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate).apply(void 0, __spreadArray([], __read(args)));
  },
  clearImmediate: function(handle) {
    var delegate = immediateProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/scheduler/AsapAction.js
var AsapAction = (function(_super) {
  __extends(AsapAction2, _super);
  function AsapAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AsapAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = immediateProvider.setImmediate(scheduler.flush.bind(scheduler, void 0)));
  };
  AsapAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    var _a;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null ? delay2 > 0 : this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    var actions = scheduler.actions;
    if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
      immediateProvider.clearImmediate(id);
      if (scheduler._scheduled === id) {
        scheduler._scheduled = void 0;
      }
    }
    return void 0;
  };
  return AsapAction2;
})(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/Scheduler.js
var Scheduler = (function() {
  function Scheduler2(schedulerActionCtor, now) {
    if (now === void 0) {
      now = Scheduler2.now;
    }
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = now;
  }
  Scheduler2.prototype.schedule = function(work, delay2, state) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return new this.schedulerActionCtor(this, work).schedule(state, delay2);
  };
  Scheduler2.now = dateTimestampProvider.now;
  return Scheduler2;
})();

// node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js
var AsyncScheduler = (function(_super) {
  __extends(AsyncScheduler2, _super);
  function AsyncScheduler2(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }
    var _this = _super.call(this, SchedulerAction, now) || this;
    _this.actions = [];
    _this._active = false;
    return _this;
  }
  AsyncScheduler2.prototype.flush = function(action) {
    var actions = this.actions;
    if (this._active) {
      actions.push(action);
      return;
    }
    var error;
    this._active = true;
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());
    this._active = false;
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsyncScheduler2;
})(Scheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/AsapScheduler.js
var AsapScheduler = (function(_super) {
  __extends(AsapScheduler2, _super);
  function AsapScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AsapScheduler2.prototype.flush = function(action) {
    this._active = true;
    var flushId = this._scheduled;
    this._scheduled = void 0;
    var actions = this.actions;
    var error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsapScheduler2;
})(AsyncScheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/asap.js
var asapScheduler = new AsapScheduler(AsapAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/async.js
var asyncScheduler = new AsyncScheduler(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/QueueAction.js
var QueueAction = (function(_super) {
  __extends(QueueAction2, _super);
  function QueueAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  QueueAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 > 0) {
      return _super.prototype.schedule.call(this, state, delay2);
    }
    this.delay = delay2;
    this.state = state;
    this.scheduler.flush(this);
    return this;
  };
  QueueAction2.prototype.execute = function(state, delay2) {
    return delay2 > 0 || this.closed ? _super.prototype.execute.call(this, state, delay2) : this._execute(state, delay2);
  };
  QueueAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && delay2 > 0 || delay2 == null && this.delay > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.flush(this);
    return 0;
  };
  return QueueAction2;
})(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/QueueScheduler.js
var QueueScheduler = (function(_super) {
  __extends(QueueScheduler2, _super);
  function QueueScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return QueueScheduler2;
})(AsyncScheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/queue.js
var queueScheduler = new QueueScheduler(QueueAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js
var AnimationFrameAction = (function(_super) {
  __extends(AnimationFrameAction2, _super);
  function AnimationFrameAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(function() {
      return scheduler.flush(void 0);
    }));
  };
  AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    var _a;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null ? delay2 > 0 : this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    var actions = scheduler.actions;
    if (id != null && id === scheduler._scheduled && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
      animationFrameProvider.cancelAnimationFrame(id);
      scheduler._scheduled = void 0;
    }
    return void 0;
  };
  return AnimationFrameAction2;
})(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameScheduler.js
var AnimationFrameScheduler = (function(_super) {
  __extends(AnimationFrameScheduler2, _super);
  function AnimationFrameScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AnimationFrameScheduler2.prototype.flush = function(action) {
    this._active = true;
    var flushId;
    if (action) {
      flushId = action.id;
    } else {
      flushId = this._scheduled;
      this._scheduled = void 0;
    }
    var actions = this.actions;
    var error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AnimationFrameScheduler2;
})(AsyncScheduler);

// node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js
var animationFrameScheduler = new AnimationFrameScheduler(AnimationFrameAction);

// node_modules/rxjs/dist/esm5/internal/scheduler/VirtualTimeScheduler.js
var VirtualTimeScheduler = (function(_super) {
  __extends(VirtualTimeScheduler2, _super);
  function VirtualTimeScheduler2(schedulerActionCtor, maxFrames) {
    if (schedulerActionCtor === void 0) {
      schedulerActionCtor = VirtualAction;
    }
    if (maxFrames === void 0) {
      maxFrames = Infinity;
    }
    var _this = _super.call(this, schedulerActionCtor, function() {
      return _this.frame;
    }) || this;
    _this.maxFrames = maxFrames;
    _this.frame = 0;
    _this.index = -1;
    return _this;
  }
  VirtualTimeScheduler2.prototype.flush = function() {
    var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
    var error;
    var action;
    while ((action = actions[0]) && action.delay <= maxFrames) {
      actions.shift();
      this.frame = action.delay;
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    }
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  VirtualTimeScheduler2.frameTimeFactor = 10;
  return VirtualTimeScheduler2;
})(AsyncScheduler);
var VirtualAction = (function(_super) {
  __extends(VirtualAction2, _super);
  function VirtualAction2(scheduler, work, index) {
    if (index === void 0) {
      index = scheduler.index += 1;
    }
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.index = index;
    _this.active = true;
    _this.index = scheduler.index = index;
    return _this;
  }
  VirtualAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (Number.isFinite(delay2)) {
      if (!this.id) {
        return _super.prototype.schedule.call(this, state, delay2);
      }
      this.active = false;
      var action = new VirtualAction2(this.scheduler, this.work);
      this.add(action);
      return action.schedule(state, delay2);
    } else {
      return Subscription.EMPTY;
    }
  };
  VirtualAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    this.delay = scheduler.frame + delay2;
    var actions = scheduler.actions;
    actions.push(this);
    actions.sort(VirtualAction2.sortActions);
    return 1;
  };
  VirtualAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return void 0;
  };
  VirtualAction2.prototype._execute = function(state, delay2) {
    if (this.active === true) {
      return _super.prototype._execute.call(this, state, delay2);
    }
  };
  VirtualAction2.sortActions = function(a, b) {
    if (a.delay === b.delay) {
      if (a.index === b.index) {
        return 0;
      } else if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    } else if (a.delay > b.delay) {
      return 1;
    } else {
      return -1;
    }
  };
  return VirtualAction2;
})(AsyncAction);

// node_modules/rxjs/dist/esm5/internal/observable/empty.js
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});

// node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
function isScheduler(value) {
  return value && isFunction(value.schedule);
}

// node_modules/rxjs/dist/esm5/internal/util/args.js
function last(arr) {
  return arr[arr.length - 1];
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}

// node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
var isArrayLike = (function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
});

// node_modules/rxjs/dist/esm5/internal/util/isPromise.js
function isPromise2(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

// node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
function isInteropObservable(input) {
  return isFunction(input[observable]);
}

// node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
function isAsyncIterable2(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}

// node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

// node_modules/rxjs/dist/esm5/internal/util/isIterable.js
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          if (false) return [3, 8];
          return [4, __await(reader.read())];
        case 3:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

// node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise2(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable2(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable(function(subscriber) {
    for (var i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err) {
      return subscriber.error(err);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process2(asyncIterable, subscriber).catch(function(err) {
      return subscriber.error(err);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process2(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
function executeSchedule(parentSubscription, scheduler, work, delay2, repeat2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  if (repeat2 === void 0) {
    repeat2 = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat2) {
      parentSubscription.add(this.schedule(null, delay2));
    } else {
      this.unsubscribe();
    }
  }, delay2);
  parentSubscription.add(scheduleSubscription);
  if (!repeat2) {
    return scheduleSubscription;
  }
}

// node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
function observeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source, subscriber) {
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay2);
    }, function() {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay2);
    }, function(err) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err);
      }, delay2);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
function subscribeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source.subscribe(subscriber);
    }, delay2));
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
function scheduleArray(input, scheduler) {
  return new Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
function scheduleIterable(input, scheduler) {
  return new Observable(function(subscriber) {
    var iterator2;
    executeSchedule(subscriber, scheduler, function() {
      iterator2 = input[iterator]();
      executeSchedule(subscriber, scheduler, function() {
        var _a;
        var value;
        var done;
        try {
          _a = iterator2.next(), value = _a.value, done = _a.done;
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
    };
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function(subscriber) {
    executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise2(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable2(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}

// node_modules/rxjs/dist/esm5/internal/observable/from.js
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

// node_modules/rxjs/dist/esm5/internal/observable/of.js
function of() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  return from(args, scheduler);
}

// node_modules/rxjs/dist/esm5/internal/observable/throwError.js
function throwError(errorOrErrorFactory, scheduler) {
  var errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : function() {
    return errorOrErrorFactory;
  };
  var init = function(subscriber) {
    return subscriber.error(errorFactory());
  };
  return new Observable(scheduler ? function(subscriber) {
    return scheduler.schedule(init, 0, subscriber);
  } : init);
}

// node_modules/rxjs/dist/esm5/internal/Notification.js
var NotificationKind;
(function(NotificationKind2) {
  NotificationKind2["NEXT"] = "N";
  NotificationKind2["ERROR"] = "E";
  NotificationKind2["COMPLETE"] = "C";
})(NotificationKind || (NotificationKind = {}));
var Notification = (function() {
  function Notification2(kind, value, error) {
    this.kind = kind;
    this.value = value;
    this.error = error;
    this.hasValue = kind === "N";
  }
  Notification2.prototype.observe = function(observer) {
    return observeNotification(this, observer);
  };
  Notification2.prototype.do = function(nextHandler, errorHandler, completeHandler) {
    var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
    return kind === "N" ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === "E" ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
  };
  Notification2.prototype.accept = function(nextOrObserver, error, complete) {
    var _a;
    return isFunction((_a = nextOrObserver) === null || _a === void 0 ? void 0 : _a.next) ? this.observe(nextOrObserver) : this.do(nextOrObserver, error, complete);
  };
  Notification2.prototype.toObservable = function() {
    var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
    var result = kind === "N" ? of(value) : kind === "E" ? throwError(function() {
      return error;
    }) : kind === "C" ? EMPTY : 0;
    if (!result) {
      throw new TypeError("Unexpected notification kind " + kind);
    }
    return result;
  };
  Notification2.createNext = function(value) {
    return new Notification2("N", value);
  };
  Notification2.createError = function(err) {
    return new Notification2("E", void 0, err);
  };
  Notification2.createComplete = function() {
    return Notification2.completeNotification;
  };
  Notification2.completeNotification = new Notification2("C");
  return Notification2;
})();
function observeNotification(notification, observer) {
  var _a, _b, _c;
  var _d = notification, kind = _d.kind, value = _d.value, error = _d.error;
  if (typeof kind !== "string") {
    throw new TypeError('Invalid notification, missing "kind"');
  }
  kind === "N" ? (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, value) : kind === "E" ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
}

// node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
var EmptyError = createErrorClass(function(_super) {
  return function EmptyErrorImpl() {
    _super(this);
    this.name = "EmptyError";
    this.message = "no elements in sequence";
  };
});

// node_modules/rxjs/dist/esm5/internal/lastValueFrom.js
function lastValueFrom(source, config2) {
  var hasConfig = typeof config2 === "object";
  return new Promise(function(resolve, reject) {
    var _hasValue = false;
    var _value;
    source.subscribe({
      next: function(value) {
        _value = value;
        _hasValue = true;
      },
      error: reject,
      complete: function() {
        if (_hasValue) {
          resolve(_value);
        } else if (hasConfig) {
          resolve(config2.defaultValue);
        } else {
          reject(new EmptyError());
        }
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/util/ArgumentOutOfRangeError.js
var ArgumentOutOfRangeError = createErrorClass(function(_super) {
  return function ArgumentOutOfRangeErrorImpl() {
    _super(this);
    this.name = "ArgumentOutOfRangeError";
    this.message = "argument out of range";
  };
});

// node_modules/rxjs/dist/esm5/internal/util/NotFoundError.js
var NotFoundError = createErrorClass(function(_super) {
  return function NotFoundErrorImpl(message) {
    _super(this);
    this.name = "NotFoundError";
    this.message = message;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/SequenceError.js
var SequenceError = createErrorClass(function(_super) {
  return function SequenceErrorImpl(message) {
    _super(this);
    this.name = "SequenceError";
    this.message = message;
  };
});

// node_modules/rxjs/dist/esm5/internal/operators/timeout.js
var TimeoutError = createErrorClass(function(_super) {
  return function TimeoutErrorImpl(info) {
    if (info === void 0) {
      info = null;
    }
    _super(this);
    this.message = "Timeout has occurred";
    this.name = "TimeoutError";
    this.info = info;
  };
});

// node_modules/rxjs/dist/esm5/internal/operators/map.js
function map(project, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js
var isArray = Array.isArray;

// node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js
var isArray2 = Array.isArray;
var objectProto = Object.prototype;

// node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand2, innerSubScheduler, additionalFinalizer) {
  var buffer2 = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer2.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer2.push(value);
  };
  var doInnerSub = function(value) {
    expand2 && subscriber.next(value);
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand2) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer2.shift();
            if (innerSubScheduler) {
              executeSchedule(subscriber, innerSubScheduler, function() {
                return doInnerSub(bufferedValue);
              });
            } else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer2.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction(resultSelector)) {
    return mergeMap(function(a, i) {
      return map(function(b, ii) {
        return resultSelector(a, b, i, ii);
      })(innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function(source, subscriber) {
    return mergeInternals(source, subscriber, project, concurrent);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}

// node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
function concatAll() {
  return mergeAll(1);
}

// node_modules/rxjs/dist/esm5/internal/observable/concat.js
function concat() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return concatAll()(from(args, popScheduler(args)));
}

// node_modules/rxjs/dist/esm5/internal/observable/never.js
var NEVER = new Observable(noop);

// node_modules/rxjs/dist/esm5/internal/util/argsOrArgArray.js
var isArray3 = Array.isArray;

// node_modules/rxjs/dist/esm5/internal/operators/filter.js
function filter(predicate, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/catchError.js
function catchError(selector) {
  return operate(function(source, subscriber) {
    var innerSub = null;
    var syncUnsub = false;
    var handledResult;
    innerSub = source.subscribe(createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
      handledResult = innerFrom(selector(err, catchError(selector)(source)));
      if (innerSub) {
        innerSub.unsubscribe();
        innerSub = null;
        handledResult.subscribe(subscriber);
      } else {
        syncUnsub = true;
      }
    }));
    if (syncUnsub) {
      innerSub.unsubscribe();
      innerSub = null;
      handledResult.subscribe(subscriber);
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/finalize.js
function finalize(callback) {
  return operate(function(source, subscriber) {
    try {
      source.subscribe(subscriber);
    } finally {
      subscriber.add(callback);
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/materialize.js
function materialize() {
  return operate(function(source, subscriber) {
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(Notification.createNext(value));
    }, function() {
      subscriber.next(Notification.createComplete());
      subscriber.complete();
    }, function(err) {
      subscriber.next(Notification.createError(err));
      subscriber.complete();
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/share.js
function share(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.connector, connector = _a === void 0 ? function() {
    return new Subject();
  } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
  return function(wrapperSource) {
    var connection;
    var resetConnection;
    var subject;
    var refCount2 = 0;
    var hasCompleted = false;
    var hasErrored = false;
    var cancelReset = function() {
      resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
      resetConnection = void 0;
    };
    var reset = function() {
      cancelReset();
      connection = subject = void 0;
      hasCompleted = hasErrored = false;
    };
    var resetAndUnsubscribe = function() {
      var conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return operate(function(source, subscriber) {
      refCount2++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
      subscriber.add(function() {
        refCount2--;
        if (refCount2 === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount2 > 0) {
        connection = new SafeSubscriber({
          next: function(value) {
            return dest.next(value);
          },
          error: function(err) {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: function() {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
function handleReset(reset, on) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  var onSubscriber = new SafeSubscriber({
    next: function() {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
}

// node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js
function shareReplay(configOrBufferSize, windowTime2, scheduler) {
  var _a, _b, _c;
  var bufferSize;
  var refCount2 = false;
  if (configOrBufferSize && typeof configOrBufferSize === "object") {
    _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime2 = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount2 = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
  } else {
    bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
  }
  return share({
    connector: function() {
      return new ReplaySubject(bufferSize, windowTime2, scheduler);
    },
    resetOnError: true,
    resetOnComplete: false,
    resetOnRefCountZero: refCount2
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/tap.js
function tap(observerOrNext, error, complete) {
  var tapObserver = isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
  return tapObserver ? operate(function(source, subscriber) {
    var _a;
    (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
    var isUnsub = true;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var _a2;
      (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
      subscriber.next(value);
    }, function() {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      subscriber.complete();
    }, function(err) {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
      subscriber.error(err);
    }, function() {
      var _a2, _b;
      if (isUnsub) {
        (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      }
      (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
    }));
  }) : identity;
}

// node_modules/@apollo/client/invariantErrorCodes.js
var errorCodes = {
  1: {
    file: "@apollo/client/utilities/internal/checkDocument.js",
    condition: 'doc && doc.kind === "Document"',
    message: `Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql`
  },
  2: {
    file: "@apollo/client/utilities/internal/checkDocument.js",
    message: `Schema type definitions not allowed in queries. Found: "%s"`
  },
  3: {
    file: "@apollo/client/utilities/internal/checkDocument.js",
    condition: "operations.length <= 1",
    message: `Ambiguous GraphQL document: contains %s operations`
  },
  4: {
    file: "@apollo/client/utilities/internal/checkDocument.js",
    condition: "operations.length == 1 && operations[0].operation === expectedType",
    message: `Running a %s requires a graphql %s, but a %s was used instead.`
  },
  5: {
    file: "@apollo/client/utilities/internal/checkDocument.js",
    message: '`%s` is a forbidden field alias name in the selection set for field `%s` in %s "%s".'
  },
  6: {
    file: "@apollo/client/utilities/internal/getFragmentDefinition.js",
    condition: 'doc.kind === "Document"',
    message: `Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql`
  },
  7: {
    file: "@apollo/client/utilities/internal/getFragmentDefinition.js",
    condition: "doc.definitions.length <= 1",
    message: "Fragment must have exactly one definition."
  },
  8: {
    file: "@apollo/client/utilities/internal/getFragmentDefinition.js",
    condition: 'fragmentDef.kind === "FragmentDefinition"',
    message: "Must be a fragment definition."
  },
  9: {
    file: "@apollo/client/utilities/internal/getFragmentFromSelection.js",
    condition: "fragment",
    message: `No fragment named %s`
  },
  10: {
    file: "@apollo/client/utilities/internal/getFragmentQueryDocument.js",
    message: `Found a %s operation%s. No operations are allowed when using a fragment as a query. Only fragments are allowed.`
  },
  11: {
    file: "@apollo/client/utilities/internal/getFragmentQueryDocument.js",
    condition: "fragments.length === 1",
    message: `Found %s fragments. \`fragmentName\` must be provided when there is not exactly 1 fragment.`
  },
  12: {
    file: "@apollo/client/utilities/internal/getMainDefinition.js",
    message: "Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment."
  },
  13: {
    file: "@apollo/client/utilities/internal/getQueryDefinition.js",
    condition: 'queryDef && queryDef.operation === "query"',
    message: "Must contain a query definition."
  },
  15: {
    file: "@apollo/client/utilities/internal/shouldInclude.js",
    condition: "evaledValue !== void 0",
    message: `Invalid variable referenced in @%s directive.`
  },
  16: {
    file: "@apollo/client/utilities/internal/shouldInclude.js",
    condition: "directiveArguments && directiveArguments.length === 1",
    message: `Incorrect number of arguments for the @%s directive.`
  },
  17: {
    file: "@apollo/client/utilities/internal/shouldInclude.js",
    condition: 'ifArgument.name && ifArgument.name.value === "if"',
    message: `Invalid argument for the @%s directive.`
  },
  18: {
    file: "@apollo/client/utilities/internal/shouldInclude.js",
    condition: 'ifValue &&\n    (ifValue.kind === "Variable" || ifValue.kind === "BooleanValue")',
    message: `Argument for the @%s directive must be a variable or a boolean value.`
  },
  19: {
    file: "@apollo/client/utilities/internal/valueToObjectRepresentation.js",
    message: `The inline argument "%s" of kind "%s"is not supported. Use variables instead of inline arguments to overcome this limitation.`
  },
  20: {
    file: "@apollo/client/utilities/graphql/DocumentTransform.js",
    condition: "Array.isArray(cacheKeys)",
    message: "`getCacheKey` must return an array or undefined"
  },
  21: {
    file: "@apollo/client/testing/core/mocking/mockLink.js",
    condition: "max > min",
    message: "realisticDelay: `min` must be less than `max`"
  },
  22: {
    file: "@apollo/client/testing/core/mocking/mockLink.js",
    condition: "queryWithoutClientOnlyDirectives",
    message: "query is required"
  },
  23: {
    file: "@apollo/client/testing/core/mocking/mockLink.js",
    condition: "serverQuery",
    message: "Cannot mock a client-only query. Mocked responses should contain at least one non-client field."
  },
  24: {
    file: "@apollo/client/testing/core/mocking/mockLink.js",
    condition: "(mock.maxUsageCount ?? 1) > 0",
    message: "Mocked response `maxUsageCount` must be greater than 0. Given %s"
  },
  25: {
    file: "@apollo/client/react/ssr/prerenderStatic.js",
    condition: "renderCount <= maxRerenders",
    message: `Exceeded maximum rerender count of %d.
This either means you have very deep \`useQuery\` waterfalls in your application
and need to increase the \`maxRerender\` option to \`prerenderStatic\`, or that
you have an infinite render loop in your application.`
  },
  26: {
    file: "@apollo/client/react/ssr/prerenderStatic.js",
    condition: "!signal?.aborted",
    message: "The operation was aborted before it could be attempted."
  },
  27: {
    file: "@apollo/client/react/internal/cache/QueryReference.js",
    condition: "!queryRef || QUERY_REFERENCE_SYMBOL in queryRef",
    message: "Expected a QueryRef object, but got something else instead."
  },
  28: {
    file: "@apollo/client/react/hooks/useApolloClient.js",
    condition: "!!client",
    message: 'Could not find "client" in the context or passed in as an option. Wrap the root component in an <ApolloProvider>, or pass an ApolloClient instance in via options.'
  },
  29: {
    file: "@apollo/client/react/hooks/useLazyQuery.js",
    condition: "resultRef.current",
    message: "useLazyQuery: '%s' cannot be called before executing the query."
  },
  30: {
    file: "@apollo/client/react/hooks/useLazyQuery.js",
    condition: "!calledDuringRender()",
    message: "useLazyQuery: 'execute' should not be called during render. To start a query during render, use the 'useQuery' hook."
  },
  31: {
    file: "@apollo/client/react/hooks/useLoadableQuery.js",
    condition: "!calledDuringRender()",
    message: "useLoadableQuery: 'loadQuery' should not be called during render. To start a query during render, use the 'useBackgroundQuery' hook."
  },
  32: {
    file: "@apollo/client/react/hooks/useLoadableQuery.js",
    condition: "internalQueryRef",
    message: "The query has not been loaded. Please load the query."
  },
  33: {
    file: "@apollo/client/react/hooks/useSubscription.js",
    condition: "!optionsRef.current.skip",
    message: "A subscription that is skipped cannot be restarted."
  },
  35: {
    file: "@apollo/client/react/hooks/internal/validateSuspenseHookOptions.js",
    condition: "supportedFetchPolicies.includes(fetchPolicy)",
    message: `The fetch policy \`%s\` is not supported with suspense.`
  },
  37: {
    file: "@apollo/client/react/context/ApolloContext.js",
    condition: '"createContext" in React',
    message: 'Invoking `getApolloContext` in an environment where `React.createContext` is not available.\nThe Apollo Client functionality you are trying to use is only available in React Client Components.\nPlease make sure to add "use client" at the top of your file.\nFor more information, see https://nextjs.org/docs/getting-started/react-essentials#client-components'
  },
  38: {
    file: "@apollo/client/react/context/ApolloProvider.js",
    condition: "context.client",
    message: 'ApolloProvider was not passed a client instance. Make sure you pass in your client via the "client" prop.'
  },
  39: {
    file: "@apollo/client/masking/maskDefinition.js",
    condition: "fragment",
    message: "Could not find fragment with name '%s'."
  },
  41: {
    file: "@apollo/client/masking/maskFragment.js",
    condition: "fragments.length === 1",
    message: `Found %s fragments. \`fragmentName\` must be provided when there is not exactly 1 fragment.`
  },
  42: {
    file: "@apollo/client/masking/maskFragment.js",
    condition: "!!fragment",
    message: `Could not find fragment with name "%s".`
  },
  43: {
    file: "@apollo/client/masking/maskOperation.js",
    condition: "definition",
    message: "Expected a parsed GraphQL document with a query, mutation, or subscription."
  },
  47: {
    file: "@apollo/client/local-state/LocalState.js",
    condition: 'hasDirectives(["client"], document)',
    message: "Expected document to contain `@client` fields."
  },
  48: {
    file: "@apollo/client/local-state/LocalState.js",
    condition: 'hasDirectives(["client"], document)',
    message: "Expected document to contain `@client` fields."
  },
  49: {
    file: "@apollo/client/local-state/LocalState.js",
    condition: "fragment",
    message: "No fragment named %s"
  },
  53: {
    file: "@apollo/client/local-state/LocalState.js",
    message: "Could not resolve __typename on object %o returned from resolver '%s'. '__typename' needs to be returned to properly resolve child fields."
  },
  54: {
    file: "@apollo/client/local-state/LocalState.js",
    condition: "fragment",
    message: `No fragment named %s`
  },
  55: {
    file: "@apollo/client/local-state/LocalState.js",
    condition: "cache.fragmentMatches",
    message: "The configured cache does not support fragment matching which will lead to incorrect results when executing local resolvers. Please use a cache that implements `fragmetMatches`."
  },
  57: {
    file: "@apollo/client/link/persisted-queries/index.js",
    condition: 'options &&\n    (typeof options.sha256 === "function" ||\n        typeof options.generateHash === "function")',
    message: 'Missing/invalid "sha256" or "generateHash" function. Please configure one using the "createPersistedQueryLink(options)" options parameter.'
  },
  58: {
    file: "@apollo/client/link/persisted-queries/index.js",
    condition: "forward",
    message: "PersistedQueryLink cannot be the last link in the chain."
  },
  59: {
    file: "@apollo/client/link/http/checkFetcher.js",
    condition: 'fetcher || typeof fetch !== "undefined"',
    message: `
"fetch" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor. For example:

import fetch from 'cross-fetch';
import { ApolloClient, HttpLink } from '@apollo/client';
const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql', fetch })
});
    `
  },
  60: {
    file: "@apollo/client/link/http/parseAndCheckHttpResponse.js",
    condition: 'response.body && typeof response.body.getReader === "function"',
    message: "Unknown type for `response.body`. Please use a `fetch` implementation that is WhatWG-compliant and that uses WhatWG ReadableStreams for `body`."
  },
  63: {
    file: "@apollo/client/link/core/ApolloLink.js",
    message: "request is not implemented"
  },
  64: {
    file: "@apollo/client/incremental/handlers/notImplemented.js",
    condition: '!hasDirectives(["defer"], request.query)',
    message: "`@defer` is not supported without specifying an incremental handler. Please pass a handler as the `incrementalHandler` option to the `ApolloClient` constructor."
  },
  65: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "options.cache",
    message: "To initialize Apollo Client, you must specify a 'cache' property in the options object. \nFor more information, please visit: https://go.apollo.dev/c/docs"
  },
  66: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "options.link",
    message: "To initialize Apollo Client, you must specify a 'link' property in the options object. \nFor more information, please visit: https://go.apollo.dev/c/docs"
  },
  67: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: 'options.fetchPolicy !== "cache-and-network"',
    message: "The cache-and-network fetchPolicy does not work with client.query, because client.query can only return a single result. Please use client.watchQuery to receive multiple results from the cache and the network, or consider using a different fetchPolicy, such as cache-first or network-only."
  },
  68: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: 'options.fetchPolicy !== "standby"',
    message: "The standby fetchPolicy does not work with client.query, because standby does not fetch. Consider using a different fetchPolicy, such as cache-first or network-only."
  },
  69: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "options.query",
    message: "query option is required. You must specify your GraphQL document in the query option."
  },
  70: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: 'options.query.kind === "Document"',
    message: 'You must wrap the query string in a "gql" tag.'
  },
  71: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "!options.returnPartialData",
    message: "returnPartialData option only supported on watchQuery."
  },
  72: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "!options.pollInterval",
    message: "pollInterval option only supported on watchQuery."
  },
  73: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "!options.notifyOnNetworkStatusChange",
    message: "notifyOnNetworkStatusChange option only supported on watchQuery."
  },
  74: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "optionsWithDefaults.mutation",
    message: "The `mutation` option is required. Please provide a GraphQL document in the `mutation` option."
  },
  75: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: 'optionsWithDefaults.fetchPolicy === "network-only" ||\n    optionsWithDefaults.fetchPolicy === "no-cache"',
    message: "Mutations only support 'network-only' or 'no-cache' fetch policies. The default 'network-only' behavior automatically writes mutation results to the cache. Passing 'no-cache' skips the cache write."
  },
  78: {
    file: "@apollo/client/core/ObservableQuery.js",
    condition: 'this.options.fetchPolicy !== "cache-only"',
    message: "Cannot execute `fetchMore` for 'cache-only' query '%s'. Please use a different fetch policy."
  },
  79: {
    file: "@apollo/client/core/ObservableQuery.js",
    condition: "updateQuery",
    message: "You must provide an `updateQuery` function when using `fetchMore` with a `no-cache` fetch policy."
  },
  83: {
    file: "@apollo/client/core/QueryManager.js",
    message: "QueryManager stopped while query was in flight"
  },
  84: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "this.localState",
    message: "Mutation '%s' contains `@client` fields with variables provided by `@export` but local state has not been configured."
  },
  85: {
    file: "@apollo/client/core/QueryManager.js",
    message: "Store reset while query was in flight (not completed in link chain)"
  },
  88: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "!this.getDocumentInfo(query).hasClientExports || this.localState",
    message: "Subscription '%s' contains `@client` fields with variables provided by `@export` but local state has not been configured."
  },
  89: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "this.localState",
    message: "%s '%s' contains `@client` fields but local state has not been configured."
  },
  90: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "!hasIncrementalDirective",
    message: "%s '%s' contains `@client` and `@defer` directives. These cannot be used together."
  },
  91: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "this.localState",
    message: "Query '%s' contains `@client` fields with variables provided by `@export` but local state has not been configured."
  },
  93: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "this.localState",
    message: "Query '%s' contains `@client` fields but local state has not been configured."
  },
  94: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "didEmitValue",
    message: "The link chain completed without emitting a value. This is likely unintentional and should be updated to emit a value before completing."
  },
  95: {
    file: "@apollo/client/cache/inmemory/entityStore.js",
    condition: 'typeof dataId === "string"',
    message: "store.merge expects a string ID"
  },
  98: {
    file: "@apollo/client/cache/inmemory/key-extractor.js",
    condition: "extracted !== void 0",
    message: `Missing field '%s' while extracting keyFields from %s`
  },
  99: {
    file: "@apollo/client/cache/inmemory/policies.js",
    condition: "!old || old === which",
    message: `Cannot change root %s __typename more than once`
  },
  102: {
    file: "@apollo/client/cache/inmemory/policies.js",
    message: "Cannot automatically merge arrays"
  },
  103: {
    file: "@apollo/client/cache/inmemory/readFromStore.js",
    message: `No fragment named %s`
  },
  104: {
    file: "@apollo/client/cache/inmemory/readFromStore.js",
    condition: "!isReference(value)",
    message: `Missing selection set for object of type %s returned for query field %s`
  },
  105: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: `Could not identify object %s`
  },
  107: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: `No fragment named %s`
  }
};
var devDebug = {
  76: {
    file: "@apollo/client/core/ApolloClient.js",
    message: `In client.refetchQueries, Promise.all promise rejected with error %o`
  },
  82: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: `Missing cache result fields: %o`
  }
};
var devLog = {};
var devWarn = {
  36: {
    file: "@apollo/client/react/hooks/internal/validateSuspenseHookOptions.js",
    message: "Using `returnPartialData` with a `no-cache` fetch policy has no effect. To read partial data from the cache, consider using an alternate fetch policy."
  },
  40: {
    file: "@apollo/client/masking/maskDefinition.js",
    message: "Accessing unmasked field on %s at path '%s'. This field will not be available when masking is enabled. Please read the field from the fragment instead."
  },
  44: {
    file: "@apollo/client/masking/utils.js",
    message: "@unmask 'mode' argument does not support variables."
  },
  45: {
    file: "@apollo/client/masking/utils.js",
    message: "@unmask 'mode' argument must be of type string."
  },
  46: {
    file: "@apollo/client/masking/utils.js",
    message: "@unmask 'mode' argument does not recognize value '%s'."
  },
  50: {
    file: "@apollo/client/local-state/LocalState.js",
    message: "The '%s' resolver returned `undefined` instead of a value. This is likely a bug in the resolver. If you didn't mean to return a value, return `null` instead."
  },
  51: {
    file: "@apollo/client/local-state/LocalState.js",
    message: "The '%s' field had no cached value and only forced resolvers were run. The value was set to `null`."
  },
  52: {
    file: "@apollo/client/local-state/LocalState.js",
    message: "The '%s' field on object %o returned `undefined` instead of a value. The parent resolver did not include the property in the returned value and there was no resolver defined for the field."
  },
  56: {
    file: "@apollo/client/link/ws/index.js",
    message: "`WebSocketLink` uses the deprecated and unmaintained `subscriptions-transport-ws` library. This link is no longer maintained and will be removed in a future major version of Apollo Client. We recommend switching to `GraphQLWsLink` which uses the `graphql-ws` library to send GraphQL operations through WebSocket connections (https://the-guild.dev/graphql/ws)."
  },
  61: {
    file: "@apollo/client/link/core/ApolloLink.js",
    message: "[ApolloLink.split]: The test function returned a non-boolean value which could result in subtle bugs (e.g. such as using an `async` function which always returns a truthy value). Got `%o`."
  },
  62: {
    file: "@apollo/client/link/core/ApolloLink.js",
    message: "The terminating link provided to `ApolloLink.execute` called `forward` instead of handling the request. This results in an observable that immediately completes and does not emit a value. Please provide a terminating link that properly handles the request.\n\nIf you are using a split link, ensure each branch contains a terminating link that handles the request."
  },
  77: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: `Called refetch(%o) for query %o, which does not declare a $variables variable.
Did you mean to call refetch(variables) instead of refetch({ variables })?`
  },
  81: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: "Cannot poll on 'cache-only' query '%s' and as such, polling is disabled. Please use a different fetch policy."
  },
  86: {
    file: "@apollo/client/core/QueryManager.js",
    message: `Unknown query named "%s" requested in refetchQueries options.include array`
  },
  87: {
    file: "@apollo/client/core/QueryManager.js",
    message: `Unknown anonymous query requested in refetchQueries options.include array`
  },
  92: {
    file: "@apollo/client/core/QueryManager.js",
    message: '[%s]: Fragments masked by data masking are inaccessible when using fetch policy "no-cache". Please add `@unmask` to each fragment spread to access the data.'
  },
  96: {
    file: "@apollo/client/cache/inmemory/entityStore.js",
    message: "cache.modify: You are trying to write a Reference that is not part of the store: %o\nPlease make sure to set the `mergeIntoStore` parameter to `true` when creating a Reference that is not part of the store yet:\n`toReference(object, true)`"
  },
  97: {
    file: "@apollo/client/cache/inmemory/entityStore.js",
    message: "cache.modify: Writing an array with a mix of both References and Objects will not result in the Objects being normalized correctly.\nPlease convert the object instance %o to a Reference before writing it to the cache by calling `toReference(object, true)`."
  },
  100: {
    file: "@apollo/client/cache/inmemory/policies.js",
    message: `Inferring subtype %s of supertype %s`
  },
  101: {
    file: "@apollo/client/cache/inmemory/policies.js",
    message: `Undefined 'from' passed to readField with arguments %s`
  },
  108: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: `Cache data may be lost when replacing the %s field of a %s object.

This could cause additional (usually avoidable) network requests to fetch data that were otherwise cached.

To address this problem (which is not a bug in Apollo Client), %sdefine a custom merge function for the %s field, so InMemoryCache can safely merge these objects:

  existing: %o
  incoming: %o

For more information about these options, please refer to the documentation:

  * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers
  * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects
`
  },
  109: {
    file: "@apollo/client/cache/core/cache.js",
    message: "Could not identify object passed to `from` for '%s' fragment, either because the object is non-normalized or the key fields are missing. If you are masking this object, please ensure the key fields are requested by the parent object."
  }
};
var devError = {
  14: {
    file: "@apollo/client/utilities/internal/removeDirectivesFromDocument.js",
    message: `Could not find operation or fragment`
  },
  34: {
    file: "@apollo/client/react/hooks/useSyncExternalStore.js",
    message: "The result of getSnapshot should be cached to avoid an infinite loop"
  },
  80: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: "Unhandled GraphQL subscription error"
  },
  106: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: `Missing field '%s' while writing result %o`
  }
};

// node_modules/@apollo/client/utilities/internal/globals/maybe.js
function maybe(thunk) {
  try {
    return thunk();
  } catch {
  }
}

// node_modules/@apollo/client/utilities/internal/globals/global.js
var global_default = (
  // We don't expect the Function constructor ever to be invoked at runtime, as
  // long as at least one of globalThis, window, self, or global is defined, so
  // we are under no obligation to make it easy for static analysis tools to
  maybe(() => globalThis) || maybe(() => window) || maybe(() => self) || maybe(() => global) || // detect syntactic usage of the Function constructor. If you think you can
  // improve your static analysis to detect this obfuscation, think again. This
  // is an arms race you cannot win, at least not in JavaScript.
  maybe(function() {
    return maybe.constructor("return this")();
  })
);

// node_modules/@apollo/client/version.js
var version2 = "4.0.4";
var build = "esm";

// node_modules/@apollo/client/dev/symbol.js
var ApolloErrorMessageHandler = Symbol.for("ApolloErrorMessageHandler_" + version2);

// node_modules/@apollo/client/dev/setErrorMessageHandler.js
function setErrorMessageHandler(handler2) {
  global_default[ApolloErrorMessageHandler] = handler2;
}

// node_modules/@apollo/client/dev/loadErrorMessageHandler.js
function loadErrorMessageHandler(...errorCodes2) {
  setErrorMessageHandler(handler);
  for (const codes of errorCodes2) {
    Object.assign(handler, codes);
  }
  return handler;
}
var handler = ((message, args) => {
  if (typeof message === "number") {
    const definition = global_default[ApolloErrorMessageHandler][message];
    if (!message || !definition?.message)
      return;
    message = definition.message;
  }
  return args.reduce((msg, arg) => msg.replace(/%[sdfo]/, String(arg)), String(message));
});

// node_modules/@apollo/client/dev/loadDevMessages.js
function loadDevMessages() {
  loadErrorMessageHandler(devDebug, devError, devLog, devWarn);
}

// node_modules/@apollo/client/dev/loadErrorMessages.js
function loadErrorMessages() {
  loadErrorMessageHandler(errorCodes);
}

// node_modules/@apollo/client/utilities/environment/index.development.js
var __DEV__ = true;

// node_modules/@apollo/client/utilities/internal/makeUniqueId.js
var prefixCounts = /* @__PURE__ */ new Map();
function makeUniqueId(prefix) {
  const count2 = prefixCounts.get(prefix) || 1;
  prefixCounts.set(prefix, count2 + 1);
  return `${prefix}:${count2}:${Math.random().toString(36).slice(2)}`;
}

// node_modules/@apollo/client/utilities/internal/stringifyForDisplay.js
function stringifyForDisplay(value, space = 0) {
  const undefId = makeUniqueId("stringifyForDisplay");
  return JSON.stringify(value, (_, value2) => {
    return value2 === void 0 ? undefId : value2;
  }, space).split(JSON.stringify(undefId)).join("<undefined>");
}

// node_modules/@apollo/client/utilities/invariant/index.js
var genericMessage = "Invariant Violation";
var InvariantError = class _InvariantError extends Error {
  constructor(message = genericMessage) {
    super(message);
    this.name = genericMessage;
    Object.setPrototypeOf(this, _InvariantError.prototype);
  }
};
var verbosityLevels = ["debug", "log", "warn", "error", "silent"];
var verbosityLevel = verbosityLevels.indexOf(__DEV__ ? "log" : "silent");
function invariant2(condition, ...args) {
  if (!condition) {
    throw newInvariantError(...args);
  }
}
function wrapConsoleMethod(name) {
  return function(message, ...args) {
    if (verbosityLevels.indexOf(name) >= verbosityLevel) {
      const method = console[name] || console.log;
      if (typeof message === "number") {
        const arg0 = message;
        message = getHandledErrorMsg(arg0);
        if (!message) {
          message = getFallbackErrorMsg(arg0, args);
          args = [];
        }
      }
      method(message, ...args);
    }
  };
}
invariant2.debug = wrapConsoleMethod("debug");
invariant2.log = wrapConsoleMethod("log");
invariant2.warn = wrapConsoleMethod("warn");
invariant2.error = wrapConsoleMethod("error");
function setVerbosity(level) {
  const old = verbosityLevels[verbosityLevel];
  verbosityLevel = Math.max(0, verbosityLevels.indexOf(level));
  return old;
}
function newInvariantError(message, ...optionalParams) {
  return new InvariantError(getHandledErrorMsg(message, optionalParams) || getFallbackErrorMsg(message, optionalParams));
}
var ApolloErrorMessageHandler2 = Symbol.for("ApolloErrorMessageHandler_" + version2);
function stringify(arg) {
  if (typeof arg == "string") {
    return arg;
  }
  try {
    return stringifyForDisplay(arg, 2).slice(0, 1e3);
  } catch {
    return "<non-serializable>";
  }
}
function getHandledErrorMsg(message, messageArgs = []) {
  if (!message)
    return;
  return global_default[ApolloErrorMessageHandler2] && global_default[ApolloErrorMessageHandler2](message, messageArgs.map(stringify));
}
function getFallbackErrorMsg(message, messageArgs = []) {
  if (!message)
    return;
  if (typeof message === "string") {
    return messageArgs.reduce((msg, arg) => msg.replace(/%[sdfo]/, stringify(arg)), message);
  }
  return `An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err#${encodeURIComponent(JSON.stringify({
    version: version2,
    message,
    args: messageArgs.map(stringify)
  }))}`;
}

// node_modules/@apollo/client/utilities/invariant/index.development.js
var invariant3 = (() => {
  loadDevMessages();
  loadErrorMessages();
  return invariant2;
})();

// node_modules/@apollo/client/utilities/internal/valueToObjectRepresentation.js
function valueToObjectRepresentation(argObj, name, value, variables) {
  if (value.kind === Kind.INT || value.kind === Kind.FLOAT) {
    argObj[name.value] = Number(value.value);
  } else if (value.kind === Kind.BOOLEAN || value.kind === Kind.STRING) {
    argObj[name.value] = value.value;
  } else if (value.kind === Kind.OBJECT) {
    const nestedArgObj = {};
    value.fields.map((obj) => valueToObjectRepresentation(nestedArgObj, obj.name, obj.value, variables));
    argObj[name.value] = nestedArgObj;
  } else if (value.kind === Kind.VARIABLE) {
    const variableValue = (variables || {})[value.name.value];
    argObj[name.value] = variableValue;
  } else if (value.kind === Kind.LIST) {
    argObj[name.value] = value.values.map((listValue) => {
      const nestedArgArrayObj = {};
      valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
      return nestedArgArrayObj[name.value];
    });
  } else if (value.kind === Kind.ENUM) {
    argObj[name.value] = value.value;
  } else if (value.kind === Kind.NULL) {
    argObj[name.value] = null;
  } else {
    throw newInvariantError(19, name.value, value.kind);
  }
}

// node_modules/@apollo/client/utilities/internal/argumentsObjectFromField.js
function argumentsObjectFromField(field, variables) {
  if (field.arguments && field.arguments.length) {
    const argObj = {};
    field.arguments.forEach(({ name, value }) => valueToObjectRepresentation(argObj, name, value, variables));
    return argObj;
  }
  return null;
}

// node_modules/@apollo/client/utilities/internal/canUseDOM.js
var canUseDOM = typeof maybe(() => window.document.createElement) === "function";

// node_modules/@wry/caches/lib/strong.js
function defaultDispose() {
}
var StrongCache = class {
  constructor(max2 = Infinity, dispose = defaultDispose) {
    this.max = max2;
    this.dispose = dispose;
    this.map = /* @__PURE__ */ new Map();
    this.newest = null;
    this.oldest = null;
  }
  has(key) {
    return this.map.has(key);
  }
  get(key) {
    const node = this.getNode(key);
    return node && node.value;
  }
  get size() {
    return this.map.size;
  }
  getNode(key) {
    const node = this.map.get(key);
    if (node && node !== this.newest) {
      const { older, newer } = node;
      if (newer) {
        newer.older = older;
      }
      if (older) {
        older.newer = newer;
      }
      node.older = this.newest;
      node.older.newer = node;
      node.newer = null;
      this.newest = node;
      if (node === this.oldest) {
        this.oldest = newer;
      }
    }
    return node;
  }
  set(key, value) {
    let node = this.getNode(key);
    if (node) {
      return node.value = value;
    }
    node = {
      key,
      value,
      newer: null,
      older: this.newest
    };
    if (this.newest) {
      this.newest.newer = node;
    }
    this.newest = node;
    this.oldest = this.oldest || node;
    this.map.set(key, node);
    return node.value;
  }
  clean() {
    while (this.oldest && this.map.size > this.max) {
      this.delete(this.oldest.key);
    }
  }
  delete(key) {
    const node = this.map.get(key);
    if (node) {
      if (node === this.newest) {
        this.newest = node.older;
      }
      if (node === this.oldest) {
        this.oldest = node.newer;
      }
      if (node.newer) {
        node.newer.older = node.older;
      }
      if (node.older) {
        node.older.newer = node.newer;
      }
      this.map.delete(key);
      this.dispose(node.value, key);
      return true;
    }
    return false;
  }
};

// node_modules/@wry/caches/lib/weak.js
function noop2() {
}
var defaultDispose2 = noop2;
var _WeakRef = typeof WeakRef !== "undefined" ? WeakRef : function(value) {
  return { deref: () => value };
};
var _WeakMap = typeof WeakMap !== "undefined" ? WeakMap : Map;
var _FinalizationRegistry = typeof FinalizationRegistry !== "undefined" ? FinalizationRegistry : function() {
  return {
    register: noop2,
    unregister: noop2
  };
};
var finalizationBatchSize = 10024;
var WeakCache = class {
  constructor(max2 = Infinity, dispose = defaultDispose2) {
    this.max = max2;
    this.dispose = dispose;
    this.map = new _WeakMap();
    this.newest = null;
    this.oldest = null;
    this.unfinalizedNodes = /* @__PURE__ */ new Set();
    this.finalizationScheduled = false;
    this.size = 0;
    this.finalize = () => {
      const iterator2 = this.unfinalizedNodes.values();
      for (let i = 0; i < finalizationBatchSize; i++) {
        const node = iterator2.next().value;
        if (!node)
          break;
        this.unfinalizedNodes.delete(node);
        const key = node.key;
        delete node.key;
        node.keyRef = new _WeakRef(key);
        this.registry.register(key, node, node);
      }
      if (this.unfinalizedNodes.size > 0) {
        queueMicrotask(this.finalize);
      } else {
        this.finalizationScheduled = false;
      }
    };
    this.registry = new _FinalizationRegistry(this.deleteNode.bind(this));
  }
  has(key) {
    return this.map.has(key);
  }
  get(key) {
    const node = this.getNode(key);
    return node && node.value;
  }
  getNode(key) {
    const node = this.map.get(key);
    if (node && node !== this.newest) {
      const { older, newer } = node;
      if (newer) {
        newer.older = older;
      }
      if (older) {
        older.newer = newer;
      }
      node.older = this.newest;
      node.older.newer = node;
      node.newer = null;
      this.newest = node;
      if (node === this.oldest) {
        this.oldest = newer;
      }
    }
    return node;
  }
  set(key, value) {
    let node = this.getNode(key);
    if (node) {
      return node.value = value;
    }
    node = {
      key,
      value,
      newer: null,
      older: this.newest
    };
    if (this.newest) {
      this.newest.newer = node;
    }
    this.newest = node;
    this.oldest = this.oldest || node;
    this.scheduleFinalization(node);
    this.map.set(key, node);
    this.size++;
    return node.value;
  }
  clean() {
    while (this.oldest && this.size > this.max) {
      this.deleteNode(this.oldest);
    }
  }
  deleteNode(node) {
    if (node === this.newest) {
      this.newest = node.older;
    }
    if (node === this.oldest) {
      this.oldest = node.newer;
    }
    if (node.newer) {
      node.newer.older = node.older;
    }
    if (node.older) {
      node.older.newer = node.newer;
    }
    this.size--;
    const key = node.key || node.keyRef && node.keyRef.deref();
    this.dispose(node.value, key);
    if (!node.keyRef) {
      this.unfinalizedNodes.delete(node);
    } else {
      this.registry.unregister(node);
    }
    if (key)
      this.map.delete(key);
  }
  delete(key) {
    const node = this.map.get(key);
    if (node) {
      this.deleteNode(node);
      return true;
    }
    return false;
  }
  scheduleFinalization(node) {
    this.unfinalizedNodes.add(node);
    if (!this.finalizationScheduled) {
      this.finalizationScheduled = true;
      queueMicrotask(this.finalize);
    }
  }
};

// node_modules/@wry/trie/lib/index.js
var defaultMakeData = () => /* @__PURE__ */ Object.create(null);
var { forEach, slice } = Array.prototype;
var { hasOwnProperty: hasOwnProperty2 } = Object.prototype;
var Trie = class _Trie {
  constructor(weakness = true, makeData = defaultMakeData) {
    this.weakness = weakness;
    this.makeData = makeData;
  }
  lookup() {
    return this.lookupArray(arguments);
  }
  lookupArray(array) {
    let node = this;
    forEach.call(array, (key) => node = node.getChildTrie(key));
    return hasOwnProperty2.call(node, "data") ? node.data : node.data = this.makeData(slice.call(array));
  }
  peek() {
    return this.peekArray(arguments);
  }
  peekArray(array) {
    let node = this;
    for (let i = 0, len = array.length; node && i < len; ++i) {
      const map2 = node.mapFor(array[i], false);
      node = map2 && map2.get(array[i]);
    }
    return node && node.data;
  }
  remove() {
    return this.removeArray(arguments);
  }
  removeArray(array) {
    let data;
    if (array.length) {
      const head = array[0];
      const map2 = this.mapFor(head, false);
      const child = map2 && map2.get(head);
      if (child) {
        data = child.removeArray(slice.call(array, 1));
        if (!child.data && !child.weak && !(child.strong && child.strong.size)) {
          map2.delete(head);
        }
      }
    } else {
      data = this.data;
      delete this.data;
    }
    return data;
  }
  getChildTrie(key) {
    const map2 = this.mapFor(key, true);
    let child = map2.get(key);
    if (!child)
      map2.set(key, child = new _Trie(this.weakness, this.makeData));
    return child;
  }
  mapFor(key, create) {
    return this.weakness && isObjRef(key) ? this.weak || (create ? this.weak = /* @__PURE__ */ new WeakMap() : void 0) : this.strong || (create ? this.strong = /* @__PURE__ */ new Map() : void 0);
  }
};
function isObjRef(value) {
  switch (typeof value) {
    case "object":
      if (value === null)
        break;
    // Fall through to return true...
    case "function":
      return true;
  }
  return false;
}

// node_modules/@wry/context/lib/slot.js
var currentContext = null;
var MISSING_VALUE = {};
var idCounter = 1;
var makeSlotClass = () => class Slot {
  constructor() {
    this.id = [
      "slot",
      idCounter++,
      Date.now(),
      Math.random().toString(36).slice(2)
    ].join(":");
  }
  hasValue() {
    for (let context2 = currentContext; context2; context2 = context2.parent) {
      if (this.id in context2.slots) {
        const value = context2.slots[this.id];
        if (value === MISSING_VALUE)
          break;
        if (context2 !== currentContext) {
          currentContext.slots[this.id] = value;
        }
        return true;
      }
    }
    if (currentContext) {
      currentContext.slots[this.id] = MISSING_VALUE;
    }
    return false;
  }
  getValue() {
    if (this.hasValue()) {
      return currentContext.slots[this.id];
    }
  }
  withValue(value, callback, args, thisArg) {
    const slots = {
      __proto__: null,
      [this.id]: value
    };
    const parent = currentContext;
    currentContext = { parent, slots };
    try {
      return callback.apply(thisArg, args);
    } finally {
      currentContext = parent;
    }
  }
  // Capture the current context and wrap a callback function so that it
  // reestablishes the captured context when called.
  static bind(callback) {
    const context2 = currentContext;
    return function() {
      const saved = currentContext;
      try {
        currentContext = context2;
        return callback.apply(this, arguments);
      } finally {
        currentContext = saved;
      }
    };
  }
  // Immediately run a callback function without any captured context.
  static noContext(callback, args, thisArg) {
    if (currentContext) {
      const saved = currentContext;
      try {
        currentContext = null;
        return callback.apply(thisArg, args);
      } finally {
        currentContext = saved;
      }
    } else {
      return callback.apply(thisArg, args);
    }
  }
};
function maybe2(fn) {
  try {
    return fn();
  } catch (ignored) {
  }
}
var globalKey = "@wry/context:Slot";
var host = (
  // Prefer globalThis when available.
  // https://github.com/benjamn/wryware/issues/347
  maybe2(() => globalThis) || // Fall back to global, which works in Node.js and may be converted by some
  // bundlers to the appropriate identifier (window, self, ...) depending on the
  // bundling target. https://github.com/endojs/endo/issues/576#issuecomment-1178515224
  maybe2(() => global) || // Otherwise, use a dummy host that's local to this module. We used to fall
  // back to using the Array constructor as a namespace, but that was flagged in
  // https://github.com/benjamn/wryware/issues/347, and can be avoided.
  /* @__PURE__ */ Object.create(null)
);
var globalHost = host;
var Slot = globalHost[globalKey] || // Earlier versions of this package stored the globalKey property on the Array
// constructor, so we check there as well, to prevent Slot class duplication.
Array[globalKey] || (function(Slot2) {
  try {
    Object.defineProperty(globalHost, globalKey, {
      value: Slot2,
      enumerable: false,
      writable: false,
      // When it was possible for globalHost to be the Array constructor (a
      // legacy Slot dedup strategy), it was important for the property to be
      // configurable:true so it could be deleted. That does not seem to be as
      // important when globalHost is the global object, but I don't want to
      // cause similar problems again, and configurable:true seems safest.
      // https://github.com/endojs/endo/issues/576#issuecomment-1178274008
      configurable: true
    });
  } finally {
    return Slot2;
  }
})(makeSlotClass());

// node_modules/@wry/context/lib/index.js
var { bind: bind2, noContext } = Slot;

// node_modules/optimism/lib/context.js
var parentEntrySlot = new Slot();

// node_modules/optimism/lib/helpers.js
var { hasOwnProperty: hasOwnProperty3 } = Object.prototype;
var arrayFromSet = Array.from || function(set) {
  const array = [];
  set.forEach((item) => array.push(item));
  return array;
};
function maybeUnsubscribe(entryOrDep) {
  const { unsubscribe } = entryOrDep;
  if (typeof unsubscribe === "function") {
    entryOrDep.unsubscribe = void 0;
    unsubscribe();
  }
}

// node_modules/optimism/lib/entry.js
var emptySetPool = [];
var POOL_TARGET_SIZE = 100;
function assert(condition, optionalMessage) {
  if (!condition) {
    throw new Error(optionalMessage || "assertion failure");
  }
}
function valueIs(a, b) {
  const len = a.length;
  return (
    // Unknown values are not equal to each other.
    len > 0 && // Both values must be ordinary (or both exceptional) to be equal.
    len === b.length && // The underlying value or exception must be the same.
    a[len - 1] === b[len - 1]
  );
}
function valueGet(value) {
  switch (value.length) {
    case 0:
      throw new Error("unknown value");
    case 1:
      return value[0];
    case 2:
      throw value[1];
  }
}
function valueCopy(value) {
  return value.slice(0);
}
var Entry = class _Entry {
  constructor(fn) {
    this.fn = fn;
    this.parents = /* @__PURE__ */ new Set();
    this.childValues = /* @__PURE__ */ new Map();
    this.dirtyChildren = null;
    this.dirty = true;
    this.recomputing = false;
    this.value = [];
    this.deps = null;
    ++_Entry.count;
  }
  peek() {
    if (this.value.length === 1 && !mightBeDirty(this)) {
      rememberParent(this);
      return this.value[0];
    }
  }
  // This is the most important method of the Entry API, because it
  // determines whether the cached this.value can be returned immediately,
  // or must be recomputed. The overall performance of the caching system
  // depends on the truth of the following observations: (1) this.dirty is
  // usually false, (2) this.dirtyChildren is usually null/empty, and thus
  // (3) valueGet(this.value) is usually returned without recomputation.
  recompute(args) {
    assert(!this.recomputing, "already recomputing");
    rememberParent(this);
    return mightBeDirty(this) ? reallyRecompute(this, args) : valueGet(this.value);
  }
  setDirty() {
    if (this.dirty)
      return;
    this.dirty = true;
    reportDirty(this);
    maybeUnsubscribe(this);
  }
  dispose() {
    this.setDirty();
    forgetChildren(this);
    eachParent(this, (parent, child) => {
      parent.setDirty();
      forgetChild(parent, this);
    });
  }
  forget() {
    this.dispose();
  }
  dependOn(dep2) {
    dep2.add(this);
    if (!this.deps) {
      this.deps = emptySetPool.pop() || /* @__PURE__ */ new Set();
    }
    this.deps.add(dep2);
  }
  forgetDeps() {
    if (this.deps) {
      arrayFromSet(this.deps).forEach((dep2) => dep2.delete(this));
      this.deps.clear();
      emptySetPool.push(this.deps);
      this.deps = null;
    }
  }
};
Entry.count = 0;
function rememberParent(child) {
  const parent = parentEntrySlot.getValue();
  if (parent) {
    child.parents.add(parent);
    if (!parent.childValues.has(child)) {
      parent.childValues.set(child, []);
    }
    if (mightBeDirty(child)) {
      reportDirtyChild(parent, child);
    } else {
      reportCleanChild(parent, child);
    }
    return parent;
  }
}
function reallyRecompute(entry, args) {
  forgetChildren(entry);
  parentEntrySlot.withValue(entry, recomputeNewValue, [entry, args]);
  if (maybeSubscribe(entry, args)) {
    setClean(entry);
  }
  return valueGet(entry.value);
}
function recomputeNewValue(entry, args) {
  entry.recomputing = true;
  const { normalizeResult } = entry;
  let oldValueCopy;
  if (normalizeResult && entry.value.length === 1) {
    oldValueCopy = valueCopy(entry.value);
  }
  entry.value.length = 0;
  try {
    entry.value[0] = entry.fn.apply(null, args);
    if (normalizeResult && oldValueCopy && !valueIs(oldValueCopy, entry.value)) {
      try {
        entry.value[0] = normalizeResult(entry.value[0], oldValueCopy[0]);
      } catch (_a) {
      }
    }
  } catch (e) {
    entry.value[1] = e;
  }
  entry.recomputing = false;
}
function mightBeDirty(entry) {
  return entry.dirty || !!(entry.dirtyChildren && entry.dirtyChildren.size);
}
function setClean(entry) {
  entry.dirty = false;
  if (mightBeDirty(entry)) {
    return;
  }
  reportClean(entry);
}
function reportDirty(child) {
  eachParent(child, reportDirtyChild);
}
function reportClean(child) {
  eachParent(child, reportCleanChild);
}
function eachParent(child, callback) {
  const parentCount = child.parents.size;
  if (parentCount) {
    const parents = arrayFromSet(child.parents);
    for (let i = 0; i < parentCount; ++i) {
      callback(parents[i], child);
    }
  }
}
function reportDirtyChild(parent, child) {
  assert(parent.childValues.has(child));
  assert(mightBeDirty(child));
  const parentWasClean = !mightBeDirty(parent);
  if (!parent.dirtyChildren) {
    parent.dirtyChildren = emptySetPool.pop() || /* @__PURE__ */ new Set();
  } else if (parent.dirtyChildren.has(child)) {
    return;
  }
  parent.dirtyChildren.add(child);
  if (parentWasClean) {
    reportDirty(parent);
  }
}
function reportCleanChild(parent, child) {
  assert(parent.childValues.has(child));
  assert(!mightBeDirty(child));
  const childValue = parent.childValues.get(child);
  if (childValue.length === 0) {
    parent.childValues.set(child, valueCopy(child.value));
  } else if (!valueIs(childValue, child.value)) {
    parent.setDirty();
  }
  removeDirtyChild(parent, child);
  if (mightBeDirty(parent)) {
    return;
  }
  reportClean(parent);
}
function removeDirtyChild(parent, child) {
  const dc = parent.dirtyChildren;
  if (dc) {
    dc.delete(child);
    if (dc.size === 0) {
      if (emptySetPool.length < POOL_TARGET_SIZE) {
        emptySetPool.push(dc);
      }
      parent.dirtyChildren = null;
    }
  }
}
function forgetChildren(parent) {
  if (parent.childValues.size > 0) {
    parent.childValues.forEach((_value, child) => {
      forgetChild(parent, child);
    });
  }
  parent.forgetDeps();
  assert(parent.dirtyChildren === null);
}
function forgetChild(parent, child) {
  child.parents.delete(parent);
  parent.childValues.delete(child);
  removeDirtyChild(parent, child);
}
function maybeSubscribe(entry, args) {
  if (typeof entry.subscribe === "function") {
    try {
      maybeUnsubscribe(entry);
      entry.unsubscribe = entry.subscribe.apply(null, args);
    } catch (e) {
      entry.setDirty();
      return false;
    }
  }
  return true;
}

// node_modules/optimism/lib/dep.js
var EntryMethods = {
  setDirty: true,
  dispose: true,
  forget: true
  // Fully remove parent Entry from LRU cache and computation graph
};
function dep(options) {
  const depsByKey = /* @__PURE__ */ new Map();
  const subscribe2 = options && options.subscribe;
  function depend(key) {
    const parent = parentEntrySlot.getValue();
    if (parent) {
      let dep2 = depsByKey.get(key);
      if (!dep2) {
        depsByKey.set(key, dep2 = /* @__PURE__ */ new Set());
      }
      parent.dependOn(dep2);
      if (typeof subscribe2 === "function") {
        maybeUnsubscribe(dep2);
        dep2.unsubscribe = subscribe2(key);
      }
    }
  }
  depend.dirty = function dirty(key, entryMethodName) {
    const dep2 = depsByKey.get(key);
    if (dep2) {
      const m = entryMethodName && hasOwnProperty3.call(EntryMethods, entryMethodName) ? entryMethodName : "setDirty";
      arrayFromSet(dep2).forEach((entry) => entry[m]());
      depsByKey.delete(key);
      maybeUnsubscribe(dep2);
    }
  };
  return depend;
}

// node_modules/optimism/lib/index.js
var defaultKeyTrie;
function defaultMakeCacheKey(...args) {
  const trie = defaultKeyTrie || (defaultKeyTrie = new Trie(typeof WeakMap === "function"));
  return trie.lookupArray(args);
}
var caches = /* @__PURE__ */ new Set();
function wrap2(originalFunction, { max: max2 = Math.pow(2, 16), keyArgs, makeCacheKey = defaultMakeCacheKey, normalizeResult, subscribe: subscribe2, cache: cacheOption = StrongCache } = /* @__PURE__ */ Object.create(null)) {
  const cache = typeof cacheOption === "function" ? new cacheOption(max2, (entry) => entry.dispose()) : cacheOption;
  const optimistic = function() {
    const key = makeCacheKey.apply(null, keyArgs ? keyArgs.apply(null, arguments) : arguments);
    if (key === void 0) {
      return originalFunction.apply(null, arguments);
    }
    let entry = cache.get(key);
    if (!entry) {
      cache.set(key, entry = new Entry(originalFunction));
      entry.normalizeResult = normalizeResult;
      entry.subscribe = subscribe2;
      entry.forget = () => cache.delete(key);
    }
    const value = entry.recompute(Array.prototype.slice.call(arguments));
    cache.set(key, entry);
    caches.add(cache);
    if (!parentEntrySlot.hasValue()) {
      caches.forEach((cache2) => cache2.clean());
      caches.clear();
    }
    return value;
  };
  Object.defineProperty(optimistic, "size", {
    get: () => cache.size,
    configurable: false,
    enumerable: false
  });
  Object.freeze(optimistic.options = {
    max: max2,
    keyArgs,
    makeCacheKey,
    normalizeResult,
    subscribe: subscribe2,
    cache
  });
  function dirtyKey(key) {
    const entry = key && cache.get(key);
    if (entry) {
      entry.setDirty();
    }
  }
  optimistic.dirtyKey = dirtyKey;
  optimistic.dirty = function dirty() {
    dirtyKey(makeCacheKey.apply(null, arguments));
  };
  function peekKey(key) {
    const entry = key && cache.get(key);
    if (entry) {
      return entry.peek();
    }
  }
  optimistic.peekKey = peekKey;
  optimistic.peek = function peek() {
    return peekKey(makeCacheKey.apply(null, arguments));
  };
  function forgetKey(key) {
    return key ? cache.delete(key) : false;
  }
  optimistic.forgetKey = forgetKey;
  optimistic.forget = function forget() {
    return forgetKey(makeCacheKey.apply(null, arguments));
  };
  optimistic.makeCacheKey = makeCacheKey;
  optimistic.getKey = keyArgs ? function getKey() {
    return makeCacheKey.apply(null, keyArgs.apply(null, arguments));
  } : makeCacheKey;
  return Object.freeze(optimistic);
}

// node_modules/@apollo/client/utilities/caching/sizes.js
var cacheSizeSymbol = Symbol.for("apollo.cacheSize");
var cacheSizes = { ...global_default[cacheSizeSymbol] };

// node_modules/@apollo/client/utilities/internal/getOperationName.js
function getOperationName(doc, fallback) {
  return doc.definitions.find((definition) => definition.kind === "OperationDefinition" && !!definition.name)?.name.value ?? fallback;
}

// node_modules/@apollo/client/utilities/internal/checkDocument.js
var checkDocument = wrap2((doc, expectedType) => {
  invariant3(doc && doc.kind === "Document", 1);
  const operations = doc.definitions.filter((d) => d.kind === "OperationDefinition");
  if (__DEV__) {
    doc.definitions.forEach((definition) => {
      if (definition.kind !== "OperationDefinition" && definition.kind !== "FragmentDefinition") {
        throw newInvariantError(2, definition.kind);
      }
    });
    invariant3(operations.length <= 1, 3, operations.length);
  }
  if (expectedType) {
    invariant3(
      operations.length == 1 && operations[0].operation === expectedType,
      4,
      expectedType,
      expectedType,
      operations[0].operation
    );
  }
  visit(doc, {
    Field(field, _, __, path) {
      if (field.alias && (field.alias.value === "__typename" || field.alias.value.startsWith("__ac_")) && field.alias.value !== field.name.value) {
        let current = doc, fieldPath = [];
        for (const key of path) {
          current = current[key];
          if (current.kind === Kind.FIELD) {
            fieldPath.push(current.alias?.value || current.name.value);
          }
        }
        fieldPath.splice(-1, 1, field.name.value);
        throw newInvariantError(
          5,
          field.alias.value,
          fieldPath.join("."),
          operations[0].operation,
          getOperationName(doc, "(anonymous)")
        );
      }
    }
  });
}, {
  max: cacheSizes["checkDocument"] || 2e3,
  cache: WeakCache
});

// node_modules/@apollo/client/utilities/internal/cloneDeep.js
var { toString } = Object.prototype;
function cloneDeep(value) {
  return __cloneDeep(value);
}
function __cloneDeep(val, seen) {
  switch (toString.call(val)) {
    case "[object Array]": {
      seen = seen || /* @__PURE__ */ new Map();
      if (seen.has(val))
        return seen.get(val);
      const copy = val.slice(0);
      seen.set(val, copy);
      copy.forEach(function(child, i) {
        copy[i] = __cloneDeep(child, seen);
      });
      return copy;
    }
    case "[object Object]": {
      seen = seen || /* @__PURE__ */ new Map();
      if (seen.has(val))
        return seen.get(val);
      const copy = Object.create(Object.getPrototypeOf(val));
      seen.set(val, copy);
      Object.keys(val).forEach((key) => {
        copy[key] = __cloneDeep(val[key], seen);
      });
      return copy;
    }
    default:
      return val;
  }
}

// node_modules/@apollo/client/utilities/internal/compact.js
function compact(...objects) {
  const result = {};
  objects.forEach((obj) => {
    if (!obj)
      return;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value !== void 0) {
        result[key] = value;
      }
    });
  });
  return result;
}

// node_modules/@apollo/client/utilities/internal/createFragmentMap.js
function createFragmentMap(fragments = []) {
  const symTable = {};
  fragments.forEach((fragment) => {
    symTable[fragment.name.value] = fragment;
  });
  return symTable;
}

// node_modules/@apollo/client/utilities/internal/createFulfilledPromise.js
function createFulfilledPromise(value) {
  const promise = Promise.resolve(value);
  promise.status = "fulfilled";
  promise.value = value;
  return promise;
}

// node_modules/@apollo/client/utilities/internal/createRejectedPromise.js
function createRejectedPromise(reason) {
  const promise = Promise.reject(reason);
  promise.catch(() => {
  });
  promise.status = "rejected";
  promise.reason = reason;
  return promise;
}

// node_modules/@apollo/client/utilities/internal/decoratePromise.js
function isDecoratedPromise(promise) {
  return "status" in promise;
}
function decoratePromise(promise) {
  if (isDecoratedPromise(promise)) {
    return promise;
  }
  const pendingPromise = promise;
  pendingPromise.status = "pending";
  pendingPromise.then((value) => {
    if (pendingPromise.status === "pending") {
      const fulfilledPromise = pendingPromise;
      fulfilledPromise.status = "fulfilled";
      fulfilledPromise.value = value;
    }
  }, (reason) => {
    if (pendingPromise.status === "pending") {
      const rejectedPromise = pendingPromise;
      rejectedPromise.status = "rejected";
      rejectedPromise.reason = reason;
    }
  });
  return promise;
}

// node_modules/@apollo/client/utilities/internal/isNonNullObject.js
function isNonNullObject(obj) {
  return obj !== null && typeof obj === "object";
}

// node_modules/@apollo/client/utilities/internal/DeepMerger.js
var { hasOwnProperty: hasOwnProperty4 } = Object.prototype;
var defaultReconciler = function(target, source, property) {
  return this.merge(target[property], source[property]);
};
var DeepMerger = class {
  reconciler;
  constructor(reconciler = defaultReconciler) {
    this.reconciler = reconciler;
  }
  merge(target, source, ...context2) {
    if (isNonNullObject(source) && isNonNullObject(target)) {
      Object.keys(source).forEach((sourceKey) => {
        if (hasOwnProperty4.call(target, sourceKey)) {
          const targetValue = target[sourceKey];
          if (source[sourceKey] !== targetValue) {
            const result = this.reconciler(target, source, sourceKey, ...context2);
            if (result !== targetValue) {
              target = this.shallowCopyForMerge(target);
              target[sourceKey] = result;
            }
          }
        } else {
          target = this.shallowCopyForMerge(target);
          target[sourceKey] = source[sourceKey];
        }
      });
      return target;
    }
    return source;
  }
  isObject = isNonNullObject;
  pastCopies = /* @__PURE__ */ new Set();
  shallowCopyForMerge(value) {
    if (isNonNullObject(value)) {
      if (!this.pastCopies.has(value)) {
        if (Array.isArray(value)) {
          value = value.slice(0);
        } else {
          value = {
            __proto__: Object.getPrototypeOf(value),
            ...value
          };
        }
        this.pastCopies.add(value);
      }
    }
    return value;
  }
};

// node_modules/@apollo/client/utilities/internal/getDefaultValues.js
function getDefaultValues(definition) {
  const defaultValues = {};
  const defs = definition && definition.variableDefinitions;
  if (defs && defs.length) {
    defs.forEach((def) => {
      if (def.defaultValue) {
        valueToObjectRepresentation(defaultValues, def.variable.name, def.defaultValue);
      }
    });
  }
  return defaultValues;
}

// node_modules/@apollo/client/utilities/internal/getFragmentFromSelection.js
function getFragmentFromSelection(selection, fragmentMap) {
  switch (selection.kind) {
    case "InlineFragment":
      return selection;
    case "FragmentSpread": {
      const fragmentName = selection.name.value;
      if (typeof fragmentMap === "function") {
        return fragmentMap(fragmentName);
      }
      const fragment = fragmentMap && fragmentMap[fragmentName];
      invariant3(fragment, 9, fragmentName);
      return fragment || null;
    }
    default:
      return null;
  }
}

// node_modules/@apollo/client/utilities/internal/getFragmentQueryDocument.js
function getFragmentQueryDocument(document, fragmentName) {
  let actualFragmentName = fragmentName;
  const fragments = [];
  document.definitions.forEach((definition) => {
    if (definition.kind === "OperationDefinition") {
      throw newInvariantError(
        10,
        definition.operation,
        definition.name ? ` named '${definition.name.value}'` : ""
      );
    }
    if (definition.kind === "FragmentDefinition") {
      fragments.push(definition);
    }
  });
  if (typeof actualFragmentName === "undefined") {
    invariant3(fragments.length === 1, 11, fragments.length);
    actualFragmentName = fragments[0].name.value;
  }
  const query = {
    ...document,
    definitions: [
      {
        kind: "OperationDefinition",
        // OperationTypeNode is an enum
        operation: "query",
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            {
              kind: "FragmentSpread",
              name: {
                kind: "Name",
                value: actualFragmentName
              }
            }
          ]
        }
      },
      ...document.definitions
    ]
  };
  return query;
}

// node_modules/@apollo/client/utilities/internal/getFragmentDefinition.js
function getFragmentDefinition(doc) {
  invariant3(doc.kind === "Document", 6);
  invariant3(doc.definitions.length <= 1, 7);
  const fragmentDef = doc.definitions[0];
  invariant3(fragmentDef.kind === "FragmentDefinition", 8);
  return fragmentDef;
}

// node_modules/@apollo/client/utilities/internal/getFragmentDefinitions.js
function getFragmentDefinitions(doc) {
  return doc.definitions.filter((definition) => definition.kind === "FragmentDefinition");
}

// node_modules/@apollo/client/utilities/internal/getMainDefinition.js
function getMainDefinition(queryDoc) {
  checkDocument(queryDoc);
  let fragmentDefinition;
  for (let definition of queryDoc.definitions) {
    if (definition.kind === "OperationDefinition") {
      return definition;
    }
    if (definition.kind === "FragmentDefinition" && !fragmentDefinition) {
      fragmentDefinition = definition;
    }
  }
  if (fragmentDefinition) {
    return fragmentDefinition;
  }
  throw newInvariantError(12);
}

// node_modules/@apollo/client/utilities/internal/getOperationDefinition.js
function getOperationDefinition(doc) {
  checkDocument(doc);
  return doc.definitions.filter((definition) => definition.kind === "OperationDefinition")[0];
}

// node_modules/@apollo/client/utilities/internal/getQueryDefinition.js
function getQueryDefinition(doc) {
  const queryDef = getOperationDefinition(doc);
  invariant3(queryDef && queryDef.operation === "query", 13);
  return queryDef;
}

// node_modules/@apollo/client/utilities/internal/caches.js
var scheduledCleanup = /* @__PURE__ */ new WeakSet();
function schedule(cache) {
  if (cache.size <= (cache.max || -1)) {
    return;
  }
  if (!scheduledCleanup.has(cache)) {
    scheduledCleanup.add(cache);
    setTimeout(() => {
      cache.clean();
      scheduledCleanup.delete(cache);
    }, 100);
  }
}
var AutoCleanedWeakCache = function(max2, dispose) {
  const cache = new WeakCache(max2, dispose);
  cache.set = function(key, value) {
    const ret = WeakCache.prototype.set.call(this, key, value);
    schedule(this);
    return ret;
  };
  return cache;
};
var AutoCleanedStrongCache = function(max2, dispose) {
  const cache = new StrongCache(max2, dispose);
  cache.set = function(key, value) {
    const ret = StrongCache.prototype.set.call(this, key, value);
    schedule(this);
    return ret;
  };
  return cache;
};

// node_modules/@apollo/client/utilities/internal/getMemoryInternals.js
var globalCaches = {};
function registerGlobalCache(name, getSize) {
  globalCaches[name] = getSize;
}
var getApolloClientMemoryInternals = __DEV__ ? _getApolloClientMemoryInternals : void 0;
var getInMemoryCacheMemoryInternals = __DEV__ ? _getInMemoryCacheMemoryInternals : void 0;
var getApolloCacheMemoryInternals = __DEV__ ? _getApolloCacheMemoryInternals : void 0;
function getCurrentCacheSizes() {
  const defaults = {
    canonicalStringify: 1e3,
    checkDocument: 2e3,
    print: 2e3,
    "documentTransform.cache": 2e3,
    "queryManager.getDocumentInfo": 2e3,
    "PersistedQueryLink.persistedQueryHashes": 2e3,
    "fragmentRegistry.transform": 2e3,
    "fragmentRegistry.lookup": 1e3,
    "fragmentRegistry.findFragmentSpreads": 4e3,
    "cache.fragmentQueryDocuments": 1e3,
    "removeTypenameFromVariables.getVariableDefinitions": 2e3,
    "inMemoryCache.maybeBroadcastWatch": 5e3,
    "inMemoryCache.executeSelectionSet": 5e4,
    "inMemoryCache.executeSubSelectedArray": 1e4
  };
  return Object.fromEntries(Object.entries(defaults).map(([k, v]) => [
    k,
    cacheSizes[k] || v
  ]));
}
function _getApolloClientMemoryInternals() {
  if (!__DEV__)
    throw new Error("only supported in development mode");
  return {
    limits: getCurrentCacheSizes(),
    sizes: {
      print: globalCaches.print?.(),
      canonicalStringify: globalCaches.canonicalStringify?.(),
      links: linkInfo(this.link),
      queryManager: {
        getDocumentInfo: this["queryManager"]["transformCache"].size,
        documentTransforms: transformInfo(this["queryManager"].documentTransform)
      },
      ...this.cache.getMemoryInternals?.()
    }
  };
}
function _getApolloCacheMemoryInternals() {
  return {
    cache: {
      fragmentQueryDocuments: getWrapperInformation(this["getFragmentDoc"])
    }
  };
}
function _getInMemoryCacheMemoryInternals() {
  const fragments = this.config.fragments;
  return {
    ..._getApolloCacheMemoryInternals.apply(this),
    addTypenameDocumentTransform: transformInfo(this["addTypenameTransform"]),
    inMemoryCache: {
      executeSelectionSet: getWrapperInformation(this["storeReader"]["executeSelectionSet"]),
      executeSubSelectedArray: getWrapperInformation(this["storeReader"]["executeSubSelectedArray"]),
      maybeBroadcastWatch: getWrapperInformation(this["maybeBroadcastWatch"])
    },
    fragmentRegistry: {
      findFragmentSpreads: getWrapperInformation(fragments?.findFragmentSpreads),
      lookup: getWrapperInformation(fragments?.lookup),
      transform: getWrapperInformation(fragments?.transform)
    }
  };
}
function isWrapper(f) {
  return !!f && "dirtyKey" in f;
}
function getWrapperInformation(f) {
  return isWrapper(f) ? f.size : void 0;
}
function isDefined(value) {
  return value != null;
}
function transformInfo(transform) {
  return recurseTransformInfo(transform).map((cache) => ({ cache }));
}
function recurseTransformInfo(transform) {
  return transform ? [
    getWrapperInformation(transform?.["performWork"]),
    ...recurseTransformInfo(transform?.["left"]),
    ...recurseTransformInfo(transform?.["right"])
  ].filter(isDefined) : [];
}
function linkInfo(link) {
  return link ? [
    link?.getMemoryInternals?.(),
    ...linkInfo(link?.left),
    ...linkInfo(link?.right)
  ].filter(isDefined) : [];
}

// node_modules/@apollo/client/utilities/internal/canonicalStringify.js
var canonicalStringify = Object.assign(function canonicalStringify2(value) {
  return JSON.stringify(value, stableObjectReplacer);
}, {
  reset() {
    sortingMap = new AutoCleanedStrongCache(
      cacheSizes.canonicalStringify || 1e3
      /* defaultCacheSizes.canonicalStringify */
    );
  }
});
if (__DEV__) {
  registerGlobalCache("canonicalStringify", () => sortingMap.size);
}
var sortingMap;
canonicalStringify.reset();
function stableObjectReplacer(key, value) {
  if (value && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) {
      const keys = Object.keys(value);
      if (keys.every(everyKeyInOrder))
        return value;
      const unsortedKey = JSON.stringify(keys);
      let sortedKeys = sortingMap.get(unsortedKey);
      if (!sortedKeys) {
        keys.sort();
        const sortedKey = JSON.stringify(keys);
        sortedKeys = sortingMap.get(sortedKey) || keys;
        sortingMap.set(unsortedKey, sortedKeys);
        sortingMap.set(sortedKey, sortedKeys);
      }
      const sortedObject = Object.create(proto);
      sortedKeys.forEach((key2) => {
        sortedObject[key2] = value[key2];
      });
      return sortedObject;
    }
  }
  return value;
}
function everyKeyInOrder(key, i, keys) {
  return i === 0 || keys[i - 1] <= key;
}

// node_modules/@apollo/client/utilities/internal/getStoreKeyName.js
var KNOWN_DIRECTIVES = [
  "connection",
  "include",
  "skip",
  "client",
  "rest",
  "export",
  "nonreactive"
];
var storeKeyNameStringify = canonicalStringify;
var getStoreKeyName = Object.assign(function(fieldName, args, directives) {
  if (args && directives && directives["connection"] && directives["connection"]["key"]) {
    if (directives["connection"]["filter"] && directives["connection"]["filter"].length > 0) {
      const filterKeys = directives["connection"]["filter"] ? directives["connection"]["filter"] : [];
      filterKeys.sort();
      const filteredArgs = {};
      filterKeys.forEach((key) => {
        filteredArgs[key] = args[key];
      });
      const stringifiedArgs = storeKeyNameStringify(filteredArgs);
      if (stringifiedArgs !== "{}") {
        return `${directives["connection"]["key"]}(${stringifiedArgs})`;
      }
    }
    return directives["connection"]["key"];
  }
  let completeFieldName = fieldName;
  if (args) {
    const stringifiedArgs = storeKeyNameStringify(args);
    if (stringifiedArgs !== "{}") {
      completeFieldName += `(${stringifiedArgs})`;
    }
  }
  if (directives) {
    Object.keys(directives).forEach((key) => {
      if (KNOWN_DIRECTIVES.indexOf(key) !== -1)
        return;
      if (directives[key] && Object.keys(directives[key]).length) {
        completeFieldName += `@${key}(${storeKeyNameStringify(directives[key])})`;
      } else {
        completeFieldName += `@${key}`;
      }
    });
  }
  return completeFieldName;
}, {
  setStringify(s) {
    const previous = storeKeyNameStringify;
    storeKeyNameStringify = s;
    return previous;
  }
});

// node_modules/@apollo/client/utilities/internal/graphQLResultHasError.js
function graphQLResultHasError(result) {
  return !!result.errors?.length;
}

// node_modules/@apollo/client/utilities/internal/hasDirectives.js
function hasDirectives(names, root, all) {
  const nameSet = new Set(names);
  const uniqueCount = nameSet.size;
  visit(root, {
    Directive(node) {
      if (nameSet.delete(node.name.value) && (!all || !nameSet.size)) {
        return BREAK;
      }
    }
  });
  return all ? !nameSet.size : nameSet.size < uniqueCount;
}

// node_modules/@apollo/client/utilities/internal/hasForcedResolvers.js
function hasForcedResolvers(document) {
  let forceResolvers = false;
  visit(document, {
    Directive: {
      enter(node) {
        if (node.name.value === "client" && node.arguments) {
          forceResolvers = node.arguments.some((arg) => arg.name.value === "always" && arg.value.kind === "BooleanValue" && arg.value.value === true);
          if (forceResolvers) {
            return BREAK;
          }
        }
      }
    }
  });
  return forceResolvers;
}

// node_modules/@apollo/client/utilities/internal/isArray.js
var isArray4 = Array.isArray;

// node_modules/@apollo/client/utilities/internal/isDocumentNode.js
function isDocumentNode(value) {
  return isNonNullObject(value) && value.kind === "Document" && Array.isArray(value.definitions);
}

// node_modules/@apollo/client/utilities/internal/isField.js
function isField(selection) {
  return selection.kind === "Field";
}

// node_modules/@apollo/client/utilities/internal/isNonEmptyArray.js
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

// node_modules/@apollo/client/utilities/internal/makeReference.js
function makeReference(id) {
  return { __ref: String(id) };
}

// node_modules/@apollo/client/utilities/internal/deepFreeze.js
function deepFreeze(value) {
  const workSet = /* @__PURE__ */ new Set([value]);
  workSet.forEach((obj) => {
    if (isNonNullObject(obj) && shallowFreeze(obj) === obj) {
      Object.getOwnPropertyNames(obj).forEach((name) => {
        if (isNonNullObject(obj[name]))
          workSet.add(obj[name]);
      });
    }
  });
  return value;
}
function shallowFreeze(obj) {
  if (__DEV__ && !Object.isFrozen(obj)) {
    try {
      Object.freeze(obj);
    } catch (e) {
      if (e instanceof TypeError)
        return null;
      throw e;
    }
  }
  return obj;
}

// node_modules/@apollo/client/utilities/internal/maybeDeepFreeze.js
function maybeDeepFreeze(obj) {
  if (__DEV__) {
    deepFreeze(obj);
  }
  return obj;
}

// node_modules/@apollo/client/utilities/internal/mergeDeepArray.js
function mergeDeepArray(sources) {
  let target = sources[0] || {};
  const count2 = sources.length;
  if (count2 > 1) {
    const merger = new DeepMerger();
    for (let i = 1; i < count2; ++i) {
      target = merger.merge(target, sources[i]);
    }
  }
  return target;
}

// node_modules/@apollo/client/utilities/internal/mergeOptions.js
function mergeOptions(defaults, options) {
  return compact(defaults, options, options.variables && {
    variables: compact({
      ...defaults && defaults.variables,
      ...options.variables
    })
  });
}

// node_modules/@apollo/client/utilities/internal/preventUnhandledRejection.js
function preventUnhandledRejection(promise) {
  promise.catch(() => {
  });
  return promise;
}

// node_modules/@apollo/client/utilities/internal/removeDirectivesFromDocument.js
function removeDirectivesFromDocument(directives, doc) {
  checkDocument(doc);
  const getInUseByOperationName = makeInUseGetterFunction("");
  const getInUseByFragmentName = makeInUseGetterFunction("");
  const getInUse = (ancestors) => {
    for (let p = 0, ancestor; p < ancestors.length && (ancestor = ancestors[p]); ++p) {
      if (isArray4(ancestor))
        continue;
      if (ancestor.kind === Kind.OPERATION_DEFINITION) {
        return getInUseByOperationName(ancestor.name && ancestor.name.value);
      }
      if (ancestor.kind === Kind.FRAGMENT_DEFINITION) {
        return getInUseByFragmentName(ancestor.name.value);
      }
    }
    invariant3.error(14);
    return null;
  };
  let operationCount = 0;
  for (let i = doc.definitions.length - 1; i >= 0; --i) {
    if (doc.definitions[i].kind === Kind.OPERATION_DEFINITION) {
      ++operationCount;
    }
  }
  const directiveMatcher = getDirectiveMatcher(directives);
  const shouldRemoveField = (nodeDirectives) => isNonEmptyArray(nodeDirectives) && nodeDirectives.map(directiveMatcher).some((config2) => config2 && config2.remove);
  const originalFragmentDefsByPath = /* @__PURE__ */ new Map();
  let firstVisitMadeChanges = false;
  const fieldOrInlineFragmentVisitor = {
    enter(node) {
      if (shouldRemoveField(node.directives)) {
        firstVisitMadeChanges = true;
        return null;
      }
    }
  };
  const docWithoutDirectiveSubtrees = visit(doc, {
    // These two AST node types share the same implementation, defined above.
    Field: fieldOrInlineFragmentVisitor,
    InlineFragment: fieldOrInlineFragmentVisitor,
    VariableDefinition: {
      enter() {
        return false;
      }
    },
    Variable: {
      enter(node, _key, _parent, _path, ancestors) {
        const inUse = getInUse(ancestors);
        if (inUse) {
          inUse.variables.add(node.name.value);
        }
      }
    },
    FragmentSpread: {
      enter(node, _key, _parent, _path, ancestors) {
        if (shouldRemoveField(node.directives)) {
          firstVisitMadeChanges = true;
          return null;
        }
        const inUse = getInUse(ancestors);
        if (inUse) {
          inUse.fragmentSpreads.add(node.name.value);
        }
      }
    },
    FragmentDefinition: {
      enter(node, _key, _parent, path) {
        originalFragmentDefsByPath.set(JSON.stringify(path), node);
      },
      leave(node, _key, _parent, path) {
        const originalNode = originalFragmentDefsByPath.get(JSON.stringify(path));
        if (node === originalNode) {
          return node;
        }
        if (
          // This logic applies only if the document contains one or more
          // operations, since removing all fragments from a document containing
          // only fragments makes the document useless.
          operationCount > 0 && node.selectionSet.selections.every((selection) => selection.kind === Kind.FIELD && selection.name.value === "__typename")
        ) {
          getInUseByFragmentName(node.name.value).removed = true;
          firstVisitMadeChanges = true;
          return null;
        }
      }
    },
    Directive: {
      leave(node) {
        if (directiveMatcher(node)) {
          firstVisitMadeChanges = true;
          return null;
        }
      }
    }
  });
  if (!firstVisitMadeChanges) {
    return doc;
  }
  const populateTransitiveVars = (inUse) => {
    if (!inUse.transitiveVars) {
      inUse.transitiveVars = new Set(inUse.variables);
      if (!inUse.removed) {
        inUse.fragmentSpreads.forEach((childFragmentName) => {
          populateTransitiveVars(getInUseByFragmentName(childFragmentName)).transitiveVars.forEach((varName) => {
            inUse.transitiveVars.add(varName);
          });
        });
      }
    }
    return inUse;
  };
  const allFragmentNamesUsed = /* @__PURE__ */ new Set();
  docWithoutDirectiveSubtrees.definitions.forEach((def) => {
    if (def.kind === Kind.OPERATION_DEFINITION) {
      populateTransitiveVars(getInUseByOperationName(def.name && def.name.value)).fragmentSpreads.forEach((childFragmentName) => {
        allFragmentNamesUsed.add(childFragmentName);
      });
    } else if (def.kind === Kind.FRAGMENT_DEFINITION && // If there are no operations in the document, then all fragment
    // definitions count as usages of their own fragment names. This heuristic
    // prevents accidentally removing all fragment definitions from the
    // document just because it contains no operations that use the fragments.
    operationCount === 0 && !getInUseByFragmentName(def.name.value).removed) {
      allFragmentNamesUsed.add(def.name.value);
    }
  });
  allFragmentNamesUsed.forEach((fragmentName) => {
    populateTransitiveVars(getInUseByFragmentName(fragmentName)).fragmentSpreads.forEach((childFragmentName) => {
      allFragmentNamesUsed.add(childFragmentName);
    });
  });
  const fragmentWillBeRemoved = (fragmentName) => !!// A fragment definition will be removed if there are no spreads that refer
  // to it, or the fragment was explicitly removed because it had no fields
  // other than __typename.
  (!allFragmentNamesUsed.has(fragmentName) || getInUseByFragmentName(fragmentName).removed);
  const enterVisitor = {
    enter(node) {
      if (fragmentWillBeRemoved(node.name.value)) {
        return null;
      }
    }
  };
  return nullIfDocIsEmpty(visit(docWithoutDirectiveSubtrees, {
    // If the fragment is going to be removed, then leaving any dangling
    // FragmentSpread nodes with the same name would be a mistake.
    FragmentSpread: enterVisitor,
    // This is where the fragment definition is actually removed.
    FragmentDefinition: enterVisitor,
    OperationDefinition: {
      leave(node) {
        if (node.variableDefinitions) {
          const usedVariableNames = populateTransitiveVars(
            // If an operation is anonymous, we use the empty string as its key.
            getInUseByOperationName(node.name && node.name.value)
          ).transitiveVars;
          if (usedVariableNames.size < node.variableDefinitions.length) {
            return {
              ...node,
              variableDefinitions: node.variableDefinitions.filter((varDef) => usedVariableNames.has(varDef.variable.name.value))
            };
          }
        }
      }
    }
  }));
}
function makeInUseGetterFunction(defaultKey) {
  const map2 = /* @__PURE__ */ new Map();
  return function inUseGetterFunction(key = defaultKey) {
    let inUse = map2.get(key);
    if (!inUse) {
      map2.set(key, inUse = {
        // Variable and fragment spread names used directly within this
        // operation or fragment definition, as identified by key. These sets
        // will be populated during the first traversal of the document in
        // removeDirectivesFromDocument below.
        variables: /* @__PURE__ */ new Set(),
        fragmentSpreads: /* @__PURE__ */ new Set()
      });
    }
    return inUse;
  };
}
function getDirectiveMatcher(configs) {
  const names = /* @__PURE__ */ new Map();
  const tests = /* @__PURE__ */ new Map();
  configs.forEach((directive) => {
    if (directive) {
      if (directive.name) {
        names.set(directive.name, directive);
      } else if (directive.test) {
        tests.set(directive.test, directive);
      }
    }
  });
  return (directive) => {
    let config2 = names.get(directive.name.value);
    if (!config2 && tests.size) {
      tests.forEach((testConfig, test) => {
        if (test(directive)) {
          config2 = testConfig;
        }
      });
    }
    return config2;
  };
}
function isEmpty2(op, fragmentMap) {
  return !op || op.selectionSet.selections.every((selection) => selection.kind === Kind.FRAGMENT_SPREAD && isEmpty2(fragmentMap[selection.name.value], fragmentMap));
}
function nullIfDocIsEmpty(doc) {
  return isEmpty2(getOperationDefinition(doc) || getFragmentDefinition(doc), createFragmentMap(getFragmentDefinitions(doc))) ? null : doc;
}

// node_modules/@apollo/client/utilities/internal/removeFragmentSpreads.js
function removeMaskedFragmentSpreads(document) {
  return visit(document, {
    FragmentSpread(node) {
      if (!node.directives?.some(({ name }) => name.value === "unmask")) {
        return null;
      }
    }
  });
}

// node_modules/@apollo/client/utilities/internal/resultKeyNameFromField.js
function resultKeyNameFromField(field) {
  return field.alias ? field.alias.value : field.name.value;
}

// node_modules/@apollo/client/utilities/internal/shouldInclude.js
function shouldInclude({ directives }, variables) {
  if (!directives || !directives.length) {
    return true;
  }
  return getInclusionDirectives(directives).every(({ directive, ifArgument }) => {
    let evaledValue = false;
    if (ifArgument.value.kind === "Variable") {
      evaledValue = variables && variables[ifArgument.value.name.value];
      invariant3(evaledValue !== void 0, 15, directive.name.value);
    } else {
      evaledValue = ifArgument.value.value;
    }
    return directive.name.value === "skip" ? !evaledValue : evaledValue;
  });
}
function isInclusionDirective({ name: { value } }) {
  return value === "skip" || value === "include";
}
function getInclusionDirectives(directives) {
  const result = [];
  if (directives && directives.length) {
    directives.forEach((directive) => {
      if (!isInclusionDirective(directive))
        return;
      const directiveArguments = directive.arguments;
      const directiveName = directive.name.value;
      invariant3(directiveArguments && directiveArguments.length === 1, 16, directiveName);
      const ifArgument = directiveArguments[0];
      invariant3(ifArgument.name && ifArgument.name.value === "if", 17, directiveName);
      const ifValue = ifArgument.value;
      invariant3(ifValue && (ifValue.kind === "Variable" || ifValue.kind === "BooleanValue"), 18, directiveName);
      result.push({ directive, ifArgument });
    });
  }
  return result;
}

// node_modules/@apollo/client/utilities/internal/storeKeyNameFromField.js
function storeKeyNameFromField(field, variables) {
  let directivesObj = null;
  if (field.directives) {
    directivesObj = {};
    field.directives.forEach((directive) => {
      directivesObj[directive.name.value] = {};
      if (directive.arguments) {
        directive.arguments.forEach(({ name, value }) => valueToObjectRepresentation(directivesObj[directive.name.value], name, value, variables));
      }
    });
  }
  let argObj = null;
  if (field.arguments && field.arguments.length) {
    argObj = {};
    field.arguments.forEach(({ name, value }) => valueToObjectRepresentation(argObj, name, value, variables));
  }
  return getStoreKeyName(field.name.value, argObj, directivesObj);
}

// node_modules/@apollo/client/utilities/internal/toQueryResult.js
function toQueryResult(value) {
  const result = {
    data: value.data
  };
  if (value.error) {
    result.error = value.error;
  }
  return result;
}

// node_modules/@apollo/client/utilities/internal/filterMap.js
function filterMap(fn, makeContext = () => void 0) {
  return (source) => new Observable((subscriber) => {
    let context2 = makeContext();
    return source.subscribe({
      next(value) {
        let result;
        try {
          result = fn(value, context2);
        } catch (e) {
          subscriber.error(e);
        }
        if (result === void 0) {
          return;
        }
        subscriber.next(result);
      },
      error(err) {
        subscriber.error(err);
      },
      complete() {
        subscriber.complete();
      }
    });
  });
}

// node_modules/@wry/equality/lib/index.js
var { toString: toString2, hasOwnProperty: hasOwnProperty5 } = Object.prototype;
var fnToStr = Function.prototype.toString;
var previousComparisons = /* @__PURE__ */ new Map();
function equal(a, b) {
  try {
    return check(a, b);
  } finally {
    previousComparisons.clear();
  }
}
function check(a, b) {
  if (a === b) {
    return true;
  }
  const aTag = toString2.call(a);
  const bTag = toString2.call(b);
  if (aTag !== bTag) {
    return false;
  }
  switch (aTag) {
    case "[object Array]":
      if (a.length !== b.length)
        return false;
    // Fall through to object case...
    case "[object Object]": {
      if (previouslyCompared(a, b))
        return true;
      const aKeys = definedKeys(a);
      const bKeys = definedKeys(b);
      const keyCount = aKeys.length;
      if (keyCount !== bKeys.length)
        return false;
      for (let k = 0; k < keyCount; ++k) {
        if (!hasOwnProperty5.call(b, aKeys[k])) {
          return false;
        }
      }
      for (let k = 0; k < keyCount; ++k) {
        const key = aKeys[k];
        if (!check(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    case "[object Error]":
      return a.name === b.name && a.message === b.message;
    case "[object Number]":
      if (a !== a)
        return b !== b;
    // Fall through to shared +a === +b case...
    case "[object Boolean]":
    case "[object Date]":
      return +a === +b;
    case "[object RegExp]":
    case "[object String]":
      return a == `${b}`;
    case "[object Map]":
    case "[object Set]": {
      if (a.size !== b.size)
        return false;
      if (previouslyCompared(a, b))
        return true;
      const aIterator = a.entries();
      const isMap = aTag === "[object Map]";
      while (true) {
        const info = aIterator.next();
        if (info.done)
          break;
        const [aKey, aValue] = info.value;
        if (!b.has(aKey)) {
          return false;
        }
        if (isMap && !check(aValue, b.get(aKey))) {
          return false;
        }
      }
      return true;
    }
    case "[object Uint16Array]":
    case "[object Uint8Array]":
    // Buffer, in Node.js.
    case "[object Uint32Array]":
    case "[object Int32Array]":
    case "[object Int8Array]":
    case "[object Int16Array]":
    case "[object ArrayBuffer]":
      a = new Uint8Array(a);
      b = new Uint8Array(b);
    // Fall through...
    case "[object DataView]": {
      let len = a.byteLength;
      if (len === b.byteLength) {
        while (len-- && a[len] === b[len]) {
        }
      }
      return len === -1;
    }
    case "[object AsyncFunction]":
    case "[object GeneratorFunction]":
    case "[object AsyncGeneratorFunction]":
    case "[object Function]": {
      const aCode = fnToStr.call(a);
      if (aCode !== fnToStr.call(b)) {
        return false;
      }
      return !endsWith(aCode, nativeCodeSuffix);
    }
  }
  return false;
}
function definedKeys(obj) {
  return Object.keys(obj).filter(isDefinedKey, obj);
}
function isDefinedKey(key) {
  return this[key] !== void 0;
}
var nativeCodeSuffix = "{ [native code] }";
function endsWith(full, suffix) {
  const fromIndex = full.length - suffix.length;
  return fromIndex >= 0 && full.indexOf(suffix, fromIndex) === fromIndex;
}
function previouslyCompared(a, b) {
  let bSet = previousComparisons.get(a);
  if (bSet) {
    if (bSet.has(b))
      return true;
  } else {
    previousComparisons.set(a, bSet = /* @__PURE__ */ new Set());
  }
  bSet.add(b);
  return false;
}

// node_modules/@apollo/client/utilities/internal/equalByQuery.js
function equalByQuery(query, { data: aData, ...aRest }, { data: bData, ...bRest }, variables) {
  return equal(aRest, bRest) && equalBySelectionSet(getMainDefinition(query).selectionSet, aData, bData, {
    fragmentMap: createFragmentMap(getFragmentDefinitions(query)),
    variables
  });
}
function equalBySelectionSet(selectionSet, aResult, bResult, context2) {
  if (aResult === bResult) {
    return true;
  }
  const seenSelections = /* @__PURE__ */ new Set();
  return selectionSet.selections.every((selection) => {
    if (seenSelections.has(selection))
      return true;
    seenSelections.add(selection);
    if (!shouldInclude(selection, context2.variables))
      return true;
    if (selectionHasNonreactiveDirective(selection))
      return true;
    if (isField(selection)) {
      const resultKey = resultKeyNameFromField(selection);
      const aResultChild = aResult && aResult[resultKey];
      const bResultChild = bResult && bResult[resultKey];
      const childSelectionSet = selection.selectionSet;
      if (!childSelectionSet) {
        return equal(aResultChild, bResultChild);
      }
      const aChildIsArray = Array.isArray(aResultChild);
      const bChildIsArray = Array.isArray(bResultChild);
      if (aChildIsArray !== bChildIsArray)
        return false;
      if (aChildIsArray && bChildIsArray) {
        const length = aResultChild.length;
        if (bResultChild.length !== length) {
          return false;
        }
        for (let i = 0; i < length; ++i) {
          if (!equalBySelectionSet(childSelectionSet, aResultChild[i], bResultChild[i], context2)) {
            return false;
          }
        }
        return true;
      }
      return equalBySelectionSet(childSelectionSet, aResultChild, bResultChild, context2);
    } else {
      const fragment = getFragmentFromSelection(selection, context2.fragmentMap);
      if (fragment) {
        if (selectionHasNonreactiveDirective(fragment))
          return true;
        return equalBySelectionSet(
          fragment.selectionSet,
          // Notice that we reuse the same aResult and bResult values here,
          // since the fragment ...spread does not specify a field name, but
          // consists of multiple fields (within the fragment's selection set)
          // that should be applied to the current result value(s).
          aResult,
          bResult,
          context2
        );
      }
    }
  });
}
function selectionHasNonreactiveDirective(selection) {
  return !!selection.directives && selection.directives.some(directiveIsNonreactive);
}
function directiveIsNonreactive(dir) {
  return dir.name.value === "nonreactive";
}

// node_modules/@apollo/client/incremental/handlers/notImplemented.js
var NotImplementedHandler = class {
  isIncrementalResult(_) {
    return false;
  }
  prepareRequest(request) {
    invariant3(!hasDirectives(["defer"], request.query), 64);
    return request;
  }
  extractErrors() {
  }
  // This code path can never be reached, so we won't implement it.
  startRequest = void 0;
};

// node_modules/@apollo/client/link/utils/createOperation.js
function createOperation(request, { client }) {
  const operation = {
    query: request.query,
    variables: request.variables || {},
    extensions: request.extensions || {},
    operationName: getOperationName(request.query),
    operationType: getOperationDefinition(request.query).operation
  };
  let context2 = { ...request.context };
  const setContext = (next) => {
    if (typeof next === "function") {
      context2 = { ...context2, ...next(getContext()) };
    } else {
      context2 = { ...context2, ...next };
    }
  };
  const getContext = () => Object.freeze({ ...context2 });
  Object.defineProperty(operation, "setContext", {
    enumerable: false,
    value: setContext
  });
  Object.defineProperty(operation, "getContext", {
    enumerable: false,
    value: getContext
  });
  Object.defineProperty(operation, "client", {
    enumerable: false,
    value: client
  });
  return operation;
}

// node_modules/@apollo/client/link/utils/filterOperationVariables.js
function filterOperationVariables(variables, query) {
  const result = { ...variables };
  const unusedNames = new Set(Object.keys(variables));
  visit(query, {
    Variable(node, _key, parent) {
      if (parent && parent.kind !== "VariableDefinition") {
        unusedNames.delete(node.name.value);
      }
    }
  });
  unusedNames.forEach((name) => {
    delete result[name];
  });
  return result;
}

// node_modules/@apollo/client/link/core/ApolloLink.js
var ApolloLink = class _ApolloLink {
  /**
   * Creates a link that completes immediately and does not emit a result.
   *
   * @example
   *
   * ```ts
   * const link = ApolloLink.empty();
   * ```
   */
  static empty() {
    return new _ApolloLink(() => EMPTY);
  }
  /**
   * Composes multiple links into a single composed link that executes each
   * provided link in serial order.
   *
   * @example
   *
   * ```ts
   * import { from, HttpLink, ApolloLink } from "@apollo/client";
   * import { RetryLink } from "@apollo/client/link/retry";
   * import MyAuthLink from "../auth";
   *
   * const link = ApolloLink.from([
   *   new RetryLink(),
   *   new MyAuthLink(),
   *   new HttpLink({ uri: "http://localhost:4000/graphql" }),
   * ]);
   * ```
   *
   * @param links - An array of `ApolloLink` instances or request handlers that
   * are executed in serial order.
   */
  static from(links) {
    if (links.length === 0)
      return _ApolloLink.empty();
    const [first2, ...rest] = links;
    return first2.concat(...rest);
  }
  /**
   * Creates a link that conditionally routes a request to different links.
   *
   * @example
   *
   * ```ts
   * import { ApolloLink, HttpLink } from "@apollo/client";
   *
   * const link = ApolloLink.split(
   *   (operation) => operation.getContext().version === 1,
   *   new HttpLink({ uri: "http://localhost:4000/v1/graphql" }),
   *   new HttpLink({ uri: "http://localhost:4000/v2/graphql" })
   * );
   * ```
   *
   * @param test - A predicate function that receives the current `operation`
   * and returns a boolean indicating which link to execute. Returning `true`
   * executes the `left` link. Returning `false` executes the `right` link.
   *
   * @param left - The link that executes when the `test` function returns
   * `true`.
   *
   * @param right - The link that executes when the `test` function returns
   * `false`. If the `right` link is not provided, the request is forwarded to
   * the next link in the chain.
   */
  static split(test, left, right = new _ApolloLink((op, forward) => forward(op))) {
    const link = new _ApolloLink((operation, forward) => {
      const result = test(operation);
      if (__DEV__) {
        if (typeof result !== "boolean") {
          __DEV__ && invariant3.warn(61, result);
        }
      }
      return result ? left.request(operation, forward) : right.request(operation, forward);
    });
    return Object.assign(link, { left, right });
  }
  /**
   * Executes a GraphQL request against a link. The `execute` function begins
   * the request by calling the request handler of the link.
   *
   * @example
   *
   * ```ts
   * const observable = ApolloLink.execute(link, { query, variables }, { client });
   *
   * observable.subscribe({
   *   next(value) {
   *     console.log("Received", value);
   *   },
   *   error(error) {
   *     console.error("Oops got error", error);
   *   },
   *   complete() {
   *     console.log("Request complete");
   *   },
   * });
   * ```
   *
   * @param link - The `ApolloLink` instance to execute the request.
   *
   * @param request - The GraphQL request details, such as the `query` and
   * `variables`.
   *
   * @param context - The execution context for the request, such as the
   * `client` making the request.
   */
  static execute(link, request, context2) {
    return link.request(createOperation(request, context2), () => {
      if (__DEV__) {
        __DEV__ && invariant3.warn(62);
      }
      return EMPTY;
    });
  }
  /**
   * Combines multiple links into a single composed link.
   *
   * @example
   *
   * ```ts
   * const link = ApolloLink.concat(firstLink, secondLink, thirdLink);
   * ```
   *
   * @param links - The links to concatenate into a single link. Each link will
   * execute in serial order.
   *
   * @deprecated Use `ApolloLink.from` instead. `ApolloLink.concat` will be
   * removed in a future major version.
   */
  static concat(...links) {
    return _ApolloLink.from(links);
  }
  constructor(request) {
    if (request)
      this.request = request;
  }
  /**
   * Concatenates a link that conditionally routes a request to different links.
   *
   * @example
   *
   * ```ts
   * import { ApolloLink, HttpLink } from "@apollo/client";
   *
   * const previousLink = new ApolloLink((operation, forward) => {
   *   // Handle the request
   *
   *   return forward(operation);
   * });
   *
   * const link = previousLink.split(
   *   (operation) => operation.getContext().version === 1,
   *   new HttpLink({ uri: "http://localhost:4000/v1/graphql" }),
   *   new HttpLink({ uri: "http://localhost:4000/v2/graphql" })
   * );
   * ```
   *
   * @param test - A predicate function that receives the current `operation`
   * and returns a boolean indicating which link to execute. Returning `true`
   * executes the `left` link. Returning `false` executes the `right` link.
   *
   * @param left - The link that executes when the `test` function returns
   * `true`.
   *
   * @param right - The link that executes when the `test` function returns
   * `false`. If the `right` link is not provided, the request is forwarded to
   * the next link in the chain.
   */
  split(test, left, right) {
    return this.concat(_ApolloLink.split(test, left, right));
  }
  /**
   * Combines the link with other links into a single composed link.
   *
   * @example
   *
   * ```ts
   * import { ApolloLink, HttpLink } from "@apollo/client";
   *
   * const previousLink = new ApolloLink((operation, forward) => {
   *   // Handle the request
   *
   *   return forward(operation);
   * });
   *
   * const link = previousLink.concat(
   *   link1,
   *   link2,
   *   new HttpLink({ uri: "http://localhost:4000/graphql" })
   * );
   * ```
   */
  concat(...links) {
    if (links.length === 0) {
      return this;
    }
    return links.reduce(this.combine.bind(this), this);
  }
  combine(left, right) {
    const link = new _ApolloLink((operation, forward) => {
      return left.request(operation, (op) => right.request(op, forward));
    });
    return Object.assign(link, { left, right });
  }
  /**
   * Runs the request handler for the provided operation.
   *
   * > [!NOTE]
   * > This is called by the `ApolloLink.execute` function for you and should
   * > not be called directly. Prefer using `ApolloLink.execute` to make the
   * > request instead.
   */
  request(operation, forward) {
    throw newInvariantError(63);
  }
  /**
  * @internal
  * Used to iterate through all links that are concatenations or `split` links.
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  left;
  /**
  * @internal
  * Used to iterate through all links that are concatenations or `split` links.
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  right;
};

// node_modules/@apollo/client/link/core/empty.js
var empty2 = ApolloLink.empty;

// node_modules/@apollo/client/link/core/from.js
var from2 = ApolloLink.from;

// node_modules/@apollo/client/link/core/split.js
var split = ApolloLink.split;

// node_modules/@apollo/client/link/core/concat.js
var concat3 = ApolloLink.concat;

// node_modules/@apollo/client/link/core/execute.js
var execute2 = ApolloLink.execute;

// node_modules/@apollo/client/utilities/graphql/DocumentTransform.js
function identity2(document) {
  return document;
}
var DocumentTransform = class _DocumentTransform {
  transform;
  cached;
  resultCache = /* @__PURE__ */ new WeakSet();
  // This default implementation of getCacheKey can be overridden by providing
  // options.getCacheKey to the DocumentTransform constructor. In general, a
  // getCacheKey function may either return an array of keys (often including
  // the document) to be used as a cache key, or undefined to indicate the
  // transform for this document should not be cached.
  getCacheKey(document) {
    return [document];
  }
  /**
   * Creates a DocumentTransform that returns the input document unchanged.
   *
   * @returns The input document
   */
  static identity() {
    return new _DocumentTransform(identity2, { cache: false });
  }
  /**
   * Creates a DocumentTransform that conditionally applies one of two transforms.
   *
   * @param predicate - Function that determines which transform to apply
   * @param left - Transform to apply when `predicate` returns `true`
   * @param right - Transform to apply when `predicate` returns `false`. If not provided, it defaults to `DocumentTransform.identity()`.
   * @returns A DocumentTransform that conditionally applies a document transform based on the predicate
   *
   * @example
   *
   * ```ts
   * import { isQueryOperation } from "@apollo/client/utilities";
   *
   * const conditionalTransform = DocumentTransform.split(
   *   (document) => isQueryOperation(document),
   *   queryTransform,
   *   mutationTransform
   * );
   * ```
   */
  static split(predicate, left, right = _DocumentTransform.identity()) {
    return Object.assign(new _DocumentTransform(
      (document) => {
        const documentTransform = predicate(document) ? left : right;
        return documentTransform.transformDocument(document);
      },
      // Reasonably assume both `left` and `right` transforms handle their own caching
      { cache: false }
    ), { left, right });
  }
  constructor(transform, options = {}) {
    this.transform = transform;
    if (options.getCacheKey) {
      this.getCacheKey = options.getCacheKey;
    }
    this.cached = options.cache !== false;
    this.resetCache();
  }
  /**
   * Resets the internal cache of this transform, if it is cached.
   */
  resetCache() {
    if (this.cached) {
      const stableCacheKeys = new Trie();
      this.performWork = wrap2(_DocumentTransform.prototype.performWork.bind(this), {
        makeCacheKey: (document) => {
          const cacheKeys = this.getCacheKey(document);
          if (cacheKeys) {
            invariant3(Array.isArray(cacheKeys), 20);
            return stableCacheKeys.lookupArray(cacheKeys);
          }
        },
        max: cacheSizes["documentTransform.cache"],
        cache: WeakCache
      });
    }
  }
  performWork(document) {
    checkDocument(document);
    return this.transform(document);
  }
  /**
   * Transforms a GraphQL document using the configured transform function.
   *
   * @remarks
   *
   * Note that `transformDocument` caches the transformed document. Calling
   * `transformDocument` again with the already-transformed document will
   * immediately return it.
   *
   * @param document - The GraphQL document to transform
   * @returns The transformed document
   *
   * @example
   *
   * ```ts
   * const document = gql`
   *   # ...
   * `;
   *
   * const documentTransform = new DocumentTransform(transformFn);
   * const transformedDocument = documentTransform.transformDocument(document);
   * ```
   */
  transformDocument(document) {
    if (this.resultCache.has(document)) {
      return document;
    }
    const transformedDocument = this.performWork(document);
    this.resultCache.add(transformedDocument);
    return transformedDocument;
  }
  /**
   * Combines this document transform with another document transform. The
   * returned document transform first applies the current document transform,
   * then applies the other document transform.
   *
   * @param otherTransform - The transform to apply after this one
   * @returns A new DocumentTransform that applies both transforms in sequence
   *
   * @example
   *
   * ```ts
   * const combinedTransform = addTypenameTransform.concat(
   *   removeDirectivesTransform
   * );
   * ```
   */
  concat(otherTransform) {
    return Object.assign(new _DocumentTransform(
      (document) => {
        return otherTransform.transformDocument(this.transformDocument(document));
      },
      // Reasonably assume both transforms handle their own caching
      { cache: false }
    ), {
      left: this,
      right: otherTransform
    });
  }
  /**
  * @internal
  * Used to iterate through all transforms that are concatenations or `split` links.
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  left;
  /**
  * @internal
  * Used to iterate through all transforms that are concatenations or `split` links.
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  right;
};

// node_modules/@apollo/client/utilities/graphql/print.js
var printCache;
var print2 = Object.assign((ast) => {
  let result = printCache.get(ast);
  if (!result) {
    result = print(ast);
    printCache.set(ast, result);
  }
  return result;
}, {
  reset() {
    printCache = new AutoCleanedWeakCache(
      cacheSizes.print || 2e3
      /* defaultCacheSizes.print */
    );
  }
});
print2.reset();
if (__DEV__) {
  registerGlobalCache("print", () => printCache ? printCache.size : 0);
}

// node_modules/@apollo/client/utilities/graphql/storeUtils.js
function isReference(obj) {
  return Boolean(obj && typeof obj === "object" && typeof obj.__ref === "string");
}

// node_modules/@apollo/client/utilities/graphql/transform.js
var TYPENAME_FIELD = {
  kind: Kind.FIELD,
  name: {
    kind: Kind.NAME,
    value: "__typename"
  }
};
var addTypenameToDocument = Object.assign(function(doc) {
  return visit(doc, {
    SelectionSet: {
      enter(node, _key, parent) {
        if (parent && parent.kind === Kind.OPERATION_DEFINITION) {
          return;
        }
        const { selections } = node;
        if (!selections) {
          return;
        }
        const skip2 = selections.some((selection) => {
          return selection.kind === Kind.FIELD && (selection.name.value === "__typename" || selection.name.value.lastIndexOf("__", 0) === 0);
        });
        if (skip2) {
          return;
        }
        const field = parent;
        if (field.kind === Kind.FIELD && field.directives && field.directives.some((d) => d.name.value === "export")) {
          return;
        }
        return {
          ...node,
          selections: [...selections, TYPENAME_FIELD]
        };
      }
    }
  });
}, {
  added(field) {
    return field === TYPENAME_FIELD;
  }
});

// node_modules/@apollo/client/utilities/graphql/operations.js
function isOperation(document, operation) {
  return getOperationDefinition(document)?.operation === operation;
}
function isMutationOperation(document) {
  return isOperation(document, "mutation");
}
function isSubscriptionOperation(document) {
  return isOperation(document, "subscription");
}

// node_modules/@apollo/client/utilities/isNetworkRequestSettled.js
function isNetworkRequestSettled(networkStatus) {
  return networkStatus === 7 || networkStatus === 8;
}

// node_modules/@apollo/client/utilities/isNetworkRequestInFlight.js
function isNetworkRequestInFlight(networkStatus) {
  return !isNetworkRequestSettled(networkStatus);
}

// node_modules/@apollo/client/cache/core/cache.js
var ApolloCache = class {
  assumeImmutableResults = false;
  // Function used to lookup a fragment when a fragment definition is not part
  // of the GraphQL document. This is useful for caches, such as InMemoryCache,
  // that register fragments ahead of time so they can be referenced by name.
  lookupFragment(fragmentName) {
    return null;
  }
  // Transactional API
  // The batch method is intended to replace/subsume both performTransaction
  // and recordOptimisticTransaction, but performTransaction came first, so we
  // provide a default batch implementation that's just another way of calling
  // performTransaction. Subclasses of ApolloCache (such as InMemoryCache) can
  // override the batch method to do more interesting things with its options.
  batch(options) {
    const optimisticId = typeof options.optimistic === "string" ? options.optimistic : options.optimistic === false ? null : void 0;
    let updateResult;
    this.performTransaction(() => updateResult = options.update(this), optimisticId);
    return updateResult;
  }
  recordOptimisticTransaction(transaction, optimisticId) {
    this.performTransaction(transaction, optimisticId);
  }
  // Optional API
  // Called once per input document, allowing the cache to make static changes
  // to the query, such as adding __typename fields.
  transformDocument(document) {
    return document;
  }
  // Called before each ApolloLink request, allowing the cache to make dynamic
  // changes to the query, such as filling in missing fragment definitions.
  transformForLink(document) {
    return document;
  }
  identify(object) {
    return;
  }
  gc() {
    return [];
  }
  modify(options) {
    return false;
  }
  readQuery(options, optimistic = !!options.optimistic) {
    return this.read({
      ...options,
      rootId: options.id || "ROOT_QUERY",
      optimistic
    });
  }
  /**
  * Watches the cache store of the fragment according to the options specified
  * and returns an `Observable`. We can subscribe to this
  * `Observable` and receive updated results through an
  * observer when the cache store changes.
  * 
  * You must pass in a GraphQL document with a single fragment or a document
  * with multiple fragments that represent what you are reading. If you pass
  * in a document with multiple fragments then you must also specify a
  * `fragmentName`.
  * 
  * @since 3.10.0
  * @param options - An object of type `WatchFragmentOptions` that allows
  * the cache to identify the fragment and optionally specify whether to react
  * to optimistic updates.
  */
  watchFragment(options) {
    const { fragment, fragmentName, from: from3, optimistic = true, ...otherOptions } = options;
    const query = this.getFragmentDoc(fragment, fragmentName);
    const id = typeof from3 === "undefined" || typeof from3 === "string" ? from3 : this.identify(from3);
    if (__DEV__) {
      const actualFragmentName = fragmentName || getFragmentDefinition(fragment).name.value;
      if (!id) {
        __DEV__ && invariant3.warn(109, actualFragmentName);
      }
    }
    const diffOptions = {
      ...otherOptions,
      returnPartialData: true,
      id,
      query,
      optimistic
    };
    let latestDiff;
    return new Observable((observer) => {
      return this.watch({
        ...diffOptions,
        immediate: true,
        callback: (diff) => {
          let data = diff.result;
          if (data === null) {
            data = {};
          }
          if (
            // Always ensure we deliver the first result
            latestDiff && equalByQuery(query, { data: latestDiff.result }, { data }, options.variables)
          ) {
            return;
          }
          const result = {
            data,
            dataState: diff.complete ? "complete" : "partial",
            complete: !!diff.complete
          };
          if (diff.missing) {
            result.missing = diff.missing.missing;
          }
          latestDiff = { ...diff, result: data };
          observer.next(result);
        }
      });
    });
  }
  // Make sure we compute the same (===) fragment query document every
  // time we receive the same fragment in readFragment.
  getFragmentDoc = wrap2(getFragmentQueryDocument, {
    max: cacheSizes["cache.fragmentQueryDocuments"] || 1e3,
    cache: WeakCache
  });
  readFragment(options, optimistic = !!options.optimistic) {
    return this.read({
      ...options,
      query: this.getFragmentDoc(options.fragment, options.fragmentName),
      rootId: options.id,
      optimistic
    });
  }
  writeQuery({ id, data, ...options }) {
    return this.write(Object.assign(options, {
      dataId: id || "ROOT_QUERY",
      result: data
    }));
  }
  writeFragment({ id, data, fragment, fragmentName, ...options }) {
    return this.write(Object.assign(options, {
      query: this.getFragmentDoc(fragment, fragmentName),
      dataId: id,
      result: data
    }));
  }
  updateQuery(options, update) {
    return this.batch({
      update(cache) {
        const value = cache.readQuery(options);
        const data = update(value);
        if (data === void 0 || data === null)
          return value;
        cache.writeQuery({ ...options, data });
        return data;
      }
    });
  }
  updateFragment(options, update) {
    return this.batch({
      update(cache) {
        const value = cache.readFragment(options);
        const data = update(value);
        if (data === void 0 || data === null)
          return value;
        cache.writeFragment({ ...options, data });
        return data;
      }
    });
  }
};
if (__DEV__) {
  ApolloCache.prototype.getMemoryInternals = getApolloCacheMemoryInternals;
}

// node_modules/@apollo/client/cache/core/types/common.js
var MissingFieldError = class _MissingFieldError extends Error {
  message;
  path;
  query;
  variables;
  constructor(message, path, query, variables) {
    super(message);
    this.message = message;
    this.path = path;
    this.query = query;
    this.variables = variables;
    this.name = "MissingFieldError";
    if (Array.isArray(this.path)) {
      this.missing = this.message;
      for (let i = this.path.length - 1; i >= 0; --i) {
        this.missing = { [this.path[i]]: this.missing };
      }
    } else {
      this.missing = this.path;
    }
    this.__proto__ = _MissingFieldError.prototype;
  }
  missing;
};

// node_modules/@apollo/client/cache/inmemory/helpers.js
var { hasOwnProperty: hasOwn } = Object.prototype;
function defaultDataIdFromObject({ __typename, id, _id }, context2) {
  if (typeof __typename === "string") {
    if (context2) {
      context2.keyObject = id != null ? { id } : _id != null ? { _id } : void 0;
    }
    if (id == null && _id != null) {
      id = _id;
    }
    if (id != null) {
      return `${__typename}:${typeof id === "number" || typeof id === "string" ? id : JSON.stringify(id)}`;
    }
  }
}
var defaultConfig = {
  dataIdFromObject: defaultDataIdFromObject,
  resultCaching: true
};
function normalizeConfig(config2) {
  return compact(defaultConfig, config2);
}
function getTypenameFromStoreObject(store, objectOrReference) {
  return isReference(objectOrReference) ? store.get(objectOrReference.__ref, "__typename") : objectOrReference && objectOrReference.__typename;
}
var TypeOrFieldNameRegExp = /^[_a-z][_0-9a-z]*/i;
function fieldNameFromStoreName(storeFieldName) {
  const match = storeFieldName.match(TypeOrFieldNameRegExp);
  return match ? match[0] : storeFieldName;
}
function selectionSetMatchesResult(selectionSet, result, variables) {
  if (isNonNullObject(result)) {
    return isArray4(result) ? result.every((item) => selectionSetMatchesResult(selectionSet, item, variables)) : selectionSet.selections.every((field) => {
      if (isField(field) && shouldInclude(field, variables)) {
        const key = resultKeyNameFromField(field);
        return hasOwn.call(result, key) && (!field.selectionSet || selectionSetMatchesResult(field.selectionSet, result[key], variables));
      }
      return true;
    });
  }
  return false;
}
function storeValueIsStoreObject(value) {
  return isNonNullObject(value) && !isReference(value) && !isArray4(value);
}
function makeProcessedFieldsMerger() {
  return new DeepMerger();
}
function extractFragmentContext(document, fragments) {
  const fragmentMap = createFragmentMap(getFragmentDefinitions(document));
  return {
    fragmentMap,
    lookupFragment(name) {
      let def = fragmentMap[name];
      if (!def && fragments) {
        def = fragments.lookup(name);
      }
      return def || null;
    }
  };
}

// node_modules/@apollo/client/cache/inmemory/entityStore.js
var DELETE = {};
var delModifier = () => DELETE;
var INVALIDATE = {};
var EntityStore = class {
  policies;
  group;
  data = {};
  constructor(policies, group) {
    this.policies = policies;
    this.group = group;
  }
  // Although the EntityStore class is abstract, it contains concrete
  // implementations of the various NormalizedCache interface methods that
  // are inherited by the Root and Layer subclasses.
  toObject() {
    return { ...this.data };
  }
  has(dataId) {
    return this.lookup(dataId, true) !== void 0;
  }
  get(dataId, fieldName) {
    this.group.depend(dataId, fieldName);
    if (hasOwn.call(this.data, dataId)) {
      const storeObject = this.data[dataId];
      if (storeObject && hasOwn.call(storeObject, fieldName)) {
        return storeObject[fieldName];
      }
    }
    if (fieldName === "__typename" && hasOwn.call(this.policies.rootTypenamesById, dataId)) {
      return this.policies.rootTypenamesById[dataId];
    }
    if (this instanceof Layer) {
      return this.parent.get(dataId, fieldName);
    }
  }
  lookup(dataId, dependOnExistence) {
    if (dependOnExistence)
      this.group.depend(dataId, "__exists");
    if (hasOwn.call(this.data, dataId)) {
      return this.data[dataId];
    }
    if (this instanceof Layer) {
      return this.parent.lookup(dataId, dependOnExistence);
    }
    if (this.policies.rootTypenamesById[dataId]) {
      return {};
    }
  }
  merge(older, newer) {
    let dataId;
    if (isReference(older))
      older = older.__ref;
    if (isReference(newer))
      newer = newer.__ref;
    const existing = typeof older === "string" ? this.lookup(dataId = older) : older;
    const incoming = typeof newer === "string" ? this.lookup(dataId = newer) : newer;
    if (!incoming)
      return;
    invariant3(typeof dataId === "string", 95);
    const merged = new DeepMerger(storeObjectReconciler).merge(existing, incoming);
    this.data[dataId] = merged;
    if (merged !== existing) {
      delete this.refs[dataId];
      if (this.group.caching) {
        const fieldsToDirty = {};
        if (!existing)
          fieldsToDirty.__exists = 1;
        Object.keys(incoming).forEach((storeFieldName) => {
          if (!existing || existing[storeFieldName] !== merged[storeFieldName]) {
            fieldsToDirty[storeFieldName] = 1;
            const fieldName = fieldNameFromStoreName(storeFieldName);
            if (fieldName !== storeFieldName && !this.policies.hasKeyArgs(merged.__typename, fieldName)) {
              fieldsToDirty[fieldName] = 1;
            }
            if (merged[storeFieldName] === void 0 && !(this instanceof Layer)) {
              delete merged[storeFieldName];
            }
          }
        });
        if (fieldsToDirty.__typename && !(existing && existing.__typename) && // Since we return default root __typename strings
        // automatically from store.get, we don't need to dirty the
        // ROOT_QUERY.__typename field if merged.__typename is equal
        // to the default string (usually "Query").
        this.policies.rootTypenamesById[dataId] === merged.__typename) {
          delete fieldsToDirty.__typename;
        }
        Object.keys(fieldsToDirty).forEach((fieldName) => this.group.dirty(dataId, fieldName));
      }
    }
  }
  modify(dataId, fields, exact) {
    const storeObject = this.lookup(dataId);
    if (storeObject) {
      const changedFields = {};
      let needToMerge = false;
      let allDeleted = true;
      const sharedDetails = {
        DELETE,
        INVALIDATE,
        isReference,
        toReference: this.toReference,
        canRead: this.canRead,
        readField: (fieldNameOrOptions, from3) => this.policies.readField(typeof fieldNameOrOptions === "string" ? {
          fieldName: fieldNameOrOptions,
          from: from3 || makeReference(dataId)
        } : fieldNameOrOptions, { store: this })
      };
      Object.keys(storeObject).forEach((storeFieldName) => {
        const fieldName = fieldNameFromStoreName(storeFieldName);
        let fieldValue = storeObject[storeFieldName];
        if (fieldValue === void 0)
          return;
        const modify = typeof fields === "function" ? fields : fields[storeFieldName] || (exact ? void 0 : fields[fieldName]);
        if (modify) {
          let newValue = modify === delModifier ? DELETE : modify(maybeDeepFreeze(fieldValue), {
            ...sharedDetails,
            fieldName,
            storeFieldName,
            storage: this.getStorage(dataId, storeFieldName)
          });
          if (newValue === INVALIDATE) {
            this.group.dirty(dataId, storeFieldName);
          } else {
            if (newValue === DELETE)
              newValue = void 0;
            if (newValue !== fieldValue) {
              changedFields[storeFieldName] = newValue;
              needToMerge = true;
              fieldValue = newValue;
              if (__DEV__) {
                const checkReference = (ref) => {
                  if (this.lookup(ref.__ref) === void 0) {
                    __DEV__ && invariant3.warn(96, ref);
                    return true;
                  }
                };
                if (isReference(newValue)) {
                  checkReference(newValue);
                } else if (Array.isArray(newValue)) {
                  let seenReference = false;
                  let someNonReference;
                  for (const value of newValue) {
                    if (isReference(value)) {
                      seenReference = true;
                      if (checkReference(value))
                        break;
                    } else {
                      if (typeof value === "object" && !!value) {
                        const [id] = this.policies.identify(value);
                        if (id) {
                          someNonReference = value;
                        }
                      }
                    }
                    if (seenReference && someNonReference !== void 0) {
                      __DEV__ && invariant3.warn(97, someNonReference);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        if (fieldValue !== void 0) {
          allDeleted = false;
        }
      });
      if (needToMerge) {
        this.merge(dataId, changedFields);
        if (allDeleted) {
          if (this instanceof Layer) {
            this.data[dataId] = void 0;
          } else {
            delete this.data[dataId];
          }
          this.group.dirty(dataId, "__exists");
        }
        return true;
      }
    }
    return false;
  }
  // If called with only one argument, removes the entire entity
  // identified by dataId. If called with a fieldName as well, removes all
  // fields of that entity whose names match fieldName according to the
  // fieldNameFromStoreName helper function. If called with a fieldName
  // and variables, removes all fields of that entity whose names match fieldName
  // and whose arguments when cached exactly match the variables passed.
  delete(dataId, fieldName, args) {
    const storeObject = this.lookup(dataId);
    if (storeObject) {
      const typename = this.getFieldValue(storeObject, "__typename");
      const storeFieldName = fieldName && args ? this.policies.getStoreFieldName({ typename, fieldName, args }) : fieldName;
      return this.modify(dataId, storeFieldName ? {
        [storeFieldName]: delModifier
      } : delModifier, !!args);
    }
    return false;
  }
  evict(options, limit) {
    let evicted = false;
    if (options.id) {
      if (hasOwn.call(this.data, options.id)) {
        evicted = this.delete(options.id, options.fieldName, options.args);
      }
      if (this instanceof Layer && this !== limit) {
        evicted = this.parent.evict(options, limit) || evicted;
      }
      if (options.fieldName || evicted) {
        this.group.dirty(options.id, options.fieldName || "__exists");
      }
    }
    return evicted;
  }
  clear() {
    this.replace(null);
  }
  extract() {
    const obj = this.toObject();
    const extraRootIds = [];
    this.getRootIdSet().forEach((id) => {
      if (!hasOwn.call(this.policies.rootTypenamesById, id)) {
        extraRootIds.push(id);
      }
    });
    if (extraRootIds.length) {
      obj.__META = { extraRootIds: extraRootIds.sort() };
    }
    return obj;
  }
  replace(newData) {
    Object.keys(this.data).forEach((dataId) => {
      if (!(newData && hasOwn.call(newData, dataId))) {
        this.delete(dataId);
      }
    });
    if (newData) {
      const { __META, ...rest } = newData;
      Object.keys(rest).forEach((dataId) => {
        this.merge(dataId, rest[dataId]);
      });
      if (__META) {
        __META.extraRootIds.forEach(this.retain, this);
      }
    }
  }
  // Maps root entity IDs to the number of times they have been retained, minus
  // the number of times they have been released. Retained entities keep other
  // entities they reference (even indirectly) from being garbage collected.
  rootIds = {};
  retain(rootId) {
    return this.rootIds[rootId] = (this.rootIds[rootId] || 0) + 1;
  }
  release(rootId) {
    if (this.rootIds[rootId] > 0) {
      const count2 = --this.rootIds[rootId];
      if (!count2)
        delete this.rootIds[rootId];
      return count2;
    }
    return 0;
  }
  // Return a Set<string> of all the ID strings that have been retained by
  // this layer/root *and* any layers/roots beneath it.
  getRootIdSet(ids = /* @__PURE__ */ new Set()) {
    Object.keys(this.rootIds).forEach(ids.add, ids);
    if (this instanceof Layer) {
      this.parent.getRootIdSet(ids);
    } else {
      Object.keys(this.policies.rootTypenamesById).forEach(ids.add, ids);
    }
    return ids;
  }
  // The goal of garbage collection is to remove IDs from the Root layer of the
  // store that are no longer reachable starting from any IDs that have been
  // explicitly retained (see retain and release, above). Returns an array of
  // dataId strings that were removed from the store.
  gc() {
    const ids = this.getRootIdSet();
    const snapshot = this.toObject();
    ids.forEach((id) => {
      if (hasOwn.call(snapshot, id)) {
        Object.keys(this.findChildRefIds(id)).forEach(ids.add, ids);
        delete snapshot[id];
      }
    });
    const idsToRemove = Object.keys(snapshot);
    if (idsToRemove.length) {
      let root = this;
      while (root instanceof Layer)
        root = root.parent;
      idsToRemove.forEach((id) => root.delete(id));
    }
    return idsToRemove;
  }
  // Lazily tracks { __ref: <dataId> } strings contained by this.data[dataId].
  refs = {};
  findChildRefIds(dataId) {
    if (!hasOwn.call(this.refs, dataId)) {
      const found = this.refs[dataId] = {};
      const root = this.data[dataId];
      if (!root)
        return found;
      const workSet = /* @__PURE__ */ new Set([root]);
      workSet.forEach((obj) => {
        if (isReference(obj)) {
          found[obj.__ref] = true;
        }
        if (isNonNullObject(obj)) {
          Object.keys(obj).forEach((key) => {
            const child = obj[key];
            if (isNonNullObject(child)) {
              workSet.add(child);
            }
          });
        }
      });
    }
    return this.refs[dataId];
  }
  makeCacheKey() {
    return this.group.keyMaker.lookupArray(arguments);
  }
  // Bound function that can be passed around to provide easy access to fields
  // of Reference objects as well as ordinary objects.
  getFieldValue = (objectOrReference, storeFieldName) => maybeDeepFreeze(isReference(objectOrReference) ? this.get(objectOrReference.__ref, storeFieldName) : objectOrReference && objectOrReference[storeFieldName]);
  // Returns true for non-normalized StoreObjects and non-dangling
  // References, indicating that readField(name, objOrRef) has a chance of
  // working. Useful for filtering out dangling references from lists.
  canRead = (objOrRef) => {
    return isReference(objOrRef) ? this.has(objOrRef.__ref) : typeof objOrRef === "object";
  };
  // Bound function that converts an id or an object with a __typename and
  // primary key fields to a Reference object. If called with a Reference object,
  // that same Reference object is returned. Pass true for mergeIntoStore to persist
  // an object into the store.
  toReference = (objOrIdOrRef, mergeIntoStore) => {
    if (typeof objOrIdOrRef === "string") {
      return makeReference(objOrIdOrRef);
    }
    if (isReference(objOrIdOrRef)) {
      return objOrIdOrRef;
    }
    const [id] = this.policies.identify(objOrIdOrRef);
    if (id) {
      const ref = makeReference(id);
      if (mergeIntoStore) {
        this.merge(id, objOrIdOrRef);
      }
      return ref;
    }
  };
  get supportsResultCaching() {
    return this.group.caching;
  }
};
var CacheGroup = class {
  caching;
  parent;
  d = null;
  // Used by the EntityStore#makeCacheKey method to compute cache keys
  // specific to this CacheGroup.
  keyMaker;
  constructor(caching, parent = null) {
    this.caching = caching;
    this.parent = parent;
    this.resetCaching();
  }
  resetCaching() {
    this.d = this.caching ? dep() : null;
    this.keyMaker = new Trie();
  }
  depend(dataId, storeFieldName) {
    if (this.d) {
      this.d(makeDepKey(dataId, storeFieldName));
      const fieldName = fieldNameFromStoreName(storeFieldName);
      if (fieldName !== storeFieldName) {
        this.d(makeDepKey(dataId, fieldName));
      }
      if (this.parent) {
        this.parent.depend(dataId, storeFieldName);
      }
    }
  }
  dirty(dataId, storeFieldName) {
    if (this.d) {
      this.d.dirty(
        makeDepKey(dataId, storeFieldName),
        // When storeFieldName === "__exists", that means the entity identified
        // by dataId has either disappeared from the cache or was newly added,
        // so the result caching system would do well to "forget everything it
        // knows" about that object. To achieve that kind of invalidation, we
        // not only dirty the associated result cache entry, but also remove it
        // completely from the dependency graph. For the optimism implementation
        // details, see https://github.com/benjamn/optimism/pull/195.
        storeFieldName === "__exists" ? "forget" : "setDirty"
      );
    }
  }
};
function makeDepKey(dataId, storeFieldName) {
  return storeFieldName + "#" + dataId;
}
function maybeDependOnExistenceOfEntity(store, entityId) {
  if (supportsResultCaching(store)) {
    store.group.depend(entityId, "__exists");
  }
}
var Root = class extends EntityStore {
  constructor({ policies, resultCaching = true, seed }) {
    super(policies, new CacheGroup(resultCaching));
    if (seed)
      this.replace(seed);
  }
  stump = new Stump(this);
  addLayer(layerId, replay) {
    return this.stump.addLayer(layerId, replay);
  }
  removeLayer() {
    return this;
  }
  storageTrie = new Trie();
  getStorage() {
    return this.storageTrie.lookupArray(arguments);
  }
};
EntityStore.Root = Root;
var Layer = class _Layer extends EntityStore {
  id;
  parent;
  replay;
  group;
  constructor(id, parent, replay, group) {
    super(parent.policies, group);
    this.id = id;
    this.parent = parent;
    this.replay = replay;
    this.group = group;
    replay(this);
  }
  addLayer(layerId, replay) {
    return new _Layer(layerId, this, replay, this.group);
  }
  removeLayer(layerId) {
    const parent = this.parent.removeLayer(layerId);
    if (layerId === this.id) {
      if (this.group.caching) {
        Object.keys(this.data).forEach((dataId) => {
          const ownStoreObject = this.data[dataId];
          const parentStoreObject = parent["lookup"](dataId);
          if (!parentStoreObject) {
            this.delete(dataId);
          } else if (!ownStoreObject) {
            this.group.dirty(dataId, "__exists");
            Object.keys(parentStoreObject).forEach((storeFieldName) => {
              this.group.dirty(dataId, storeFieldName);
            });
          } else if (ownStoreObject !== parentStoreObject) {
            Object.keys(ownStoreObject).forEach((storeFieldName) => {
              if (!equal(ownStoreObject[storeFieldName], parentStoreObject[storeFieldName])) {
                this.group.dirty(dataId, storeFieldName);
              }
            });
          }
        });
      }
      return parent;
    }
    if (parent === this.parent)
      return this;
    return parent.addLayer(this.id, this.replay);
  }
  toObject() {
    return {
      ...this.parent.toObject(),
      ...this.data
    };
  }
  findChildRefIds(dataId) {
    const fromParent = this.parent.findChildRefIds(dataId);
    return hasOwn.call(this.data, dataId) ? {
      ...fromParent,
      ...super.findChildRefIds(dataId)
    } : fromParent;
  }
  getStorage(...args) {
    let p = this.parent;
    while (p.parent)
      p = p.parent;
    return p.getStorage(...args);
  }
};
var Stump = class extends Layer {
  constructor(root) {
    super("EntityStore.Stump", root, () => {
    }, new CacheGroup(root.group.caching, root.group));
  }
  removeLayer() {
    return this;
  }
  merge(older, newer) {
    return this.parent.merge(older, newer);
  }
};
function storeObjectReconciler(existingObject, incomingObject, property) {
  const existingValue = existingObject[property];
  const incomingValue = incomingObject[property];
  return equal(existingValue, incomingValue) ? existingValue : incomingValue;
}
function supportsResultCaching(store) {
  return !!(store && store.supportsResultCaching);
}

// node_modules/@apollo/client/masking/utils.js
var disableWarningsSlot = new Slot();
function getFragmentMaskMode(fragment) {
  const directive = fragment.directives?.find(({ name }) => name.value === "unmask");
  if (!directive) {
    return "mask";
  }
  const modeArg = directive.arguments?.find(({ name }) => name.value === "mode");
  if (__DEV__) {
    if (modeArg) {
      if (modeArg.value.kind === Kind.VARIABLE) {
        __DEV__ && invariant3.warn(44);
      } else if (modeArg.value.kind !== Kind.STRING) {
        __DEV__ && invariant3.warn(45);
      } else if (modeArg.value.value !== "migrate") {
        __DEV__ && invariant3.warn(46, modeArg.value.value);
      }
    }
  }
  if (modeArg && "value" in modeArg.value && modeArg.value.value === "migrate") {
    return "migrate";
  }
  return "unmask";
}

// node_modules/@apollo/client/masking/maskDefinition.js
function maskDefinition(data, selectionSet, context2) {
  return disableWarningsSlot.withValue(true, () => {
    const masked = maskSelectionSet(data, selectionSet, context2, false);
    if (Object.isFrozen(data)) {
      maybeDeepFreeze(masked);
    }
    return masked;
  });
}
function getMutableTarget(data, mutableTargets) {
  if (mutableTargets.has(data)) {
    return mutableTargets.get(data);
  }
  const mutableTarget = Array.isArray(data) ? [] : {};
  mutableTargets.set(data, mutableTarget);
  return mutableTarget;
}
function maskSelectionSet(data, selectionSet, context2, migration, path) {
  const { knownChanged } = context2;
  const memo = getMutableTarget(data, context2.mutableTargets);
  if (Array.isArray(data)) {
    for (const [index, item] of Array.from(data.entries())) {
      if (item === null) {
        memo[index] = null;
        continue;
      }
      const masked = maskSelectionSet(item, selectionSet, context2, migration, __DEV__ ? `${path || ""}[${index}]` : void 0);
      if (knownChanged.has(masked)) {
        knownChanged.add(memo);
      }
      memo[index] = masked;
    }
    return knownChanged.has(memo) ? memo : data;
  }
  for (const selection of selectionSet.selections) {
    let value;
    if (migration) {
      knownChanged.add(memo);
    }
    if (selection.kind === Kind.FIELD) {
      const keyName = resultKeyNameFromField(selection);
      const childSelectionSet = selection.selectionSet;
      value = memo[keyName] || data[keyName];
      if (value === void 0) {
        continue;
      }
      if (childSelectionSet && value !== null) {
        const masked = maskSelectionSet(data[keyName], childSelectionSet, context2, migration, __DEV__ ? `${path || ""}.${keyName}` : void 0);
        if (knownChanged.has(masked)) {
          value = masked;
        }
      }
      if (!__DEV__) {
        memo[keyName] = value;
      }
      if (__DEV__) {
        if (migration && keyName !== "__typename" && // either the field is not present in the memo object
        // or it has a `get` descriptor, not a `value` descriptor
        // => it is a warning accessor and we can overwrite it
        // with another accessor
        !Object.getOwnPropertyDescriptor(memo, keyName)?.value) {
          Object.defineProperty(memo, keyName, getAccessorWarningDescriptor(keyName, value, path || "", context2.operationName, context2.operationType));
        } else {
          delete memo[keyName];
          memo[keyName] = value;
        }
      }
    }
    if (selection.kind === Kind.INLINE_FRAGMENT && (!selection.typeCondition || context2.cache.fragmentMatches(selection, data.__typename))) {
      value = maskSelectionSet(data, selection.selectionSet, context2, migration, path);
    }
    if (selection.kind === Kind.FRAGMENT_SPREAD) {
      const fragmentName = selection.name.value;
      const fragment = context2.fragmentMap[fragmentName] || (context2.fragmentMap[fragmentName] = context2.cache.lookupFragment(fragmentName));
      invariant3(fragment, 39, fragmentName);
      const mode = getFragmentMaskMode(selection);
      if (mode !== "mask") {
        value = maskSelectionSet(data, fragment.selectionSet, context2, mode === "migrate", path);
      }
    }
    if (knownChanged.has(value)) {
      knownChanged.add(memo);
    }
  }
  if ("__typename" in data && !("__typename" in memo)) {
    memo.__typename = data.__typename;
  }
  if (Object.keys(memo).length !== Object.keys(data).length) {
    knownChanged.add(memo);
  }
  return knownChanged.has(memo) ? memo : data;
}
function getAccessorWarningDescriptor(fieldName, value, path, operationName, operationType) {
  let getValue = () => {
    if (disableWarningsSlot.getValue()) {
      return value;
    }
    __DEV__ && invariant3.warn(40, operationName ? `${operationType} '${operationName}'` : `anonymous ${operationType}`, `${path}.${fieldName}`.replace(/^\./, ""));
    getValue = () => value;
    return value;
  };
  return {
    get() {
      return getValue();
    },
    set(newValue) {
      getValue = () => newValue;
    },
    enumerable: true,
    configurable: true
  };
}

// node_modules/@apollo/client/masking/maskFragment.js
function maskFragment(data, document, cache, fragmentName) {
  const fragments = document.definitions.filter((node) => node.kind === Kind.FRAGMENT_DEFINITION);
  if (typeof fragmentName === "undefined") {
    invariant3(fragments.length === 1, 41, fragments.length);
    fragmentName = fragments[0].name.value;
  }
  const fragment = fragments.find((fragment2) => fragment2.name.value === fragmentName);
  invariant3(!!fragment, 42, fragmentName);
  if (data == null) {
    return data;
  }
  if (equal(data, {})) {
    return data;
  }
  return maskDefinition(data, fragment.selectionSet, {
    operationType: "fragment",
    operationName: fragment.name.value,
    fragmentMap: createFragmentMap(getFragmentDefinitions(document)),
    cache,
    mutableTargets: /* @__PURE__ */ new WeakMap(),
    knownChanged: /* @__PURE__ */ new WeakSet()
  });
}

// node_modules/@apollo/client/masking/maskOperation.js
function maskOperation(data, document, cache) {
  const definition = getOperationDefinition(document);
  invariant3(definition, 43);
  if (data == null) {
    return data;
  }
  return maskDefinition(data, definition.selectionSet, {
    operationType: definition.operation,
    operationName: definition.name?.value,
    fragmentMap: createFragmentMap(getFragmentDefinitions(document)),
    cache,
    mutableTargets: /* @__PURE__ */ new WeakMap(),
    knownChanged: /* @__PURE__ */ new WeakSet()
  });
}

// node_modules/@apollo/client/cache/inmemory/key-extractor.js
var specifierInfoCache = {};
function lookupSpecifierInfo(spec) {
  const cacheKey = JSON.stringify(spec);
  return specifierInfoCache[cacheKey] || (specifierInfoCache[cacheKey] = {});
}
function keyFieldsFnFromSpecifier(specifier) {
  const info = lookupSpecifierInfo(specifier);
  return info.keyFieldsFn || (info.keyFieldsFn = (object, context2) => {
    const extract = (from3, key) => context2.readField(key, from3);
    const keyObject = context2.keyObject = collectSpecifierPaths(specifier, (schemaKeyPath) => {
      let extracted = extractKeyPath(
        context2.storeObject,
        schemaKeyPath,
        // Using context.readField to extract paths from context.storeObject
        // allows the extraction to see through Reference objects and respect
        // custom read functions.
        extract
      );
      if (extracted === void 0 && object !== context2.storeObject && hasOwn.call(object, schemaKeyPath[0])) {
        extracted = extractKeyPath(object, schemaKeyPath, extractKey);
      }
      invariant3(extracted !== void 0, 98, schemaKeyPath.join("."), object);
      return extracted;
    });
    return `${context2.typename}:${JSON.stringify(keyObject)}`;
  });
}
function keyArgsFnFromSpecifier(specifier) {
  const info = lookupSpecifierInfo(specifier);
  return info.keyArgsFn || (info.keyArgsFn = (args, { field, variables, fieldName }) => {
    const collected = collectSpecifierPaths(specifier, (keyPath) => {
      const firstKey = keyPath[0];
      const firstChar = firstKey.charAt(0);
      if (firstChar === "@") {
        if (field && isNonEmptyArray(field.directives)) {
          const directiveName = firstKey.slice(1);
          const d = field.directives.find((d2) => d2.name.value === directiveName);
          const directiveArgs = d && argumentsObjectFromField(d, variables);
          return directiveArgs && extractKeyPath(
            directiveArgs,
            // If keyPath.length === 1, this code calls extractKeyPath with an
            // empty path, which works because it uses directiveArgs as the
            // extracted value.
            keyPath.slice(1)
          );
        }
        return;
      }
      if (firstChar === "$") {
        const variableName = firstKey.slice(1);
        if (variables && hasOwn.call(variables, variableName)) {
          const varKeyPath = keyPath.slice(0);
          varKeyPath[0] = variableName;
          return extractKeyPath(variables, varKeyPath);
        }
        return;
      }
      if (args) {
        return extractKeyPath(args, keyPath);
      }
    });
    const suffix = JSON.stringify(collected);
    if (args || suffix !== "{}") {
      fieldName += ":" + suffix;
    }
    return fieldName;
  });
}
function collectSpecifierPaths(specifier, extractor) {
  const merger = new DeepMerger();
  return getSpecifierPaths(specifier).reduce((collected, path) => {
    let toMerge = extractor(path);
    if (toMerge !== void 0) {
      for (let i = path.length - 1; i >= 0; --i) {
        toMerge = { [path[i]]: toMerge };
      }
      collected = merger.merge(collected, toMerge);
    }
    return collected;
  }, {});
}
function getSpecifierPaths(spec) {
  const info = lookupSpecifierInfo(spec);
  if (!info.paths) {
    const paths = info.paths = [];
    const currentPath = [];
    spec.forEach((s, i) => {
      if (isArray4(s)) {
        getSpecifierPaths(s).forEach((p) => paths.push(currentPath.concat(p)));
        currentPath.length = 0;
      } else {
        currentPath.push(s);
        if (!isArray4(spec[i + 1])) {
          paths.push(currentPath.slice(0));
          currentPath.length = 0;
        }
      }
    });
  }
  return info.paths;
}
function extractKey(object, key) {
  return object[key];
}
function extractKeyPath(object, path, extract) {
  extract = extract || extractKey;
  return normalize(path.reduce(function reducer(obj, key) {
    return isArray4(obj) ? obj.map((child) => reducer(child, key)) : obj && extract(obj, key);
  }, object));
}
function normalize(value) {
  if (isNonNullObject(value)) {
    if (isArray4(value)) {
      return value.map(normalize);
    }
    return collectSpecifierPaths(Object.keys(value).sort(), (path) => extractKeyPath(value, path));
  }
  return value;
}

// node_modules/@apollo/client/cache/inmemory/reactiveVars.js
var cacheSlot = new Slot();
var cacheInfoMap = /* @__PURE__ */ new WeakMap();
function getCacheInfo(cache) {
  let info = cacheInfoMap.get(cache);
  if (!info) {
    cacheInfoMap.set(cache, info = {
      vars: /* @__PURE__ */ new Set(),
      dep: dep()
    });
  }
  return info;
}
function forgetCache(cache) {
  getCacheInfo(cache).vars.forEach((rv) => rv.forgetCache(cache));
}
function recallCache(cache) {
  getCacheInfo(cache).vars.forEach((rv) => rv.attachCache(cache));
}
function makeVar(value) {
  const caches2 = /* @__PURE__ */ new Set();
  const listeners = /* @__PURE__ */ new Set();
  const rv = function(newValue) {
    if (arguments.length > 0) {
      if (value !== newValue) {
        value = newValue;
        caches2.forEach((cache) => {
          getCacheInfo(cache).dep.dirty(rv);
          broadcast(cache);
        });
        const oldListeners = Array.from(listeners);
        listeners.clear();
        oldListeners.forEach((listener) => listener(value));
      }
    } else {
      const cache = cacheSlot.getValue();
      if (cache) {
        attach(cache);
        getCacheInfo(cache).dep(rv);
      }
    }
    return value;
  };
  rv.onNextChange = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const attach = rv.attachCache = (cache) => {
    caches2.add(cache);
    getCacheInfo(cache).vars.add(rv);
    return rv;
  };
  rv.forgetCache = (cache) => caches2.delete(cache);
  return rv;
}
function broadcast(cache) {
  if (cache.broadcastWatches) {
    cache.broadcastWatches();
  }
}

// node_modules/@apollo/client/cache/inmemory/policies.js
function argsFromFieldSpecifier(spec) {
  return spec.args !== void 0 ? spec.args : spec.field ? argumentsObjectFromField(spec.field, spec.variables) : null;
}
var nullKeyFieldsFn = () => void 0;
var simpleKeyArgsFn = (_args, context2) => context2.fieldName;
var mergeTrueFn = (existing, incoming, { mergeObjects }) => mergeObjects(existing, incoming);
var mergeFalseFn = (_, incoming) => incoming;
var Policies = class {
  config;
  typePolicies = {};
  toBeAdded = {};
  // Map from subtype names to sets of supertype names. Note that this
  // representation inverts the structure of possibleTypes (whose keys are
  // supertypes and whose values are arrays of subtypes) because it tends
  // to be much more efficient to search upwards than downwards.
  supertypeMap = /* @__PURE__ */ new Map();
  // Any fuzzy subtypes specified by possibleTypes will be converted to
  // RegExp objects and recorded here. Every key of this map can also be
  // found in supertypeMap. In many cases this Map will be empty, which
  // means no fuzzy subtype checking will happen in fragmentMatches.
  fuzzySubtypes = /* @__PURE__ */ new Map();
  cache;
  rootIdsByTypename = {};
  rootTypenamesById = {};
  usingPossibleTypes = false;
  constructor(config2) {
    this.config = config2;
    this.config = {
      dataIdFromObject: defaultDataIdFromObject,
      ...config2
    };
    this.cache = this.config.cache;
    this.setRootTypename("Query");
    this.setRootTypename("Mutation");
    this.setRootTypename("Subscription");
    if (config2.possibleTypes) {
      this.addPossibleTypes(config2.possibleTypes);
    }
    if (config2.typePolicies) {
      this.addTypePolicies(config2.typePolicies);
    }
  }
  identify(object, partialContext) {
    const policies = this;
    const typename = partialContext && (partialContext.typename || partialContext.storeObject?.__typename) || object.__typename;
    if (typename === this.rootTypenamesById.ROOT_QUERY) {
      return ["ROOT_QUERY"];
    }
    const storeObject = partialContext && partialContext.storeObject || object;
    const context2 = {
      ...partialContext,
      typename,
      storeObject,
      readField: partialContext && partialContext.readField || ((...args) => {
        const options = normalizeReadFieldOptions(args, storeObject);
        return policies.readField(options, {
          store: policies.cache["data"],
          variables: options.variables
        });
      })
    };
    let id;
    const policy = typename && this.getTypePolicy(typename);
    let keyFn = policy && policy.keyFn || this.config.dataIdFromObject;
    disableWarningsSlot.withValue(true, () => {
      while (keyFn) {
        const specifierOrId = keyFn({ ...object, ...storeObject }, context2);
        if (isArray4(specifierOrId)) {
          keyFn = keyFieldsFnFromSpecifier(specifierOrId);
        } else {
          id = specifierOrId;
          break;
        }
      }
    });
    id = id ? String(id) : void 0;
    return context2.keyObject ? [id, context2.keyObject] : [id];
  }
  addTypePolicies(typePolicies) {
    Object.keys(typePolicies).forEach((typename) => {
      const { queryType, mutationType, subscriptionType, ...incoming } = typePolicies[typename];
      if (queryType)
        this.setRootTypename("Query", typename);
      if (mutationType)
        this.setRootTypename("Mutation", typename);
      if (subscriptionType)
        this.setRootTypename("Subscription", typename);
      if (hasOwn.call(this.toBeAdded, typename)) {
        this.toBeAdded[typename].push(incoming);
      } else {
        this.toBeAdded[typename] = [incoming];
      }
    });
  }
  updateTypePolicy(typename, incoming, existingFieldPolicies) {
    const existing = this.getTypePolicy(typename);
    const { keyFields, fields } = incoming;
    function setMerge(existing2, merge3) {
      existing2.merge = typeof merge3 === "function" ? merge3 : merge3 === true ? mergeTrueFn : merge3 === false ? mergeFalseFn : existing2.merge;
    }
    setMerge(existing, incoming.merge);
    existing.keyFn = // Pass false to disable normalization for this typename.
    keyFields === false ? nullKeyFieldsFn : isArray4(keyFields) ? keyFieldsFnFromSpecifier(keyFields) : typeof keyFields === "function" ? keyFields : existing.keyFn;
    if (fields) {
      Object.keys(fields).forEach((fieldName) => {
        let existing2 = existingFieldPolicies[fieldName];
        if (!existing2 || existing2?.typename !== typename) {
          existing2 = existingFieldPolicies[fieldName] = { typename };
        }
        const incoming2 = fields[fieldName];
        if (typeof incoming2 === "function") {
          existing2.read = incoming2;
        } else {
          const { keyArgs, read, merge: merge3 } = incoming2;
          existing2.keyFn = // Pass false to disable argument-based differentiation of
          // field identities.
          keyArgs === false ? simpleKeyArgsFn : isArray4(keyArgs) ? keyArgsFnFromSpecifier(keyArgs) : typeof keyArgs === "function" ? keyArgs : existing2.keyFn;
          if (typeof read === "function") {
            existing2.read = read;
          }
          setMerge(existing2, merge3);
        }
        if (existing2.read && existing2.merge) {
          existing2.keyFn = existing2.keyFn || simpleKeyArgsFn;
        }
      });
    }
  }
  setRootTypename(which, typename = which) {
    const rootId = "ROOT_" + which.toUpperCase();
    const old = this.rootTypenamesById[rootId];
    if (typename !== old) {
      invariant3(!old || old === which, 99, which);
      if (old)
        delete this.rootIdsByTypename[old];
      this.rootIdsByTypename[typename] = rootId;
      this.rootTypenamesById[rootId] = typename;
    }
  }
  addPossibleTypes(possibleTypes) {
    this.usingPossibleTypes = true;
    Object.keys(possibleTypes).forEach((supertype) => {
      this.getSupertypeSet(supertype, true);
      possibleTypes[supertype].forEach((subtype) => {
        this.getSupertypeSet(subtype, true).add(supertype);
        const match = subtype.match(TypeOrFieldNameRegExp);
        if (!match || match[0] !== subtype) {
          this.fuzzySubtypes.set(subtype, new RegExp(subtype));
        }
      });
    });
  }
  getTypePolicy(typename) {
    if (!hasOwn.call(this.typePolicies, typename)) {
      const policy = this.typePolicies[typename] = {};
      policy.fields = {};
      let supertypes = this.supertypeMap.get(typename);
      if (!supertypes && this.fuzzySubtypes.size) {
        supertypes = this.getSupertypeSet(typename, true);
        this.fuzzySubtypes.forEach((regExp, fuzzy) => {
          if (regExp.test(typename)) {
            const fuzzySupertypes = this.supertypeMap.get(fuzzy);
            if (fuzzySupertypes) {
              fuzzySupertypes.forEach((supertype) => supertypes.add(supertype));
            }
          }
        });
      }
      if (supertypes && supertypes.size) {
        supertypes.forEach((supertype) => {
          const { fields, ...rest } = this.getTypePolicy(supertype);
          Object.assign(policy, rest);
          Object.assign(policy.fields, fields);
        });
      }
    }
    const inbox = this.toBeAdded[typename];
    if (inbox && inbox.length) {
      inbox.splice(0).forEach((policy) => {
        this.updateTypePolicy(typename, policy, this.typePolicies[typename].fields);
      });
    }
    return this.typePolicies[typename];
  }
  getFieldPolicy(typename, fieldName) {
    if (typename) {
      return this.getTypePolicy(typename).fields[fieldName];
    }
  }
  getSupertypeSet(subtype, createIfMissing) {
    let supertypeSet = this.supertypeMap.get(subtype);
    if (!supertypeSet && createIfMissing) {
      this.supertypeMap.set(subtype, supertypeSet = /* @__PURE__ */ new Set());
    }
    return supertypeSet;
  }
  fragmentMatches(fragment, typename, result, variables) {
    if (!fragment.typeCondition)
      return true;
    if (!typename)
      return false;
    const supertype = fragment.typeCondition.name.value;
    if (typename === supertype)
      return true;
    if (this.usingPossibleTypes && this.supertypeMap.has(supertype)) {
      const typenameSupertypeSet = this.getSupertypeSet(typename, true);
      const workQueue = [typenameSupertypeSet];
      const maybeEnqueue = (subtype) => {
        const supertypeSet = this.getSupertypeSet(subtype, false);
        if (supertypeSet && supertypeSet.size && workQueue.indexOf(supertypeSet) < 0) {
          workQueue.push(supertypeSet);
        }
      };
      let needToCheckFuzzySubtypes = !!(result && this.fuzzySubtypes.size);
      let checkingFuzzySubtypes = false;
      for (let i = 0; i < workQueue.length; ++i) {
        const supertypeSet = workQueue[i];
        if (supertypeSet.has(supertype)) {
          if (!typenameSupertypeSet.has(supertype)) {
            if (checkingFuzzySubtypes) {
              __DEV__ && invariant3.warn(100, typename, supertype);
            }
            typenameSupertypeSet.add(supertype);
          }
          return true;
        }
        supertypeSet.forEach(maybeEnqueue);
        if (needToCheckFuzzySubtypes && // Start checking fuzzy subtypes only after exhausting all
        // non-fuzzy subtypes (after the final iteration of the loop).
        i === workQueue.length - 1 && // We could wait to compare fragment.selectionSet to result
        // after we verify the supertype, but this check is often less
        // expensive than that search, and we will have to do the
        // comparison anyway whenever we find a potential match.
        selectionSetMatchesResult(fragment.selectionSet, result, variables)) {
          needToCheckFuzzySubtypes = false;
          checkingFuzzySubtypes = true;
          this.fuzzySubtypes.forEach((regExp, fuzzyString) => {
            const match = typename.match(regExp);
            if (match && match[0] === typename) {
              maybeEnqueue(fuzzyString);
            }
          });
        }
      }
    }
    return false;
  }
  hasKeyArgs(typename, fieldName) {
    const policy = this.getFieldPolicy(typename, fieldName);
    return !!(policy && policy.keyFn);
  }
  getStoreFieldName(fieldSpec) {
    const { typename, fieldName } = fieldSpec;
    const policy = this.getFieldPolicy(typename, fieldName);
    let storeFieldName;
    let keyFn = policy && policy.keyFn;
    if (keyFn && typename) {
      const context2 = {
        typename,
        fieldName,
        field: fieldSpec.field || null,
        variables: fieldSpec.variables
      };
      const args = argsFromFieldSpecifier(fieldSpec);
      while (keyFn) {
        const specifierOrString = keyFn(args, context2);
        if (isArray4(specifierOrString)) {
          keyFn = keyArgsFnFromSpecifier(specifierOrString);
        } else {
          storeFieldName = specifierOrString || fieldName;
          break;
        }
      }
    }
    if (storeFieldName === void 0) {
      storeFieldName = fieldSpec.field ? storeKeyNameFromField(fieldSpec.field, fieldSpec.variables) : getStoreKeyName(fieldName, argsFromFieldSpecifier(fieldSpec));
    }
    if (storeFieldName === false) {
      return fieldName;
    }
    return fieldName === fieldNameFromStoreName(storeFieldName) ? storeFieldName : fieldName + ":" + storeFieldName;
  }
  readField(options, context2) {
    const objectOrReference = options.from;
    if (!objectOrReference)
      return;
    const nameOrField = options.field || options.fieldName;
    if (!nameOrField)
      return;
    if (options.typename === void 0) {
      const typename = context2.store.getFieldValue(objectOrReference, "__typename");
      if (typename)
        options.typename = typename;
    }
    const storeFieldName = this.getStoreFieldName(options);
    const fieldName = fieldNameFromStoreName(storeFieldName);
    const existing = context2.store.getFieldValue(objectOrReference, storeFieldName);
    const policy = this.getFieldPolicy(options.typename, fieldName);
    const read = policy && policy.read;
    if (read) {
      const readOptions = makeFieldFunctionOptions(this, objectOrReference, options, context2, context2.store.getStorage(isReference(objectOrReference) ? objectOrReference.__ref : objectOrReference, storeFieldName));
      return cacheSlot.withValue(this.cache, read, [
        existing,
        readOptions
      ]);
    }
    return existing;
  }
  getReadFunction(typename, fieldName) {
    const policy = this.getFieldPolicy(typename, fieldName);
    return policy && policy.read;
  }
  getMergeFunction(parentTypename, fieldName, childTypename) {
    let policy = this.getFieldPolicy(parentTypename, fieldName);
    let merge3 = policy && policy.merge;
    if (!merge3 && childTypename) {
      policy = this.getTypePolicy(childTypename);
      merge3 = policy && policy.merge;
    }
    return merge3;
  }
  runMergeFunction(existing, incoming, { field, typename, merge: merge3 }, context2, storage) {
    if (merge3 === mergeTrueFn) {
      return makeMergeObjectsFunction(context2.store)(existing, incoming);
    }
    if (merge3 === mergeFalseFn) {
      return incoming;
    }
    if (context2.overwrite) {
      existing = void 0;
    }
    return merge3(existing, incoming, makeFieldFunctionOptions(
      this,
      // Unlike options.readField for read functions, we do not fall
      // back to the current object if no foreignObjOrRef is provided,
      // because it's not clear what the current object should be for
      // merge functions: the (possibly undefined) existing object, or
      // the incoming object? If you think your merge function needs
      // to read sibling fields in order to produce a new value for
      // the current field, you might want to rethink your strategy,
      // because that's a recipe for making merge behavior sensitive
      // to the order in which fields are written into the cache.
      // However, readField(name, ref) is useful for merge functions
      // that need to deduplicate child objects and references.
      void 0,
      {
        typename,
        fieldName: field.name.value,
        field,
        variables: context2.variables
      },
      context2,
      storage || {}
    ));
  }
};
function makeFieldFunctionOptions(policies, objectOrReference, fieldSpec, context2, storage) {
  const storeFieldName = policies.getStoreFieldName(fieldSpec);
  const fieldName = fieldNameFromStoreName(storeFieldName);
  const variables = fieldSpec.variables || context2.variables;
  const { toReference, canRead } = context2.store;
  return {
    args: argsFromFieldSpecifier(fieldSpec),
    field: fieldSpec.field || null,
    fieldName,
    storeFieldName,
    variables,
    isReference,
    toReference,
    storage,
    cache: policies.cache,
    canRead,
    readField(...args) {
      return policies.readField(normalizeReadFieldOptions(args, objectOrReference, variables), context2);
    },
    mergeObjects: makeMergeObjectsFunction(context2.store)
  };
}
function normalizeReadFieldOptions(readFieldArgs, objectOrReference, variables) {
  const { 0: fieldNameOrOptions, 1: from3, length: argc } = readFieldArgs;
  let options;
  if (typeof fieldNameOrOptions === "string") {
    options = {
      fieldName: fieldNameOrOptions,
      // Default to objectOrReference only when no second argument was
      // passed for the from parameter, not when undefined is explicitly
      // passed as the second argument.
      from: argc > 1 ? from3 : objectOrReference
    };
  } else {
    options = { ...fieldNameOrOptions };
    if (!hasOwn.call(options, "from")) {
      options.from = objectOrReference;
    }
  }
  if (__DEV__ && options.from === void 0) {
    __DEV__ && invariant3.warn(101, stringifyForDisplay(Array.from(readFieldArgs)));
  }
  if (void 0 === options.variables) {
    options.variables = variables;
  }
  return options;
}
function makeMergeObjectsFunction(store) {
  return function mergeObjects(existing, incoming) {
    if (isArray4(existing) || isArray4(incoming)) {
      throw newInvariantError(102);
    }
    if (isNonNullObject(existing) && isNonNullObject(incoming)) {
      const eType = store.getFieldValue(existing, "__typename");
      const iType = store.getFieldValue(incoming, "__typename");
      const typesDiffer = eType && iType && eType !== iType;
      if (typesDiffer) {
        return incoming;
      }
      if (isReference(existing) && storeValueIsStoreObject(incoming)) {
        store.merge(existing.__ref, incoming);
        return existing;
      }
      if (storeValueIsStoreObject(existing) && isReference(incoming)) {
        store.merge(existing, incoming.__ref);
        return incoming;
      }
      if (storeValueIsStoreObject(existing) && storeValueIsStoreObject(incoming)) {
        return { ...existing, ...incoming };
      }
    }
    return incoming;
  };
}

// node_modules/@apollo/client/cache/inmemory/readFromStore.js
function execSelectionSetKeyArgs(options) {
  return [options.selectionSet, options.objectOrReference, options.context];
}
var StoreReader = class {
  // cached version of executeSelectionSet
  executeSelectionSet;
  // cached version of executeSubSelectedArray
  executeSubSelectedArray;
  config;
  knownResults = /* @__PURE__ */ new WeakMap();
  constructor(config2) {
    this.config = config2;
    this.executeSelectionSet = wrap2((options) => {
      const peekArgs = execSelectionSetKeyArgs(options);
      const other = this.executeSelectionSet.peek(...peekArgs);
      if (other) {
        return other;
      }
      maybeDependOnExistenceOfEntity(options.context.store, options.enclosingRef.__ref);
      return this.execSelectionSetImpl(options);
    }, {
      max: cacheSizes["inMemoryCache.executeSelectionSet"] || 5e4,
      keyArgs: execSelectionSetKeyArgs,
      // Note that the parameters of makeCacheKey are determined by the
      // array returned by keyArgs.
      makeCacheKey(selectionSet, parent, context2) {
        if (supportsResultCaching(context2.store)) {
          return context2.store.makeCacheKey(selectionSet, isReference(parent) ? parent.__ref : parent, context2.varString);
        }
      }
    });
    this.executeSubSelectedArray = wrap2((options) => {
      maybeDependOnExistenceOfEntity(options.context.store, options.enclosingRef.__ref);
      return this.execSubSelectedArrayImpl(options);
    }, {
      max: cacheSizes["inMemoryCache.executeSubSelectedArray"] || 1e4,
      makeCacheKey({ field, array, context: context2 }) {
        if (supportsResultCaching(context2.store)) {
          return context2.store.makeCacheKey(field, array, context2.varString);
        }
      }
    });
  }
  /**
   * Given a store and a query, return as much of the result as possible and
   * identify if any data was missing from the store.
   */
  diffQueryAgainstStore({ store, query, rootId = "ROOT_QUERY", variables, returnPartialData = true }) {
    const policies = this.config.cache.policies;
    variables = {
      ...getDefaultValues(getQueryDefinition(query)),
      ...variables
    };
    const rootRef = makeReference(rootId);
    const execResult = this.executeSelectionSet({
      selectionSet: getMainDefinition(query).selectionSet,
      objectOrReference: rootRef,
      enclosingRef: rootRef,
      context: {
        store,
        query,
        policies,
        variables,
        varString: canonicalStringify(variables),
        ...extractFragmentContext(query, this.config.fragments)
      }
    });
    let missing;
    if (execResult.missing) {
      missing = new MissingFieldError(firstMissing(execResult.missing), execResult.missing, query, variables);
    }
    const complete = !missing;
    const { result } = execResult;
    return {
      result: complete || returnPartialData ? Object.keys(result).length === 0 ? null : result : null,
      complete,
      missing
    };
  }
  isFresh(result, parent, selectionSet, context2) {
    if (supportsResultCaching(context2.store) && this.knownResults.get(result) === selectionSet) {
      const latest = this.executeSelectionSet.peek(selectionSet, parent, context2);
      if (latest && result === latest.result) {
        return true;
      }
    }
    return false;
  }
  // Uncached version of executeSelectionSet.
  execSelectionSetImpl({ selectionSet, objectOrReference, enclosingRef, context: context2 }) {
    if (isReference(objectOrReference) && !context2.policies.rootTypenamesById[objectOrReference.__ref] && !context2.store.has(objectOrReference.__ref)) {
      return {
        result: {},
        missing: `Dangling reference to missing ${objectOrReference.__ref} object`
      };
    }
    const { variables, policies, store } = context2;
    const typename = store.getFieldValue(objectOrReference, "__typename");
    const objectsToMerge = [];
    let missing;
    const missingMerger = new DeepMerger();
    if (typeof typename === "string" && !policies.rootIdsByTypename[typename]) {
      objectsToMerge.push({ __typename: typename });
    }
    function handleMissing(result2, resultName) {
      if (result2.missing) {
        missing = missingMerger.merge(missing, {
          [resultName]: result2.missing
        });
      }
      return result2.result;
    }
    const workSet = new Set(selectionSet.selections);
    workSet.forEach((selection) => {
      if (!shouldInclude(selection, variables))
        return;
      if (isField(selection)) {
        let fieldValue = policies.readField({
          fieldName: selection.name.value,
          field: selection,
          variables: context2.variables,
          from: objectOrReference
        }, context2);
        const resultName = resultKeyNameFromField(selection);
        if (fieldValue === void 0) {
          if (!addTypenameToDocument.added(selection)) {
            missing = missingMerger.merge(missing, {
              [resultName]: `Can't find field '${selection.name.value}' on ${isReference(objectOrReference) ? objectOrReference.__ref + " object" : "object " + JSON.stringify(objectOrReference, null, 2)}`
            });
          }
        } else if (isArray4(fieldValue)) {
          if (fieldValue.length > 0) {
            fieldValue = handleMissing(this.executeSubSelectedArray({
              field: selection,
              array: fieldValue,
              enclosingRef,
              context: context2
            }), resultName);
          }
        } else if (!selection.selectionSet) {
        } else if (fieldValue != null) {
          fieldValue = handleMissing(this.executeSelectionSet({
            selectionSet: selection.selectionSet,
            objectOrReference: fieldValue,
            enclosingRef: isReference(fieldValue) ? fieldValue : enclosingRef,
            context: context2
          }), resultName);
        }
        if (fieldValue !== void 0) {
          objectsToMerge.push({ [resultName]: fieldValue });
        }
      } else {
        const fragment = getFragmentFromSelection(selection, context2.lookupFragment);
        if (!fragment && selection.kind === Kind.FRAGMENT_SPREAD) {
          throw newInvariantError(103, selection.name.value);
        }
        if (fragment && policies.fragmentMatches(fragment, typename)) {
          fragment.selectionSet.selections.forEach(workSet.add, workSet);
        }
      }
    });
    const result = mergeDeepArray(objectsToMerge);
    const finalResult = { result, missing };
    const frozen = maybeDeepFreeze(finalResult);
    if (frozen.result) {
      this.knownResults.set(frozen.result, selectionSet);
    }
    return frozen;
  }
  // Uncached version of executeSubSelectedArray.
  execSubSelectedArrayImpl({ field, array, enclosingRef, context: context2 }) {
    let missing;
    let missingMerger = new DeepMerger();
    function handleMissing(childResult, i) {
      if (childResult.missing) {
        missing = missingMerger.merge(missing, { [i]: childResult.missing });
      }
      return childResult.result;
    }
    if (field.selectionSet) {
      array = array.filter(context2.store.canRead);
    }
    array = array.map((item, i) => {
      if (item === null) {
        return null;
      }
      if (isArray4(item)) {
        return handleMissing(this.executeSubSelectedArray({
          field,
          array: item,
          enclosingRef,
          context: context2
        }), i);
      }
      if (field.selectionSet) {
        return handleMissing(this.executeSelectionSet({
          selectionSet: field.selectionSet,
          objectOrReference: item,
          enclosingRef: isReference(item) ? item : enclosingRef,
          context: context2
        }), i);
      }
      if (__DEV__) {
        assertSelectionSetForIdValue(context2.store, field, item);
      }
      return item;
    });
    return {
      result: array,
      missing
    };
  }
};
function firstMissing(tree) {
  try {
    JSON.stringify(tree, (_, value) => {
      if (typeof value === "string")
        throw value;
      return value;
    });
  } catch (result) {
    return result;
  }
}
function assertSelectionSetForIdValue(store, field, fieldValue) {
  if (!field.selectionSet) {
    const workSet = /* @__PURE__ */ new Set([fieldValue]);
    workSet.forEach((value) => {
      if (isNonNullObject(value)) {
        invariant3(
          !isReference(value),
          104,
          getTypenameFromStoreObject(store, value),
          field.name.value
        );
        Object.values(value).forEach(workSet.add, workSet);
      }
    });
  }
}

// node_modules/@apollo/client/cache/inmemory/writeToStore.js
function getContextFlavor(context2, clientOnly, deferred) {
  const key = `${clientOnly}${deferred}`;
  let flavored = context2.flavors.get(key);
  if (!flavored) {
    context2.flavors.set(key, flavored = context2.clientOnly === clientOnly && context2.deferred === deferred ? context2 : {
      ...context2,
      clientOnly,
      deferred
    });
  }
  return flavored;
}
var StoreWriter = class {
  cache;
  reader;
  fragments;
  constructor(cache, reader, fragments) {
    this.cache = cache;
    this.reader = reader;
    this.fragments = fragments;
  }
  writeToStore(store, { query, result, dataId, variables, overwrite }) {
    const operationDefinition = getOperationDefinition(query);
    const merger = makeProcessedFieldsMerger();
    variables = {
      ...getDefaultValues(operationDefinition),
      ...variables
    };
    const context2 = {
      store,
      written: {},
      merge(existing, incoming) {
        return merger.merge(existing, incoming);
      },
      variables,
      varString: canonicalStringify(variables),
      ...extractFragmentContext(query, this.fragments),
      overwrite: !!overwrite,
      incomingById: /* @__PURE__ */ new Map(),
      clientOnly: false,
      deferred: false,
      flavors: /* @__PURE__ */ new Map()
    };
    const ref = this.processSelectionSet({
      result: result || {},
      dataId,
      selectionSet: operationDefinition.selectionSet,
      mergeTree: { map: /* @__PURE__ */ new Map() },
      context: context2
    });
    if (!isReference(ref)) {
      throw newInvariantError(105, result);
    }
    context2.incomingById.forEach(({ storeObject, mergeTree, fieldNodeSet }, dataId2) => {
      const entityRef = makeReference(dataId2);
      if (mergeTree && mergeTree.map.size) {
        const applied = this.applyMerges(mergeTree, entityRef, storeObject, context2);
        if (isReference(applied)) {
          return;
        }
        storeObject = applied;
      }
      if (__DEV__ && !context2.overwrite) {
        const fieldsWithSelectionSets = {};
        fieldNodeSet.forEach((field) => {
          if (field.selectionSet) {
            fieldsWithSelectionSets[field.name.value] = true;
          }
        });
        const hasSelectionSet = (storeFieldName) => fieldsWithSelectionSets[fieldNameFromStoreName(storeFieldName)] === true;
        const hasMergeFunction = (storeFieldName) => {
          const childTree = mergeTree && mergeTree.map.get(storeFieldName);
          return Boolean(childTree && childTree.info && childTree.info.merge);
        };
        Object.keys(storeObject).forEach((storeFieldName) => {
          if (hasSelectionSet(storeFieldName) && !hasMergeFunction(storeFieldName)) {
            warnAboutDataLoss(entityRef, storeObject, storeFieldName, context2.store);
          }
        });
      }
      store.merge(dataId2, storeObject);
    });
    store.retain(ref.__ref);
    return ref;
  }
  processSelectionSet({
    dataId,
    result,
    selectionSet,
    context: context2,
    // This object allows processSelectionSet to report useful information
    // to its callers without explicitly returning that information.
    mergeTree
  }) {
    const { policies } = this.cache;
    let incoming = {};
    const typename = dataId && policies.rootTypenamesById[dataId] || getTypenameFromResult(result, selectionSet, context2.fragmentMap) || dataId && context2.store.get(dataId, "__typename");
    if ("string" === typeof typename) {
      incoming.__typename = typename;
    }
    const readField = (...args) => {
      const options = normalizeReadFieldOptions(args, incoming, context2.variables);
      if (isReference(options.from)) {
        const info = context2.incomingById.get(options.from.__ref);
        if (info) {
          const result2 = policies.readField({
            ...options,
            from: info.storeObject
          }, context2);
          if (result2 !== void 0) {
            return result2;
          }
        }
      }
      return policies.readField(options, context2);
    };
    const fieldNodeSet = /* @__PURE__ */ new Set();
    this.flattenFields(
      selectionSet,
      result,
      // This WriteContext will be the default context value for fields returned
      // by the flattenFields method, but some fields may be assigned a modified
      // context, depending on the presence of @client and other directives.
      context2,
      typename
    ).forEach((context3, field) => {
      const resultFieldKey = resultKeyNameFromField(field);
      const value = result[resultFieldKey];
      fieldNodeSet.add(field);
      if (value !== void 0) {
        const storeFieldName = policies.getStoreFieldName({
          typename,
          fieldName: field.name.value,
          field,
          variables: context3.variables
        });
        const childTree = getChildMergeTree(mergeTree, storeFieldName);
        let incomingValue = this.processFieldValue(
          value,
          field,
          // Reset context.clientOnly and context.deferred to their default
          // values before processing nested selection sets.
          field.selectionSet ? getContextFlavor(context3, false, false) : context3,
          childTree
        );
        let childTypename;
        if (field.selectionSet && (isReference(incomingValue) || storeValueIsStoreObject(incomingValue))) {
          childTypename = readField("__typename", incomingValue);
        }
        const merge3 = policies.getMergeFunction(typename, field.name.value, childTypename);
        if (merge3) {
          childTree.info = {
            // TODO Check compatibility against any existing childTree.field?
            field,
            typename,
            merge: merge3
          };
        } else {
          maybeRecycleChildMergeTree(mergeTree, storeFieldName);
        }
        incoming = context3.merge(incoming, {
          [storeFieldName]: incomingValue
        });
      } else if (__DEV__ && !context3.clientOnly && !context3.deferred && !addTypenameToDocument.added(field) && // If the field has a read function, it may be a synthetic field or
      // provide a default value, so its absence from the written data should
      // not be cause for alarm.
      !policies.getReadFunction(typename, field.name.value)) {
        invariant3.error(106, resultKeyNameFromField(field), result);
      }
    });
    try {
      const [id, keyObject] = policies.identify(result, {
        typename,
        selectionSet,
        fragmentMap: context2.fragmentMap,
        storeObject: incoming,
        readField
      });
      dataId = dataId || id;
      if (keyObject) {
        incoming = context2.merge(incoming, keyObject);
      }
    } catch (e) {
      if (!dataId)
        throw e;
    }
    if ("string" === typeof dataId) {
      const dataRef = makeReference(dataId);
      const sets = context2.written[dataId] || (context2.written[dataId] = []);
      if (sets.indexOf(selectionSet) >= 0)
        return dataRef;
      sets.push(selectionSet);
      if (this.reader && this.reader.isFresh(result, dataRef, selectionSet, context2)) {
        return dataRef;
      }
      const previous = context2.incomingById.get(dataId);
      if (previous) {
        previous.storeObject = context2.merge(previous.storeObject, incoming);
        previous.mergeTree = mergeMergeTrees(previous.mergeTree, mergeTree);
        fieldNodeSet.forEach((field) => previous.fieldNodeSet.add(field));
      } else {
        context2.incomingById.set(dataId, {
          storeObject: incoming,
          // Save a reference to mergeTree only if it is not empty, because
          // empty MergeTrees may be recycled by maybeRecycleChildMergeTree and
          // reused for entirely different parts of the result tree.
          mergeTree: mergeTreeIsEmpty(mergeTree) ? void 0 : mergeTree,
          fieldNodeSet
        });
      }
      return dataRef;
    }
    return incoming;
  }
  processFieldValue(value, field, context2, mergeTree) {
    if (!field.selectionSet || value === null) {
      return __DEV__ ? cloneDeep(value) : value;
    }
    if (isArray4(value)) {
      return value.map((item, i) => {
        const value2 = this.processFieldValue(item, field, context2, getChildMergeTree(mergeTree, i));
        maybeRecycleChildMergeTree(mergeTree, i);
        return value2;
      });
    }
    return this.processSelectionSet({
      result: value,
      selectionSet: field.selectionSet,
      context: context2,
      mergeTree
    });
  }
  // Implements https://spec.graphql.org/draft/#sec-Field-Collection, but with
  // some additions for tracking @client and @defer directives.
  flattenFields(selectionSet, result, context2, typename = getTypenameFromResult(result, selectionSet, context2.fragmentMap)) {
    const fieldMap = /* @__PURE__ */ new Map();
    const { policies } = this.cache;
    const limitingTrie = new Trie(false);
    (function flatten(selectionSet2, inheritedContext) {
      const visitedNode = limitingTrie.lookup(
        selectionSet2,
        // Because we take inheritedClientOnly and inheritedDeferred into
        // consideration here (in addition to selectionSet), it's possible for
        // the same selection set to be flattened more than once, if it appears
        // in the query with different @client and/or @directive configurations.
        inheritedContext.clientOnly,
        inheritedContext.deferred
      );
      if (visitedNode.visited)
        return;
      visitedNode.visited = true;
      selectionSet2.selections.forEach((selection) => {
        if (!shouldInclude(selection, context2.variables))
          return;
        let { clientOnly, deferred } = inheritedContext;
        if (
          // Since the presence of @client or @defer on this field can only
          // cause clientOnly or deferred to become true, we can skip the
          // forEach loop if both clientOnly and deferred are already true.
          !(clientOnly && deferred) && isNonEmptyArray(selection.directives)
        ) {
          selection.directives.forEach((dir) => {
            const name = dir.name.value;
            if (name === "client")
              clientOnly = true;
            if (name === "defer") {
              const args = argumentsObjectFromField(dir, context2.variables);
              if (!args || args.if !== false) {
                deferred = true;
              }
            }
          });
        }
        if (isField(selection)) {
          const existing = fieldMap.get(selection);
          if (existing) {
            clientOnly = clientOnly && existing.clientOnly;
            deferred = deferred && existing.deferred;
          }
          fieldMap.set(selection, getContextFlavor(context2, clientOnly, deferred));
        } else {
          const fragment = getFragmentFromSelection(selection, context2.lookupFragment);
          if (!fragment && selection.kind === Kind.FRAGMENT_SPREAD) {
            throw newInvariantError(107, selection.name.value);
          }
          if (fragment && policies.fragmentMatches(fragment, typename, result, context2.variables)) {
            flatten(fragment.selectionSet, getContextFlavor(context2, clientOnly, deferred));
          }
        }
      });
    })(selectionSet, context2);
    return fieldMap;
  }
  applyMerges(mergeTree, existing, incoming, context2, getStorageArgs) {
    if (mergeTree.map.size && !isReference(incoming)) {
      const e = (
        // Items in the same position in different arrays are not
        // necessarily related to each other, so when incoming is an array
        // we process its elements as if there was no existing data.
        !isArray4(incoming) && // Likewise, existing must be either a Reference or a StoreObject
        // in order for its fields to be safe to merge with the fields of
        // the incoming object.
        (isReference(existing) || storeValueIsStoreObject(existing)) ? existing : void 0
      );
      const i = incoming;
      if (e && !getStorageArgs) {
        getStorageArgs = [isReference(e) ? e.__ref : e];
      }
      let changedFields;
      const getValue = (from3, name) => {
        return isArray4(from3) ? typeof name === "number" ? from3[name] : void 0 : context2.store.getFieldValue(from3, String(name));
      };
      mergeTree.map.forEach((childTree, storeFieldName) => {
        const eVal = getValue(e, storeFieldName);
        const iVal = getValue(i, storeFieldName);
        if (void 0 === iVal)
          return;
        if (getStorageArgs) {
          getStorageArgs.push(storeFieldName);
        }
        const aVal = this.applyMerges(childTree, eVal, iVal, context2, getStorageArgs);
        if (aVal !== iVal) {
          changedFields = changedFields || /* @__PURE__ */ new Map();
          changedFields.set(storeFieldName, aVal);
        }
        if (getStorageArgs) {
          invariant3(getStorageArgs.pop() === storeFieldName);
        }
      });
      if (changedFields) {
        incoming = isArray4(i) ? i.slice(0) : { ...i };
        changedFields.forEach((value, name) => {
          incoming[name] = value;
        });
      }
    }
    if (mergeTree.info) {
      return this.cache.policies.runMergeFunction(existing, incoming, mergeTree.info, context2, getStorageArgs && context2.store.getStorage(...getStorageArgs));
    }
    return incoming;
  }
};
var emptyMergeTreePool = [];
function getChildMergeTree({ map: map2 }, name) {
  if (!map2.has(name)) {
    map2.set(name, emptyMergeTreePool.pop() || { map: /* @__PURE__ */ new Map() });
  }
  return map2.get(name);
}
function mergeMergeTrees(left, right) {
  if (left === right || !right || mergeTreeIsEmpty(right))
    return left;
  if (!left || mergeTreeIsEmpty(left))
    return right;
  const info = left.info && right.info ? {
    ...left.info,
    ...right.info
  } : left.info || right.info;
  const needToMergeMaps = left.map.size && right.map.size;
  const map2 = needToMergeMaps ? /* @__PURE__ */ new Map() : left.map.size ? left.map : right.map;
  const merged = { info, map: map2 };
  if (needToMergeMaps) {
    const remainingRightKeys = new Set(right.map.keys());
    left.map.forEach((leftTree, key) => {
      merged.map.set(key, mergeMergeTrees(leftTree, right.map.get(key)));
      remainingRightKeys.delete(key);
    });
    remainingRightKeys.forEach((key) => {
      merged.map.set(key, mergeMergeTrees(right.map.get(key), left.map.get(key)));
    });
  }
  return merged;
}
function mergeTreeIsEmpty(tree) {
  return !tree || !(tree.info || tree.map.size);
}
function maybeRecycleChildMergeTree({ map: map2 }, name) {
  const childTree = map2.get(name);
  if (childTree && mergeTreeIsEmpty(childTree)) {
    emptyMergeTreePool.push(childTree);
    map2.delete(name);
  }
}
var warnings = /* @__PURE__ */ new Set();
function warnAboutDataLoss(existingRef, incomingObj, storeFieldName, store) {
  const getChild = (objOrRef) => {
    const child = store.getFieldValue(objOrRef, storeFieldName);
    return typeof child === "object" && child;
  };
  const existing = getChild(existingRef);
  if (!existing)
    return;
  const incoming = getChild(incomingObj);
  if (!incoming)
    return;
  if (isReference(existing))
    return;
  if (equal(existing, incoming))
    return;
  if (Object.keys(existing).every((key) => store.getFieldValue(incoming, key) !== void 0)) {
    return;
  }
  const parentType = store.getFieldValue(existingRef, "__typename") || store.getFieldValue(incomingObj, "__typename");
  const fieldName = fieldNameFromStoreName(storeFieldName);
  const typeDotName = `${parentType}.${fieldName}`;
  if (warnings.has(typeDotName))
    return;
  warnings.add(typeDotName);
  const childTypenames = [];
  if (!isArray4(existing) && !isArray4(incoming)) {
    [existing, incoming].forEach((child) => {
      const typename = store.getFieldValue(child, "__typename");
      if (typeof typename === "string" && !childTypenames.includes(typename)) {
        childTypenames.push(typename);
      }
    });
  }
  __DEV__ && invariant3.warn(108, fieldName, parentType, childTypenames.length ? "either ensure all objects of type " + childTypenames.join(" and ") + " have an ID or a custom merge function, or " : "", typeDotName, { ...existing }, { ...incoming });
}
function getTypenameFromResult(result, selectionSet, fragmentMap) {
  let fragments;
  for (const selection of selectionSet.selections) {
    if (isField(selection)) {
      if (selection.name.value === "__typename") {
        return result[resultKeyNameFromField(selection)];
      }
    } else if (fragments) {
      fragments.push(selection);
    } else {
      fragments = [selection];
    }
  }
  if (typeof result.__typename === "string") {
    return result.__typename;
  }
  if (fragments) {
    for (const selection of fragments) {
      const typename = getTypenameFromResult(result, getFragmentFromSelection(selection, fragmentMap).selectionSet, fragmentMap);
      if (typeof typename === "string") {
        return typename;
      }
    }
  }
}

// node_modules/@apollo/client/cache/inmemory/inMemoryCache.js
var InMemoryCache = class extends ApolloCache {
  data;
  optimisticData;
  config;
  watches = /* @__PURE__ */ new Set();
  storeReader;
  storeWriter;
  addTypenameTransform = new DocumentTransform(addTypenameToDocument);
  maybeBroadcastWatch;
  // Override the default value, since InMemoryCache result objects are frozen
  // in development and expected to remain logically immutable in production.
  assumeImmutableResults = true;
  // Dynamically imported code can augment existing typePolicies or
  // possibleTypes by calling cache.policies.addTypePolicies or
  // cache.policies.addPossibletypes.
  policies;
  makeVar = makeVar;
  constructor(config2 = {}) {
    super();
    this.config = normalizeConfig(config2);
    this.policies = new Policies({
      cache: this,
      dataIdFromObject: this.config.dataIdFromObject,
      possibleTypes: this.config.possibleTypes,
      typePolicies: this.config.typePolicies
    });
    this.init();
  }
  init() {
    const rootStore = this.data = new EntityStore.Root({
      policies: this.policies,
      resultCaching: this.config.resultCaching
    });
    this.optimisticData = rootStore.stump;
    this.resetResultCache();
  }
  resetResultCache() {
    const { fragments } = this.config;
    this.addTypenameTransform.resetCache();
    fragments?.resetCaches();
    this.storeWriter = new StoreWriter(this, this.storeReader = new StoreReader({ cache: this, fragments }), fragments);
    this.maybeBroadcastWatch = wrap2((c, options) => {
      return this.broadcastWatch(c, options);
    }, {
      max: cacheSizes["inMemoryCache.maybeBroadcastWatch"] || 5e3,
      makeCacheKey: (c) => {
        const store = c.optimistic ? this.optimisticData : this.data;
        if (supportsResultCaching(store)) {
          const { optimistic, id, variables } = c;
          return store.makeCacheKey(
            c.query,
            // Different watches can have the same query, optimistic
            // status, rootId, and variables, but if their callbacks are
            // different, the (identical) result needs to be delivered to
            // each distinct callback. The easiest way to achieve that
            // separation is to include c.callback in the cache key for
            // maybeBroadcastWatch calls. See issue #5733.
            c.callback,
            canonicalStringify({ optimistic, id, variables })
          );
        }
      }
    });
    (/* @__PURE__ */ new Set([this.data.group, this.optimisticData.group])).forEach((group) => group.resetCaching());
  }
  restore(data) {
    this.init();
    if (data)
      this.data.replace(data);
    return this;
  }
  extract(optimistic = false) {
    return (optimistic ? this.optimisticData : this.data).extract();
  }
  read(options) {
    const {
      // Since read returns data or null, without any additional metadata
      // about whether/where there might have been missing fields, the
      // default behavior cannot be returnPartialData = true (like it is
      // for the diff method), since defaulting to true would violate the
      // integrity of the T in the return type. However, partial data may
      // be useful in some cases, so returnPartialData:true may be
      // specified explicitly.
      returnPartialData = false
    } = options;
    return this.storeReader.diffQueryAgainstStore({
      ...options,
      store: options.optimistic ? this.optimisticData : this.data,
      config: this.config,
      returnPartialData
    }).result;
  }
  write(options) {
    try {
      ++this.txCount;
      return this.storeWriter.writeToStore(this.data, options);
    } finally {
      if (!--this.txCount && options.broadcast !== false) {
        this.broadcastWatches();
      }
    }
  }
  modify(options) {
    if (hasOwn.call(options, "id") && !options.id) {
      return false;
    }
    const store = options.optimistic ? this.optimisticData : this.data;
    try {
      ++this.txCount;
      return store.modify(options.id || "ROOT_QUERY", options.fields, false);
    } finally {
      if (!--this.txCount && options.broadcast !== false) {
        this.broadcastWatches();
      }
    }
  }
  diff(options) {
    return this.storeReader.diffQueryAgainstStore({
      ...options,
      store: options.optimistic ? this.optimisticData : this.data,
      rootId: options.id || "ROOT_QUERY",
      config: this.config
    });
  }
  watch(watch) {
    if (!this.watches.size) {
      recallCache(this);
    }
    this.watches.add(watch);
    if (watch.immediate) {
      this.maybeBroadcastWatch(watch);
    }
    return () => {
      if (this.watches.delete(watch) && !this.watches.size) {
        forgetCache(this);
      }
      this.maybeBroadcastWatch.forget(watch);
    };
  }
  gc(options) {
    canonicalStringify.reset();
    print2.reset();
    const ids = this.optimisticData.gc();
    if (options && !this.txCount && options.resetResultCache) {
      this.resetResultCache();
    }
    return ids;
  }
  // Call this method to ensure the given root ID remains in the cache after
  // garbage collection, along with its transitive child entities. Note that
  // the cache automatically retains all directly written entities. By default,
  // the retainment persists after optimistic updates are removed. Pass true
  // for the optimistic argument if you would prefer for the retainment to be
  // discarded when the top-most optimistic layer is removed. Returns the
  // resulting (non-negative) retainment count.
  retain(rootId, optimistic) {
    return (optimistic ? this.optimisticData : this.data).retain(rootId);
  }
  // Call this method to undo the effect of the retain method, above. Once the
  // retainment count falls to zero, the given ID will no longer be preserved
  // during garbage collection, though it may still be preserved by other safe
  // entities that refer to it. Returns the resulting (non-negative) retainment
  // count, in case that's useful.
  release(rootId, optimistic) {
    return (optimistic ? this.optimisticData : this.data).release(rootId);
  }
  // Returns the canonical ID for a given StoreObject, obeying typePolicies
  // and keyFields (and dataIdFromObject, if you still use that). At minimum,
  // the object must contain a __typename and any primary key fields required
  // to identify entities of that type. If you pass a query result object, be
  // sure that none of the primary key fields have been renamed by aliasing.
  // If you pass a Reference object, its __ref ID string will be returned.
  identify(object) {
    if (isReference(object))
      return object.__ref;
    try {
      return this.policies.identify(object)[0];
    } catch (e) {
      __DEV__ && invariant3.warn(e);
    }
  }
  evict(options) {
    if (!options.id) {
      if (hasOwn.call(options, "id")) {
        return false;
      }
      options = { ...options, id: "ROOT_QUERY" };
    }
    try {
      ++this.txCount;
      return this.optimisticData.evict(options, this.data);
    } finally {
      if (!--this.txCount && options.broadcast !== false) {
        this.broadcastWatches();
      }
    }
  }
  reset(options) {
    this.init();
    canonicalStringify.reset();
    if (options && options.discardWatches) {
      this.watches.forEach((watch) => this.maybeBroadcastWatch.forget(watch));
      this.watches.clear();
      forgetCache(this);
    } else {
      this.broadcastWatches();
    }
    return Promise.resolve();
  }
  removeOptimistic(idToRemove) {
    const newOptimisticData = this.optimisticData.removeLayer(idToRemove);
    if (newOptimisticData !== this.optimisticData) {
      this.optimisticData = newOptimisticData;
      this.broadcastWatches();
    }
  }
  txCount = 0;
  batch(options) {
    const { update, optimistic = true, removeOptimistic, onWatchUpdated } = options;
    let updateResult;
    const perform = (layer) => {
      const { data, optimisticData } = this;
      ++this.txCount;
      if (layer) {
        this.data = this.optimisticData = layer;
      }
      try {
        return updateResult = update(this);
      } finally {
        --this.txCount;
        this.data = data;
        this.optimisticData = optimisticData;
      }
    };
    const alreadyDirty = /* @__PURE__ */ new Set();
    if (onWatchUpdated && !this.txCount) {
      this.broadcastWatches({
        ...options,
        onWatchUpdated(watch) {
          alreadyDirty.add(watch);
          return false;
        }
      });
    }
    if (typeof optimistic === "string") {
      this.optimisticData = this.optimisticData.addLayer(optimistic, perform);
    } else if (optimistic === false) {
      perform(this.data);
    } else {
      perform();
    }
    if (typeof removeOptimistic === "string") {
      this.optimisticData = this.optimisticData.removeLayer(removeOptimistic);
    }
    if (onWatchUpdated && alreadyDirty.size) {
      this.broadcastWatches({
        ...options,
        onWatchUpdated(watch, diff) {
          const result = onWatchUpdated.call(this, watch, diff);
          if (result !== false) {
            alreadyDirty.delete(watch);
          }
          return result;
        }
      });
      if (alreadyDirty.size) {
        alreadyDirty.forEach((watch) => this.maybeBroadcastWatch.dirty(watch));
      }
    } else {
      this.broadcastWatches(options);
    }
    return updateResult;
  }
  performTransaction(update, optimisticId) {
    return this.batch({
      update,
      optimistic: optimisticId || optimisticId !== null
    });
  }
  transformDocument(document) {
    return this.addTypenameTransform.transformDocument(this.addFragmentsToDocument(document));
  }
  fragmentMatches(fragment, typename) {
    return this.policies.fragmentMatches(fragment, typename);
  }
  lookupFragment(fragmentName) {
    return this.config.fragments?.lookup(fragmentName) || null;
  }
  broadcastWatches(options) {
    if (!this.txCount) {
      this.watches.forEach((c) => this.maybeBroadcastWatch(c, options));
    }
  }
  addFragmentsToDocument(document) {
    const { fragments } = this.config;
    return fragments ? fragments.transform(document) : document;
  }
  // This method is wrapped by maybeBroadcastWatch, which is called by
  // broadcastWatches, so that we compute and broadcast results only when
  // the data that would be broadcast might have changed. It would be
  // simpler to check for changes after recomputing a result but before
  // broadcasting it, but this wrapping approach allows us to skip both
  // the recomputation and the broadcast, in most cases.
  broadcastWatch(c, options) {
    const { lastDiff } = c;
    const diff = this.diff(c);
    if (options) {
      if (c.optimistic && typeof options.optimistic === "string") {
        diff.fromOptimisticTransaction = true;
      }
      if (options.onWatchUpdated && options.onWatchUpdated.call(this, c, diff, lastDiff) === false) {
        return;
      }
    }
    if (!lastDiff || !equal(lastDiff.result, diff.result)) {
      c.callback(c.lastDiff = diff, lastDiff);
    }
  }
};
if (__DEV__) {
  InMemoryCache.prototype.getMemoryInternals = getInMemoryCacheMemoryInternals;
}

// node_modules/@apollo/client/errors/utils.js
function isBranded(error, name) {
  return typeof error === "object" && error !== null && error[Symbol.for("apollo.error")] === name;
}
function brand(error) {
  Object.defineProperty(error, Symbol.for("apollo.error"), {
    value: error.name,
    enumerable: false,
    writable: false,
    configurable: false
  });
}

// node_modules/@apollo/client/errors/CombinedProtocolErrors.js
function defaultFormatMessage(errors) {
  return errors.map((e) => e.message || "Error message not found.").join("\n");
}
var CombinedProtocolErrors = class _CombinedProtocolErrors extends Error {
  /**
   * A method that determines whether an error is a `CombinedProtocolErrors`
   * object. This method enables TypeScript to narrow the error type.
   *
   * @example
   *
   * ```ts
   * if (CombinedProtocolErrors.is(error)) {
   *   // TypeScript now knows `error` is a CombinedProtocolErrors object
   *   console.log(error.errors);
   * }
   * ```
   */
  static is(error) {
    return isBranded(error, "CombinedProtocolErrors");
  }
  /**
  * A function that formats the error message used for the error's `message`
  * property. Override this method to provide your own formatting.
  * 
  * @remarks
  * 
  * The `formatMessage` function is called by the `CombinedProtocolErrors`
  * constructor to provide a formatted message as the `message` property of the
  * `CombinedProtocolErrors` object. Follow the ["Providing a custom message
  * formatter"](https://www.apollographql.com/docs/react/api/errors/CombinedProtocolErrors#providing-a-custom-message-formatter) guide to learn how to modify the message format.
  * 
  * @param errors - The array of GraphQL errors returned from the server in the
  * `errors` field of the response.
  * @param options - Additional context that could be useful when formatting
  * the message.
  */
  static formatMessage = defaultFormatMessage;
  /**
  * The raw list of errors returned by the top-level `errors` field in the
  * multipart HTTP subscription response.
  */
  errors;
  constructor(protocolErrors) {
    super(_CombinedProtocolErrors.formatMessage(protocolErrors, {
      defaultFormatMessage
    }));
    this.name = "CombinedProtocolErrors";
    this.errors = protocolErrors;
    brand(this);
    Object.setPrototypeOf(this, _CombinedProtocolErrors.prototype);
  }
};

// node_modules/@apollo/client/errors/isErrorLike.js
function isErrorLike(error) {
  return error !== null && typeof error === "object" && typeof error.message === "string" && typeof error.name === "string" && (typeof error.stack === "string" || typeof error.stack === "undefined");
}

// node_modules/@apollo/client/errors/UnconventionalError.js
var UnconventionalError = class _UnconventionalError extends Error {
  /**
   * A method that determines whether an error is an `UnconventionalError`
   * object. This method enables TypeScript to narrow the error type.
   *
   * @example
   *
   * ```ts
   * if (UnconventionalError.is(error)) {
   *   // TypeScript now knows `error` is a UnconventionalError object
   *   console.log("What caused this?", error.cause);
   * }
   * ```
   */
  static is(error) {
    return isBranded(error, "UnconventionalError");
  }
  constructor(errorType) {
    super("An error of unexpected shape occurred.", { cause: errorType });
    this.name = "UnconventionalError";
    brand(this);
    Object.setPrototypeOf(this, _UnconventionalError.prototype);
  }
};

// node_modules/@apollo/client/errors/CombinedGraphQLErrors.js
function defaultFormatMessage2(errors) {
  return errors.filter((e) => e).map((e) => e.message || "Error message not found.").join("\n");
}
var CombinedGraphQLErrors = class _CombinedGraphQLErrors extends Error {
  /**
  * A method that determines whether an error is a `CombinedGraphQLErrors`
  * object. This method enables TypeScript to narrow the error type.
  * 
  * @example
  * 
  * ```ts
  * if (CombinedGraphQLErrors.is(error)) {
  *   // TypeScript now knows `error` is a `CombinedGraphQLErrors` object
  *   console.log(error.errors);
  * }
  * ```
  */
  static is(error) {
    return isBranded(error, "CombinedGraphQLErrors");
  }
  /**
  * A function that formats the error message used for the error's `message`
  * property. Override this method to provide your own formatting.
  * 
  * @remarks
  * 
  * The `formatMessage` function is called by the `CombinedGraphQLErrors`
  * constructor to provide a formatted message as the `message` property of the
  * `CombinedGraphQLErrors` object. Follow the ["Providing a custom message
  * formatter"](https://www.apollographql.com/docs/react/api/errors/CombinedGraphQLErrors#providing-a-custom-message-formatter) guide to learn how to modify the message format.
  * 
  * @param errors - The array of GraphQL errors returned from the server in
  * the `errors` field of the response.
  * @param options - Additional context that could be useful when formatting
  * the message.
  */
  static formatMessage = defaultFormatMessage2;
  /**
  * The raw list of GraphQL errors returned by the `errors` field in the GraphQL response.
  */
  errors;
  /**
  * Partial data returned in the `data` field of the GraphQL response.
  */
  data;
  /**
  * Extensions returned by the `extensions` field in the GraphQL response.
  */
  extensions;
  constructor(result, errors = result.errors || []) {
    super(_CombinedGraphQLErrors.formatMessage(errors, {
      result,
      defaultFormatMessage: defaultFormatMessage2
    }));
    this.errors = errors;
    this.data = result.data;
    this.extensions = result.extensions;
    this.name = "CombinedGraphQLErrors";
    brand(this);
    Object.setPrototypeOf(this, _CombinedGraphQLErrors.prototype);
  }
};

// node_modules/@apollo/client/errors/LinkError.js
var registry = /* @__PURE__ */ new WeakSet();
function registerLinkError(error) {
  registry.add(error);
}
var LinkError = {
  /**
   * A method that determines whether an error originated from the link chain.
   * `is` does not provide any type narrowing.
   *
   * @example
   *
   * ```ts
   * if (LinkError.is(error)) {
   *   // The error originated from the link chain
   *   console.log("Got network error:", error.message);
   * }
   * ```
   */
  is: (error) => registry.has(error)
};

// node_modules/@apollo/client/errors/LocalStateError.js
var LocalStateError = class _LocalStateError extends Error {
  /**
   * A method that determines whether an error is a `LocalStateError`
   * object. This method enables TypeScript to narrow the error type.
   *
   * @example
   *
   * ```ts
   * if (LocalStateError.is(error)) {
   *   // TypeScript now knows `error` is a LocalStateError object
   *   console.log(error.path);
   * }
   * ```
   */
  static is(error) {
    return isBranded(error, "LocalStateError");
  }
  /**
  * The path to the field that caused the error.
  */
  path;
  constructor(message, options = {}) {
    super(message, { cause: options.sourceError });
    this.name = "LocalStateError";
    this.path = options.path;
    brand(this);
    Object.setPrototypeOf(this, _LocalStateError.prototype);
  }
};

// node_modules/@apollo/client/errors/ServerError.js
var ServerError = class _ServerError extends Error {
  /**
   * A method that determines whether an error is a `ServerError` object. This
   * method enables TypeScript to narrow the error type.
   *
   * @example
   *
   * ```ts
   * if (ServerError.is(error)) {
   *   // TypeScript now knows `error` is a ServerError object
   *   console.log(error.errors);
   * }
   * ```
   */
  static is(error) {
    return isBranded(error, "ServerError");
  }
  /**
  * The raw [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object provided by the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
  */
  response;
  /**
  * The status code returned by the server in the response. This is provided as
  * a shortcut for `response.status`.
  */
  statusCode;
  /**
  * The raw response body text.
  */
  bodyText;
  constructor(message, options) {
    super(message);
    this.name = "ServerError";
    this.response = options.response;
    this.statusCode = options.response.status;
    this.bodyText = options.bodyText;
    brand(this);
    Object.setPrototypeOf(this, _ServerError.prototype);
  }
};

// node_modules/@apollo/client/errors/ServerParseError.js
var ServerParseError = class _ServerParseError extends Error {
  /**
   * A method that determines whether an error is a `ServerParseError`
   * object. This method enables TypeScript to narrow the error type.
   *
   * @example
   *
   * ```ts
   * if (ServerParseError.is(error)) {
   *   // TypeScript now knows `error` is a ServerParseError object
   *   console.log(error.statusCode);
   * }
   * ```
   */
  static is(error) {
    return isBranded(error, "ServerParseError");
  }
  /**
  * The raw [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object provided by the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
  */
  response;
  /**
  * The status code returned by the server in the response. This is provided
  * as a shortcut for `response.status`.
  */
  statusCode;
  /**
  * The raw response body text.
  */
  bodyText;
  constructor(originalParseError, options) {
    super(originalParseError instanceof Error ? originalParseError.message : "Could not parse server response", { cause: originalParseError });
    this.name = "ServerParseError";
    this.response = options.response;
    this.statusCode = options.response.status;
    this.bodyText = options.bodyText;
    brand(this);
    Object.setPrototypeOf(this, _ServerParseError.prototype);
  }
};

// node_modules/@apollo/client/errors/index.js
var PROTOCOL_ERRORS_SYMBOL = Symbol();
function graphQLResultHasProtocolErrors(result) {
  if ("extensions" in result) {
    return CombinedProtocolErrors.is(result.extensions[PROTOCOL_ERRORS_SYMBOL]);
  }
  return false;
}
function toErrorLike(error) {
  if (isErrorLike(error)) {
    return error;
  }
  if (typeof error === "string") {
    return new Error(error, { cause: error });
  }
  return new UnconventionalError(error);
}

// node_modules/@apollo/client/core/networkStatus.js
var NetworkStatus;
(function(NetworkStatus2) {
  NetworkStatus2[NetworkStatus2["loading"] = 1] = "loading";
  NetworkStatus2[NetworkStatus2["setVariables"] = 2] = "setVariables";
  NetworkStatus2[NetworkStatus2["fetchMore"] = 3] = "fetchMore";
  NetworkStatus2[NetworkStatus2["refetch"] = 4] = "refetch";
  NetworkStatus2[NetworkStatus2["poll"] = 6] = "poll";
  NetworkStatus2[NetworkStatus2["ready"] = 7] = "ready";
  NetworkStatus2[NetworkStatus2["error"] = 8] = "error";
  NetworkStatus2[NetworkStatus2["streaming"] = 9] = "streaming";
})(NetworkStatus || (NetworkStatus = {}));

// node_modules/@apollo/client/core/ObservableQuery.js
var { assign, hasOwnProperty: hasOwnProperty6 } = Object;
var uninitialized = {
  loading: true,
  networkStatus: NetworkStatus.loading,
  data: void 0,
  dataState: "empty",
  partial: true
};
var empty3 = {
  loading: false,
  networkStatus: NetworkStatus.ready,
  data: void 0,
  dataState: "empty",
  partial: true
};
var ObservableQuery = class {
  options;
  queryName;
  /**
  * @internal will be read and written from `QueryInfo`
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  _lastWrite;
  // The `query` computed property will always reflect the document transformed
  // by the last run query. `this.options.query` will always reflect the raw
  // untransformed query to ensure document transforms with runtime conditionals
  // are run on the original document.
  get query() {
    return this.lastQuery;
  }
  /**
   * An object containing the variables that were provided for the query.
   */
  get variables() {
    return this.options.variables;
  }
  unsubscribeFromCache;
  input;
  subject;
  isTornDown;
  queryManager;
  subscriptions = /* @__PURE__ */ new Set();
  /**
   * If an `ObservableQuery` is created with a `network-only` fetch policy,
   * it should actually start receiving cache updates, but not before it has
   * received the first result from the network.
   */
  waitForNetworkResult;
  lastQuery;
  linkSubscription;
  pollingInfo;
  get networkStatus() {
    return this.subject.getValue().result.networkStatus;
  }
  constructor({ queryManager, options, transformedQuery = queryManager.transform(options.query) }) {
    this.queryManager = queryManager;
    this.waitForNetworkResult = options.fetchPolicy === "network-only";
    this.isTornDown = false;
    this.subscribeToMore = this.subscribeToMore.bind(this);
    this.maskResult = this.maskResult.bind(this);
    const { watchQuery: { fetchPolicy: defaultFetchPolicy = "cache-first" } = {} } = queryManager.defaultOptions;
    const {
      fetchPolicy = defaultFetchPolicy,
      // Make sure we don't store "standby" as the initialFetchPolicy.
      initialFetchPolicy = fetchPolicy === "standby" ? defaultFetchPolicy : fetchPolicy
    } = options;
    this.lastQuery = transformedQuery;
    this.options = {
      ...options,
      // Remember the initial options.fetchPolicy so we can revert back to this
      // policy when variables change. This information can also be specified
      // (or overridden) by providing options.initialFetchPolicy explicitly.
      initialFetchPolicy,
      // This ensures this.options.fetchPolicy always has a string value, in
      // case options.fetchPolicy was not provided.
      fetchPolicy,
      variables: this.getVariablesWithDefaults(options.variables)
    };
    this.initializeObservablesQueue();
    this["@@observable"] = () => this;
    if (Symbol.observable) {
      this[Symbol.observable] = () => this;
    }
    const opDef = getOperationDefinition(this.query);
    this.queryName = opDef && opDef.name && opDef.name.value;
  }
  initializeObservablesQueue() {
    this.subject = new BehaviorSubject({
      query: this.query,
      variables: this.variables,
      result: uninitialized,
      meta: {}
    });
    const observable2 = this.subject.pipe(tap({
      subscribe: () => {
        if (!this.subject.observed) {
          this.reobserve();
          setTimeout(() => this.updatePolling());
        }
      },
      unsubscribe: () => {
        if (!this.subject.observed) {
          this.tearDownQuery();
        }
      }
    }), filterMap(({ query, variables, result: current, meta }, context2) => {
      const { shouldEmit } = meta;
      if (current === uninitialized) {
        context2.previous = void 0;
        context2.previousVariables = void 0;
      }
      if (this.options.fetchPolicy === "standby" || shouldEmit === 2)
        return;
      if (shouldEmit === 1)
        return emit();
      const { previous, previousVariables } = context2;
      if (previous) {
        const documentInfo = this.queryManager.getDocumentInfo(query);
        const dataMasking = this.queryManager.dataMasking;
        const maskedQuery = dataMasking ? documentInfo.nonReactiveQuery : query;
        const resultIsEqual = dataMasking || documentInfo.hasNonreactiveDirective ? equalByQuery(maskedQuery, previous, current, variables) : equal(previous, current);
        if (resultIsEqual && equal(previousVariables, variables)) {
          return;
        }
      }
      if (shouldEmit === 3 && (!this.options.notifyOnNetworkStatusChange || equal(previous, current))) {
        return;
      }
      return emit();
      function emit() {
        context2.previous = current;
        context2.previousVariables = variables;
        return current;
      }
    }, () => ({})));
    this.pipe = observable2.pipe.bind(observable2);
    this.subscribe = observable2.subscribe.bind(observable2);
    this.input = new Subject();
    this.input.complete = () => {
    };
    this.input.pipe(this.operator).subscribe(this.subject);
  }
  // We can't use Observable['subscribe'] here as the type as it conflicts with
  // the ability to infer T from Subscribable<T>. This limits the surface area
  // to the non-deprecated signature which works properly with type inference.
  /**
   * Subscribes to the `ObservableQuery`.
   * @param observerOrNext - Either an RxJS `Observer` with some or all callback methods,
   * or the `next` handler that is called for each value emitted from the subscribed Observable.
   * @returns A subscription reference to the registered handlers.
   */
  subscribe;
  /**
   * Used to stitch together functional operators into a chain.
   *
   * @example
   *
   * ```ts
   * import { filter, map } from 'rxjs';
   *
   * observableQuery
   *   .pipe(
   *     filter(...),
   *     map(...),
   *   )
   *   .subscribe(x => console.log(x));
   * ```
   *
   * @returns The Observable result of all the operators having been called
   * in the order they were passed in.
   */
  pipe;
  [Symbol.observable];
  ["@@observable"];
  /**
  * @internal
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  getCacheDiff({ optimistic = true } = {}) {
    return this.queryManager.cache.diff({
      query: this.query,
      variables: this.variables,
      returnPartialData: true,
      optimistic
    });
  }
  getInitialResult(initialFetchPolicy) {
    const fetchPolicy = this.queryManager.prioritizeCacheValues ? "cache-first" : initialFetchPolicy || this.options.fetchPolicy;
    const cacheResult = () => {
      const diff = this.getCacheDiff();
      const data = this.options.returnPartialData || diff.complete ? diff.result ?? void 0 : void 0;
      return this.maskResult({
        data,
        dataState: diff.complete ? "complete" : data === void 0 ? "empty" : "partial",
        loading: !diff.complete,
        networkStatus: diff.complete ? NetworkStatus.ready : NetworkStatus.loading,
        partial: !diff.complete
      });
    };
    switch (fetchPolicy) {
      case "cache-only": {
        return {
          ...cacheResult(),
          loading: false,
          networkStatus: NetworkStatus.ready
        };
      }
      case "cache-first":
        return cacheResult();
      case "cache-and-network":
        return {
          ...cacheResult(),
          loading: true,
          networkStatus: NetworkStatus.loading
        };
      case "standby":
        return empty3;
      default:
        return uninitialized;
    }
  }
  resubscribeCache() {
    const { variables, fetchPolicy } = this.options;
    const query = this.query;
    const shouldUnsubscribe = fetchPolicy === "standby" || fetchPolicy === "no-cache" || this.waitForNetworkResult;
    const shouldResubscribe = !isEqualQuery({ query, variables }, this.unsubscribeFromCache) && !this.waitForNetworkResult;
    if (shouldUnsubscribe || shouldResubscribe) {
      this.unsubscribeFromCache?.();
    }
    if (shouldUnsubscribe || !shouldResubscribe) {
      return;
    }
    const watch = {
      query,
      variables,
      optimistic: true,
      watcher: this,
      callback: (diff) => {
        const info = this.queryManager.getDocumentInfo(query);
        if (info.hasClientExports || info.hasForcedResolvers) {
          watch.lastDiff = void 0;
        }
        if (watch.lastOwnDiff === diff) {
          return;
        }
        const { result: previousResult } = this.subject.getValue();
        if (!diff.complete && // If we are trying to deliver an incomplete cache result, we avoid
        // reporting it if the query has errored, otherwise we let the broadcast try
        // and repair the partial result by refetching the query. This check avoids
        // a situation where a query that errors and another succeeds with
        // overlapping data does not report the partial data result to the errored
        // query.
        //
        // See https://github.com/apollographql/apollo-client/issues/11400 for more
        // information on this issue.
        (previousResult.error || // Prevent to schedule a notify directly after the `ObservableQuery`
        // has been `reset` (which will set the `previousResult` to `uninitialized` or `empty`)
        // as in those cases, `resetCache` will manually call `refetch` with more intentional timing.
        previousResult === uninitialized || previousResult === empty3)) {
          return;
        }
        if (!equal(previousResult.data, diff.result)) {
          this.scheduleNotify();
        }
      }
    };
    const cancelWatch = this.queryManager.cache.watch(watch);
    this.unsubscribeFromCache = Object.assign(() => {
      this.unsubscribeFromCache = void 0;
      cancelWatch();
    }, { query, variables });
  }
  stableLastResult;
  getCurrentResult() {
    const { result: current } = this.subject.getValue();
    let value = (
      // if the `current` result is in an error state, we will always return that
      // error state, even if we have no observers
      current.networkStatus === NetworkStatus.error || // if we have observers, we are watching the cache and
      // this.subject.getValue() will always be up to date
      this.hasObservers() || // if we are using a `no-cache` fetch policy in which case this
      // `ObservableQuery` cannot have been updated from the outside - in
      // that case, we prefer to keep the current value
      this.options.fetchPolicy === "no-cache" ? current : this.getInitialResult()
    );
    if (value === uninitialized) {
      value = this.getInitialResult();
    }
    if (!equal(this.stableLastResult, value)) {
      this.stableLastResult = value;
    }
    return this.stableLastResult;
  }
  /**
   * Update the variables of this observable query, and fetch the new results.
   * This method should be preferred over `setVariables` in most use cases.
   *
   * Returns a `ResultPromise` with an additional `.retain()` method. Calling
   * `.retain()` keeps the network operation running even if the `ObservableQuery`
   * no longer requires the result.
   *
   * Note: `refetch()` guarantees that a value will be emitted from the
   * observable, even if the result is deep equal to the previous value.
   *
   * @param variables - The new set of variables. If there are missing variables,
   * the previous values of those variables will be used.
   */
  refetch(variables) {
    const { fetchPolicy } = this.options;
    const reobserveOptions = {
      // Always disable polling for refetches.
      pollInterval: 0
    };
    if (fetchPolicy === "no-cache") {
      reobserveOptions.fetchPolicy = "no-cache";
    } else {
      reobserveOptions.fetchPolicy = "network-only";
    }
    if (__DEV__ && variables && hasOwnProperty6.call(variables, "variables")) {
      const queryDef = getQueryDefinition(this.query);
      const vars = queryDef.variableDefinitions;
      if (!vars || !vars.some((v) => v.variable.name.value === "variables")) {
        __DEV__ && invariant3.warn(77, variables, queryDef.name?.value || queryDef);
      }
    }
    if (variables && !equal(this.variables, variables)) {
      reobserveOptions.variables = this.options.variables = this.getVariablesWithDefaults({ ...this.variables, ...variables });
    }
    this._lastWrite = void 0;
    return this._reobserve(reobserveOptions, {
      newNetworkStatus: NetworkStatus.refetch
    });
  }
  fetchMore({ query, variables, context: context2, errorPolicy, updateQuery }) {
    invariant3(
      this.options.fetchPolicy !== "cache-only",
      78,
      getOperationName(this.query, "(anonymous)")
    );
    const combinedOptions = {
      ...compact(this.options, { errorPolicy: "none" }, {
        query,
        context: context2,
        errorPolicy
      }),
      variables: query ? variables : {
        ...this.variables,
        ...variables
      },
      // The fetchMore request goes immediately to the network and does
      // not automatically write its result to the cache (hence no-cache
      // instead of network-only), because we allow the caller of
      // fetchMore to provide an updateQuery callback that determines how
      // the data gets written to the cache.
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: this.options.notifyOnNetworkStatusChange
    };
    combinedOptions.query = this.transformDocument(combinedOptions.query);
    this.lastQuery = query ? this.transformDocument(this.options.query) : combinedOptions.query;
    let wasUpdated = false;
    const isCached = this.options.fetchPolicy !== "no-cache";
    if (!isCached) {
      invariant3(updateQuery, 79);
    }
    const { finalize: finalize2, pushNotification } = this.pushOperation(NetworkStatus.fetchMore);
    pushNotification({
      source: "newNetworkStatus",
      kind: "N",
      value: {}
    }, {
      shouldEmit: 3
      /* EmitBehavior.networkStatusChange */
    });
    return this.queryManager.fetchQuery(combinedOptions, NetworkStatus.fetchMore).then((fetchMoreResult) => {
      finalize2();
      if (isCached) {
        this.queryManager.cache.batch({
          update: (cache) => {
            if (updateQuery) {
              cache.updateQuery({
                query: this.query,
                variables: this.variables,
                returnPartialData: true,
                optimistic: false
              }, (previous) => updateQuery(previous, {
                fetchMoreResult: fetchMoreResult.data,
                variables: combinedOptions.variables
              }));
            } else {
              cache.writeQuery({
                query: combinedOptions.query,
                variables: combinedOptions.variables,
                data: fetchMoreResult.data
              });
            }
          },
          onWatchUpdated: (watch) => {
            if (watch.watcher === this) {
              wasUpdated = true;
            }
          }
        });
      } else {
        const lastResult = this.getCurrentResult();
        const data = updateQuery(lastResult.data, {
          fetchMoreResult: fetchMoreResult.data,
          variables: combinedOptions.variables
        });
        pushNotification({
          kind: "N",
          value: {
            ...lastResult,
            networkStatus: NetworkStatus.ready,
            // will be overwritten anyways, just here for types sake
            loading: false,
            data,
            dataState: lastResult.dataState === "streaming" ? "streaming" : "complete"
          },
          source: "network"
        });
      }
      return this.maskResult(fetchMoreResult);
    }).finally(() => {
      finalize2();
      if (isCached && !wasUpdated) {
        pushNotification({
          kind: "N",
          source: "newNetworkStatus",
          value: {}
        }, {
          shouldEmit: 1
          /* EmitBehavior.force */
        });
      }
    });
  }
  // XXX the subscription variables are separate from the query variables.
  // if you want to update subscription variables, right now you have to do that separately,
  // and you can only do it by stopping the subscription and then subscribing again with new variables.
  /**
   * A function that enables you to execute a [subscription](https://www.apollographql.com/docs/react/data/subscriptions/), usually to subscribe to specific fields that were included in the query.
   *
   * This function returns _another_ function that you can call to terminate the subscription.
   */
  subscribeToMore(options) {
    const subscription = this.queryManager.startGraphQLSubscription({
      query: options.document,
      variables: options.variables,
      context: options.context
    }).subscribe({
      next: (subscriptionData) => {
        const { updateQuery, onError } = options;
        const { error } = subscriptionData;
        if (error) {
          if (onError) {
            onError(error);
          } else {
            invariant3.error(80, error);
          }
          return;
        }
        if (updateQuery) {
          this.updateQuery((previous, updateOptions) => updateQuery(previous, {
            subscriptionData,
            ...updateOptions
          }));
        }
      }
    });
    this.subscriptions.add(subscription);
    return () => {
      if (this.subscriptions.delete(subscription)) {
        subscription.unsubscribe();
      }
    };
  }
  /**
  * @internal
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  applyOptions(newOptions) {
    const mergedOptions = compact(this.options, newOptions || {});
    assign(this.options, mergedOptions);
    this.updatePolling();
  }
  /**
   * Update the variables of this observable query, and fetch the new results
   * if they've changed. Most users should prefer `refetch` instead of
   * `setVariables` in order to to be properly notified of results even when
   * they come from the cache.
   *
   * Note: `setVariables()` guarantees that a value will be emitted from the
   * observable, even if the result is deeply equal to the previous value.
   *
   * Note: the promise will resolve with the last emitted result
   * when either the variables match the current variables or there
   * are no subscribers to the query.
   *
   * @param variables - The new set of variables. If there are missing variables,
   * the previous values of those variables will be used.
   */
  async setVariables(variables) {
    variables = this.getVariablesWithDefaults(variables);
    if (equal(this.variables, variables)) {
      return toQueryResult(this.getCurrentResult());
    }
    this.options.variables = variables;
    if (!this.hasObservers()) {
      return toQueryResult(this.getCurrentResult());
    }
    return this._reobserve({
      // Reset options.fetchPolicy to its original value.
      fetchPolicy: this.options.initialFetchPolicy,
      variables
    }, { newNetworkStatus: NetworkStatus.setVariables });
  }
  /**
   * A function that enables you to update the query's cached result without executing a followup GraphQL operation.
   *
   * See [using updateQuery and updateFragment](https://www.apollographql.com/docs/react/caching/cache-interaction/#using-updatequery-and-updatefragment) for additional information.
   */
  updateQuery(mapFn) {
    const { queryManager } = this;
    const { result, complete } = this.getCacheDiff({ optimistic: false });
    const newResult = mapFn(result, {
      variables: this.variables,
      complete: !!complete,
      previousData: result
    });
    if (newResult) {
      queryManager.cache.writeQuery({
        query: this.options.query,
        data: newResult,
        variables: this.variables
      });
      queryManager.broadcastQueries();
    }
  }
  /**
   * A function that instructs the query to begin re-executing at a specified interval (in milliseconds).
   */
  startPolling(pollInterval) {
    this.options.pollInterval = pollInterval;
    this.updatePolling();
  }
  /**
   * A function that instructs the query to stop polling after a previous call to `startPolling`.
   */
  stopPolling() {
    this.options.pollInterval = 0;
    this.updatePolling();
  }
  // Update options.fetchPolicy according to options.nextFetchPolicy.
  applyNextFetchPolicy(reason, options) {
    if (options.nextFetchPolicy) {
      const { fetchPolicy = "cache-first", initialFetchPolicy = fetchPolicy } = options;
      if (fetchPolicy === "standby") {
      } else if (typeof options.nextFetchPolicy === "function") {
        options.fetchPolicy = options.nextFetchPolicy.call(options, fetchPolicy, { reason, options, observable: this, initialFetchPolicy });
      } else if (reason === "variables-changed") {
        options.fetchPolicy = initialFetchPolicy;
      } else {
        options.fetchPolicy = options.nextFetchPolicy;
      }
    }
    return options.fetchPolicy;
  }
  fetch(options, networkStatus, fetchQuery, operator) {
    const initialFetchPolicy = this.options.fetchPolicy;
    options.context ??= {};
    let synchronouslyEmitted = false;
    const onCacheHit = () => {
      synchronouslyEmitted = true;
    };
    const fetchQueryOperator = (
      // we cannot use `tap` here, since it allows only for a "before subscription"
      // hook with `subscribe` and we care for "directly before and after subscription"
      (source) => new Observable((subscriber) => {
        try {
          return source.subscribe({
            next(value) {
              synchronouslyEmitted = true;
              subscriber.next(value);
            },
            error: (error) => subscriber.error(error),
            complete: () => subscriber.complete()
          });
        } finally {
          if (!synchronouslyEmitted) {
            operation.override = networkStatus;
            this.input.next({
              kind: "N",
              source: "newNetworkStatus",
              value: {
                resetError: true
              },
              query,
              variables,
              meta: {
                shouldEmit: 3,
                /*
                 * The moment this notification is emitted, `nextFetchPolicy`
                 * might already have switched from a `network-only` to a
                 * `cache-something` policy, so we want to ensure that the
                 * loading state emit doesn't accidentally read from the cache
                 * in those cases.
                 */
                fetchPolicy: initialFetchPolicy
              }
            });
          }
        }
      })
    );
    let { observable: observable2, fromLink } = this.queryManager.fetchObservableWithInfo(options, {
      networkStatus,
      query: fetchQuery,
      onCacheHit,
      fetchQueryOperator,
      observableQuery: this
    });
    const { query, variables } = this;
    const operation = {
      abort: () => {
        subscription.unsubscribe();
      },
      query,
      variables
    };
    this.activeOperations.add(operation);
    let forceFirstValueEmit = networkStatus == NetworkStatus.refetch || networkStatus == NetworkStatus.setVariables;
    observable2 = observable2.pipe(operator, share());
    const subscription = observable2.pipe(tap({
      next: (notification) => {
        if (notification.source === "newNetworkStatus" || notification.kind === "N" && notification.value.loading) {
          operation.override = networkStatus;
        } else {
          delete operation.override;
        }
      },
      finalize: () => this.activeOperations.delete(operation)
    })).subscribe({
      next: (value) => {
        const meta = {};
        if (forceFirstValueEmit && value.kind === "N" && "loading" in value.value && !value.value.loading) {
          forceFirstValueEmit = false;
          meta.shouldEmit = 1;
        }
        this.input.next({ ...value, query, variables, meta });
      }
    });
    return { fromLink, subscription, observable: observable2 };
  }
  // Turns polling on or off based on this.options.pollInterval.
  didWarnCacheOnlyPolling = false;
  updatePolling() {
    if (this.queryManager.ssrMode) {
      return;
    }
    const { pollingInfo, options: { fetchPolicy, pollInterval } } = this;
    if (!pollInterval || !this.hasObservers() || fetchPolicy === "cache-only") {
      if (__DEV__) {
        if (!this.didWarnCacheOnlyPolling && pollInterval && fetchPolicy === "cache-only") {
          __DEV__ && invariant3.warn(81, getOperationName(this.query, "(anonymous)"));
          this.didWarnCacheOnlyPolling = true;
        }
      }
      this.cancelPolling();
      return;
    }
    if (pollingInfo?.interval === pollInterval) {
      return;
    }
    const info = pollingInfo || (this.pollingInfo = {});
    info.interval = pollInterval;
    const maybeFetch = () => {
      if (this.pollingInfo) {
        if (!isNetworkRequestInFlight(this.networkStatus) && !this.options.skipPollAttempt?.()) {
          this._reobserve({
            // Most fetchPolicy options don't make sense to use in a polling context, as
            // users wouldn't want to be polling the cache directly. However, network-only and
            // no-cache are both useful for when the user wants to control whether or not the
            // polled results are written to the cache.
            fetchPolicy: this.options.initialFetchPolicy === "no-cache" ? "no-cache" : "network-only"
          }, {
            newNetworkStatus: NetworkStatus.poll
          }).then(poll, poll);
        } else {
          poll();
        }
      }
    };
    const poll = () => {
      const info2 = this.pollingInfo;
      if (info2) {
        clearTimeout(info2.timeout);
        info2.timeout = setTimeout(maybeFetch, info2.interval);
      }
    };
    poll();
  }
  // This differs from stopPolling in that it does not set pollInterval to 0
  cancelPolling() {
    if (this.pollingInfo) {
      clearTimeout(this.pollingInfo.timeout);
      delete this.pollingInfo;
    }
  }
  /**
   * Reevaluate the query, optionally against new options. New options will be
   * merged with the current options when given.
   *
   * Note: `variables` can be reset back to their defaults (typically empty) by calling `reobserve` with
   * `variables: undefined`.
   */
  reobserve(newOptions) {
    return this._reobserve(newOptions);
  }
  _reobserve(newOptions, internalOptions) {
    this.isTornDown = false;
    let { newNetworkStatus } = internalOptions || {};
    this.queryManager.obsQueries.add(this);
    const useDisposableObservable = (
      // Refetching uses a disposable Observable to allow refetches using different
      // options, without permanently altering the options of the
      // original ObservableQuery.
      newNetworkStatus === NetworkStatus.refetch || // Polling uses a disposable Observable so the polling options (which force
      // fetchPolicy to be "network-only" or "no-cache") won't override the original options.
      newNetworkStatus === NetworkStatus.poll
    );
    const oldVariables = this.variables;
    const oldFetchPolicy = this.options.fetchPolicy;
    const mergedOptions = compact(this.options, newOptions || {});
    const options = useDisposableObservable ? (
      // Disposable Observable fetches receive a shallow copy of this.options
      // (merged with newOptions), leaving this.options unmodified.
      mergedOptions
    ) : assign(this.options, mergedOptions);
    const query = this.transformDocument(options.query);
    this.lastQuery = query;
    if (newOptions && "variables" in newOptions) {
      options.variables = this.getVariablesWithDefaults(newOptions.variables);
    }
    if (!useDisposableObservable) {
      this.updatePolling();
      if (newOptions && newOptions.variables && !equal(newOptions.variables, oldVariables) && // Don't mess with the fetchPolicy if it's currently "standby".
      options.fetchPolicy !== "standby" && // If we're changing the fetchPolicy anyway, don't try to change it here
      // using applyNextFetchPolicy. The explicit options.fetchPolicy wins.
      (options.fetchPolicy === oldFetchPolicy || // A `nextFetchPolicy` function has even higher priority, though,
      // so in that case `applyNextFetchPolicy` must be called.
      typeof options.nextFetchPolicy === "function")) {
        this.applyNextFetchPolicy("variables-changed", options);
        if (newNetworkStatus === void 0) {
          newNetworkStatus = NetworkStatus.setVariables;
        }
      }
    }
    const oldNetworkStatus = this.networkStatus;
    if (!newNetworkStatus) {
      newNetworkStatus = NetworkStatus.loading;
      if (oldNetworkStatus !== NetworkStatus.loading && newOptions?.variables && !equal(newOptions.variables, oldVariables)) {
        newNetworkStatus = NetworkStatus.setVariables;
      }
      if (options.fetchPolicy === "standby") {
        newNetworkStatus = NetworkStatus.ready;
      }
    }
    if (options.fetchPolicy === "standby") {
      this.cancelPolling();
    }
    this.resubscribeCache();
    const { promise, operator: promiseOperator } = getTrackingOperatorPromise(
      (value) => {
        switch (value.kind) {
          case "E":
            throw value.error;
          case "N":
            if (value.source !== "newNetworkStatus" && !value.value.loading)
              return value.value;
        }
      },
      // This default value should only be used when using a `fetchPolicy` of
      // `standby` since that fetch policy completes without emitting a
      // result. Since we are converting this to a QueryResult type, we
      // omit the extra fields from ApolloQueryResult in the default value.
      options.fetchPolicy === "standby" ? { data: void 0 } : void 0
    );
    const { subscription, observable: observable2, fromLink } = this.fetch(options, newNetworkStatus, query, promiseOperator);
    if (!useDisposableObservable && (fromLink || !this.linkSubscription)) {
      if (this.linkSubscription) {
        this.linkSubscription.unsubscribe();
      }
      this.linkSubscription = subscription;
    }
    const ret = Object.assign(preventUnhandledRejection(promise.then((result) => toQueryResult(this.maskResult(result))).finally(() => {
      if (!this.hasObservers() && this.activeOperations.size === 0) {
        this.tearDownQuery();
      }
    })), {
      retain: () => {
        const subscription2 = observable2.subscribe({});
        const unsubscribe = () => subscription2.unsubscribe();
        promise.then(unsubscribe, unsubscribe);
        return ret;
      }
    });
    return ret;
  }
  hasObservers() {
    return this.subject.observed;
  }
  /**
   * Tears down the `ObservableQuery` and stops all active operations by sending a `complete` notification.
   */
  stop() {
    this.subject.complete();
    this.initializeObservablesQueue();
    this.tearDownQuery();
  }
  tearDownQuery() {
    if (this.isTornDown)
      return;
    this.resetNotifications();
    this.unsubscribeFromCache?.();
    if (this.linkSubscription) {
      this.linkSubscription.unsubscribe();
      delete this.linkSubscription;
    }
    this.stopPolling();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.queryManager.obsQueries.delete(this);
    this.isTornDown = true;
    this.abortActiveOperations();
    this._lastWrite = void 0;
  }
  transformDocument(document) {
    return this.queryManager.transform(document);
  }
  maskResult(result) {
    const masked = this.queryManager.maskOperation({
      document: this.query,
      data: result.data,
      fetchPolicy: this.options.fetchPolicy,
      cause: this
    });
    return masked === result.data ? result : { ...result, data: masked };
  }
  dirty = false;
  notifyTimeout;
  /**
  * @internal
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  resetNotifications() {
    if (this.notifyTimeout) {
      clearTimeout(this.notifyTimeout);
      this.notifyTimeout = void 0;
    }
    this.dirty = false;
  }
  /**
  * @internal
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  scheduleNotify() {
    if (this.dirty)
      return;
    this.dirty = true;
    if (!this.notifyTimeout) {
      this.notifyTimeout = setTimeout(() => this.notify(true), 0);
    }
  }
  /**
  * @internal
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  notify(scheduled2 = false) {
    if (!scheduled2) {
      const info = this.queryManager.getDocumentInfo(this.query);
      if (info.hasClientExports || info.hasForcedResolvers) {
        return;
      }
    }
    const { dirty } = this;
    this.resetNotifications();
    if (dirty && (this.options.fetchPolicy == "cache-only" || this.options.fetchPolicy == "cache-and-network" || !this.activeOperations.size)) {
      const diff = this.getCacheDiff();
      if (
        // `fromOptimisticTransaction` is not avaiable through the `cache.diff`
        // code path, so we need to check it this way
        equal(diff.result, this.getCacheDiff({ optimistic: false }).result)
      ) {
        this.reobserveCacheFirst();
      } else {
        this.input.next({
          kind: "N",
          value: {
            data: diff.result,
            dataState: diff.complete ? "complete" : diff.result ? "partial" : "empty",
            networkStatus: NetworkStatus.ready,
            loading: false,
            error: void 0,
            partial: !diff.complete
          },
          source: "cache",
          query: this.query,
          variables: this.variables,
          meta: {}
        });
      }
    }
  }
  activeOperations = /* @__PURE__ */ new Set();
  pushOperation(networkStatus) {
    let aborted = false;
    const { query, variables } = this;
    const finalize2 = () => {
      this.activeOperations.delete(operation);
    };
    const operation = {
      override: networkStatus,
      abort: () => {
        aborted = true;
        finalize2();
      },
      query,
      variables
    };
    this.activeOperations.add(operation);
    return {
      finalize: finalize2,
      pushNotification: (notification, additionalMeta) => {
        if (!aborted) {
          this.input.next({
            ...notification,
            query,
            variables,
            meta: { ...additionalMeta }
          });
        }
      }
    };
  }
  calculateNetworkStatus(baseNetworkStatus) {
    if (baseNetworkStatus === NetworkStatus.streaming) {
      return baseNetworkStatus;
    }
    const operation = Array.from(this.activeOperations.values()).findLast((operation2) => isEqualQuery(operation2, this) && operation2.override !== void 0);
    return operation?.override ?? baseNetworkStatus;
  }
  abortActiveOperations() {
    this.activeOperations.forEach((operation) => operation.abort());
  }
  /**
  * @internal
  * Called from `clearStore`.
  *
  * - resets the query to its initial state
  * - cancels all active operations and their subscriptions
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  reset() {
    const resetToEmpty = this.options.fetchPolicy === "cache-only";
    this.setResult(resetToEmpty ? empty3 : uninitialized, {
      shouldEmit: resetToEmpty ? 1 : 2
    });
    this.abortActiveOperations();
  }
  /**
  * @internal
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  setResult(result, additionalMeta) {
    this.input.next({
      source: "setResult",
      kind: "N",
      value: result,
      query: this.query,
      variables: this.variables,
      meta: { ...additionalMeta }
    });
  }
  operator = filterMap((notification) => {
    const { query, variables, meta } = notification;
    if (notification.source === "setResult") {
      return { query, variables, result: notification.value, meta };
    }
    if (notification.kind === "C" || !isEqualQuery(notification, this)) {
      return;
    }
    let result;
    const previous = this.subject.getValue();
    if (notification.source === "cache") {
      result = notification.value;
      if (result.networkStatus === NetworkStatus.ready && result.partial && (!this.options.returnPartialData || previous.result.networkStatus === NetworkStatus.error) && this.options.fetchPolicy !== "cache-only") {
        return;
      }
    } else if (notification.source === "network") {
      if (this.waitForNetworkResult) {
        this.waitForNetworkResult = false;
        this.resubscribeCache();
      }
      result = notification.kind === "E" ? {
        ...isEqualQuery(previous, notification) ? previous.result : { data: void 0, dataState: "empty", partial: true },
        error: notification.error,
        networkStatus: NetworkStatus.error,
        loading: false
      } : notification.value;
      if (notification.kind === "E" && result.dataState === "streaming") {
        result.dataState = "complete";
      }
      if (result.error) {
        meta.shouldEmit = 1;
      }
    } else if (notification.source === "newNetworkStatus") {
      const baseResult = isEqualQuery(previous, notification) ? previous.result : this.getInitialResult(meta.fetchPolicy);
      const { resetError } = notification.value;
      const error = resetError ? void 0 : baseResult.error;
      const networkStatus = error ? NetworkStatus.error : NetworkStatus.ready;
      result = {
        ...baseResult,
        error,
        networkStatus
      };
    }
    invariant3(result);
    if (!result.error)
      delete result.error;
    result.networkStatus = this.calculateNetworkStatus(result.networkStatus);
    result.loading = isNetworkRequestInFlight(result.networkStatus);
    result = this.maskResult(result);
    return { query, variables, result, meta };
  });
  // Reobserve with fetchPolicy effectively set to "cache-first", triggering
  // delivery of any new data from the cache, possibly falling back to the network
  // if any cache data are missing. This allows _complete_ cache results to be
  // delivered without also kicking off unnecessary network requests when
  // this.options.fetchPolicy is "cache-and-network" or "network-only". When
  // this.options.fetchPolicy is any other policy ("cache-first", "cache-only",
  // "standby", or "no-cache"), we call this.reobserve() as usual.
  reobserveCacheFirst() {
    const { fetchPolicy, nextFetchPolicy } = this.options;
    if (fetchPolicy === "cache-and-network" || fetchPolicy === "network-only") {
      this.reobserve({
        fetchPolicy: "cache-first",
        // Use a temporary nextFetchPolicy function that replaces itself with the
        // previous nextFetchPolicy value and returns the original fetchPolicy.
        nextFetchPolicy(currentFetchPolicy, context2) {
          this.nextFetchPolicy = nextFetchPolicy;
          if (typeof this.nextFetchPolicy === "function") {
            return this.nextFetchPolicy(currentFetchPolicy, context2);
          }
          return fetchPolicy;
        }
      });
    } else {
      this.reobserve();
    }
  }
  getVariablesWithDefaults(variables) {
    return this.queryManager.getVariables(this.query, variables);
  }
};
function logMissingFieldErrors(missing) {
  if (__DEV__ && missing) {
    __DEV__ && invariant3.debug(82, missing);
  }
}
function isEqualQuery(a, b) {
  return !!(a && b && a.query === b.query && equal(a.variables, b.variables));
}
function getTrackingOperatorPromise(filterMapCb, defaultValue) {
  let lastValue = defaultValue, resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const operator = tap({
    next(value) {
      try {
        const newValue = filterMapCb(value);
        if (newValue !== void 0) {
          lastValue = newValue;
        }
      } catch (error) {
        reject(error);
      }
    },
    finalize: () => {
      if (lastValue) {
        resolve(lastValue);
      } else {
        const message = "The operation was aborted.";
        const name = "AbortError";
        reject(typeof DOMException !== "undefined" ? new DOMException(message, name) : Object.assign(new Error(message), { name }));
      }
    }
  });
  return { promise, operator };
}

// node_modules/@apollo/client/core/QueryInfo.js
var IGNORE = {};
var destructiveMethodCounts = /* @__PURE__ */ new WeakMap();
function wrapDestructiveCacheMethod(cache, methodName) {
  const original = cache[methodName];
  if (typeof original === "function") {
    cache[methodName] = function() {
      destructiveMethodCounts.set(
        cache,
        // The %1e15 allows the count to wrap around to 0 safely every
        // quadrillion evictions, so there's no risk of overflow. To be
        // clear, this is more of a pedantic principle than something
        // that matters in any conceivable practical scenario.
        (destructiveMethodCounts.get(cache) + 1) % 1e15
      );
      return original.apply(this, arguments);
    };
  }
}
var queryInfoIds = /* @__PURE__ */ new WeakMap();
var QueryInfo = class {
  // TODO remove soon - this should be able to be handled by cancelling old operations before starting new ones
  lastRequestId = 1;
  cache;
  queryManager;
  id;
  observableQuery;
  incremental;
  constructor(queryManager, observableQuery) {
    const cache = this.cache = queryManager.cache;
    const id = (queryInfoIds.get(queryManager) || 0) + 1;
    queryInfoIds.set(queryManager, id);
    this.id = id + "";
    this.observableQuery = observableQuery;
    this.queryManager = queryManager;
    if (!destructiveMethodCounts.has(cache)) {
      destructiveMethodCounts.set(cache, 0);
      wrapDestructiveCacheMethod(cache, "evict");
      wrapDestructiveCacheMethod(cache, "modify");
      wrapDestructiveCacheMethod(cache, "reset");
    }
  }
  /**
  * @internal
  * For feud-preventing behaviour, `lastWrite` should be shared by all `QueryInfo` instances of an `ObservableQuery`.
  * In the case of a standalone `QueryInfo`, we will keep a local version.
  * 
  * @deprecated This is an internal API and should not be used directly. This can be removed or changed at any time.
  */
  _lastWrite;
  get lastWrite() {
    return (this.observableQuery || this)._lastWrite;
  }
  set lastWrite(value) {
    (this.observableQuery || this)._lastWrite = value;
  }
  resetLastWrite() {
    this.lastWrite = void 0;
  }
  shouldWrite(result, variables) {
    const { lastWrite } = this;
    return !(lastWrite && // If cache.evict has been called since the last time we wrote this
    // data into the cache, there's a chance writing this result into
    // the cache will repair what was evicted.
    lastWrite.dmCount === destructiveMethodCounts.get(this.cache) && equal(variables, lastWrite.variables) && equal(result.data, lastWrite.result.data));
  }
  get hasNext() {
    return this.incremental ? this.incremental.hasNext : false;
  }
  maybeHandleIncrementalResult(cacheData, incoming, query) {
    const { incrementalHandler } = this.queryManager;
    if (incrementalHandler.isIncrementalResult(incoming)) {
      this.incremental ||= incrementalHandler.startRequest({
        query
      });
      return this.incremental.handle(cacheData, incoming);
    }
    return incoming;
  }
  markQueryResult(incoming, { document: query, variables, errorPolicy, cacheWriteBehavior }) {
    const diffOptions = {
      query,
      variables,
      returnPartialData: true,
      optimistic: true
    };
    this.observableQuery?.["resetNotifications"]();
    const skipCache = cacheWriteBehavior === 0;
    const lastDiff = skipCache ? void 0 : this.cache.diff(diffOptions);
    let result = this.maybeHandleIncrementalResult(lastDiff?.result, incoming, query);
    if (skipCache) {
      return result;
    }
    if (shouldWriteResult(result, errorPolicy)) {
      this.cache.batch({
        onWatchUpdated: (watch, diff) => {
          if (watch.watcher === this.observableQuery) {
            watch.lastOwnDiff = diff;
          }
        },
        update: (cache) => {
          if (this.shouldWrite(result, variables)) {
            cache.writeQuery({
              query,
              data: result.data,
              variables,
              overwrite: cacheWriteBehavior === 1
            });
            this.lastWrite = {
              result,
              variables,
              dmCount: destructiveMethodCounts.get(this.cache)
            };
          } else {
            if (lastDiff && lastDiff.complete) {
              result = { ...result, data: lastDiff.result };
              return;
            }
          }
          const diff = cache.diff(diffOptions);
          if (diff.complete) {
            result = { ...result, data: diff.result };
          }
        }
      });
    } else {
      this.lastWrite = void 0;
    }
    return result;
  }
  markMutationResult(incoming, mutation, cache = this.cache) {
    const cacheWrites = [];
    const skipCache = mutation.cacheWriteBehavior === 0;
    let result = this.maybeHandleIncrementalResult(skipCache ? void 0 : cache.diff({
      id: "ROOT_MUTATION",
      // The cache complains if passed a mutation where it expects a
      // query, so we transform mutations and subscriptions to queries
      // (only once, thanks to this.transformCache).
      query: this.queryManager.getDocumentInfo(mutation.document).asQuery,
      variables: mutation.variables,
      optimistic: false,
      returnPartialData: true
    }).result, incoming, mutation.document);
    if (mutation.errorPolicy === "ignore") {
      result = { ...result, errors: [] };
    }
    if (graphQLResultHasError(result) && mutation.errorPolicy === "none") {
      return Promise.resolve(result);
    }
    const getResultWithDataState = () => ({
      ...result,
      dataState: this.hasNext ? "streaming" : "complete"
    });
    if (!skipCache && shouldWriteResult(result, mutation.errorPolicy)) {
      cacheWrites.push({
        result: result.data,
        dataId: "ROOT_MUTATION",
        query: mutation.document,
        variables: mutation.variables
      });
      const { updateQueries } = mutation;
      if (updateQueries) {
        this.queryManager.getObservableQueries("all").forEach((observableQuery) => {
          const queryName = observableQuery && observableQuery.queryName;
          if (!queryName || !Object.hasOwnProperty.call(updateQueries, queryName)) {
            return;
          }
          const updater = updateQueries[queryName];
          const { query: document, variables } = observableQuery;
          const { result: currentQueryResult, complete } = observableQuery.getCacheDiff({ optimistic: false });
          if (complete && currentQueryResult) {
            const nextQueryResult = updater(currentQueryResult, {
              mutationResult: getResultWithDataState(),
              queryName: document && getOperationName(document) || void 0,
              queryVariables: variables
            });
            if (nextQueryResult) {
              cacheWrites.push({
                result: nextQueryResult,
                dataId: "ROOT_QUERY",
                query: document,
                variables
              });
            }
          }
        });
      }
    }
    let refetchQueries = mutation.refetchQueries;
    if (typeof refetchQueries === "function") {
      refetchQueries = refetchQueries(getResultWithDataState());
    }
    if (cacheWrites.length > 0 || (refetchQueries || "").length > 0 || mutation.update || mutation.onQueryUpdated || mutation.removeOptimistic) {
      const results = [];
      this.queryManager.refetchQueries({
        updateCache: (cache2) => {
          if (!skipCache) {
            cacheWrites.forEach((write) => cache2.write(write));
          }
          const { update } = mutation;
          if (update) {
            if (!skipCache) {
              const diff = cache2.diff({
                id: "ROOT_MUTATION",
                // The cache complains if passed a mutation where it expects a
                // query, so we transform mutations and subscriptions to queries
                // (only once, thanks to this.transformCache).
                query: this.queryManager.getDocumentInfo(mutation.document).asQuery,
                variables: mutation.variables,
                optimistic: false,
                returnPartialData: true
              });
              if (diff.complete) {
                result = {
                  ...result,
                  data: diff.result
                };
              }
            }
            if (!this.hasNext) {
              update(cache2, result, {
                context: mutation.context,
                variables: mutation.variables
              });
            }
          }
          if (!skipCache && !mutation.keepRootFields && !this.hasNext) {
            cache2.modify({
              id: "ROOT_MUTATION",
              fields(value, { fieldName, DELETE: DELETE2 }) {
                return fieldName === "__typename" ? value : DELETE2;
              }
            });
          }
        },
        include: refetchQueries,
        // Write the final mutation.result to the root layer of the cache.
        optimistic: false,
        // Remove the corresponding optimistic layer at the same time as we
        // write the final non-optimistic result.
        removeOptimistic: mutation.removeOptimistic,
        // Let the caller of client.mutate optionally determine the refetching
        // behavior for watched queries after the mutation.update function runs.
        // If no onQueryUpdated function was provided for this mutation, pass
        // null instead of undefined to disable the default refetching behavior.
        onQueryUpdated: mutation.onQueryUpdated || null
      }).forEach((result2) => results.push(result2));
      if (mutation.awaitRefetchQueries || mutation.onQueryUpdated) {
        return Promise.all(results).then(() => result);
      }
    }
    return Promise.resolve(result);
  }
  markMutationOptimistic(optimisticResponse, mutation) {
    const data = typeof optimisticResponse === "function" ? optimisticResponse(mutation.variables, { IGNORE }) : optimisticResponse;
    if (data === IGNORE) {
      return false;
    }
    this.cache.recordOptimisticTransaction((cache) => {
      try {
        this.markMutationResult({ data }, mutation, cache);
      } catch (error) {
        invariant3.error(error);
      }
    }, this.id);
    return true;
  }
  markSubscriptionResult(result, { document, variables, errorPolicy, cacheWriteBehavior }) {
    if (cacheWriteBehavior !== 0) {
      if (shouldWriteResult(result, errorPolicy)) {
        this.cache.write({
          query: document,
          result: result.data,
          dataId: "ROOT_SUBSCRIPTION",
          variables
        });
      }
      this.queryManager.broadcastQueries();
    }
  }
};
function shouldWriteResult(result, errorPolicy = "none") {
  const ignoreErrors = errorPolicy === "ignore" || errorPolicy === "all";
  let writeWithErrors = !graphQLResultHasError(result);
  if (!writeWithErrors && ignoreErrors && result.data) {
    writeWithErrors = true;
  }
  return writeWithErrors;
}

// node_modules/@apollo/client/core/QueryManager.js
var QueryManager = class {
  defaultOptions;
  client;
  /**
   * The options that were passed to the ApolloClient constructor.
   */
  clientOptions;
  assumeImmutableResults;
  documentTransform;
  ssrMode;
  defaultContext;
  dataMasking;
  incrementalHandler;
  localState;
  queryDeduplication;
  /**
   * Whether to prioritize cache values over network results when
   * `fetchObservableWithInfo` is called.
   * This will essentially turn a `"network-only"` or `"cache-and-network"`
   * fetchPolicy into a `"cache-first"` fetchPolicy, but without influencing
   * the `fetchPolicy` of the `ObservableQuery`.
   *
   * This can e.g. be used to prioritize the cache during the first render after
   * SSR.
   */
  prioritizeCacheValues = false;
  onBroadcast;
  mutationStore;
  /**
   * All ObservableQueries that currently have at least one subscriber.
   */
  obsQueries = /* @__PURE__ */ new Set();
  // Maps from queryInfo.id strings to Promise rejection functions for
  // currently active queries and fetches.
  // Use protected instead of private field so
  // @apollo/experimental-nextjs-app-support can access type info.
  fetchCancelFns = /* @__PURE__ */ new Map();
  constructor(options) {
    const defaultDocumentTransform = new DocumentTransform(
      (document) => this.cache.transformDocument(document),
      // Allow the apollo cache to manage its own transform caches
      { cache: false }
    );
    this.client = options.client;
    this.defaultOptions = options.defaultOptions;
    this.queryDeduplication = options.queryDeduplication;
    this.clientOptions = options.clientOptions;
    this.ssrMode = options.ssrMode;
    this.assumeImmutableResults = options.assumeImmutableResults;
    this.dataMasking = options.dataMasking;
    this.localState = options.localState;
    this.incrementalHandler = options.incrementalHandler;
    const documentTransform = options.documentTransform;
    this.documentTransform = documentTransform ? defaultDocumentTransform.concat(documentTransform).concat(defaultDocumentTransform) : defaultDocumentTransform;
    this.defaultContext = options.defaultContext || {};
    if (this.onBroadcast = options.onBroadcast) {
      this.mutationStore = {};
    }
  }
  get link() {
    return this.client.link;
  }
  get cache() {
    return this.client.cache;
  }
  /**
   * Call this method to terminate any active query processes, making it safe
   * to dispose of this QueryManager instance.
   */
  stop() {
    this.obsQueries.forEach((oq) => oq.stop());
    this.cancelPendingFetches(newInvariantError(83));
  }
  cancelPendingFetches(error) {
    this.fetchCancelFns.forEach((cancel) => cancel(error));
    this.fetchCancelFns.clear();
  }
  async mutate({ mutation, variables, optimisticResponse, updateQueries, refetchQueries = [], awaitRefetchQueries = false, update: updateWithProxyFn, onQueryUpdated, fetchPolicy, errorPolicy, keepRootFields, context: context2 }) {
    const queryInfo = new QueryInfo(this);
    mutation = this.cache.transformForLink(this.transform(mutation));
    const { hasClientExports } = this.getDocumentInfo(mutation);
    variables = this.getVariables(mutation, variables);
    if (hasClientExports) {
      if (__DEV__) {
        invariant3(this.localState, 84, getOperationName(mutation, "(anonymous)"));
      }
      variables = await this.localState.getExportedVariables({
        client: this.client,
        document: mutation,
        variables,
        context: context2
      });
    }
    const mutationStoreValue = this.mutationStore && (this.mutationStore[queryInfo.id] = {
      mutation,
      variables,
      loading: true,
      error: null
    });
    const isOptimistic = optimisticResponse && queryInfo.markMutationOptimistic(optimisticResponse, {
      document: mutation,
      variables,
      cacheWriteBehavior: fetchPolicy === "no-cache" ? 0 : 2,
      errorPolicy,
      context: context2,
      updateQueries,
      update: updateWithProxyFn,
      keepRootFields
    });
    this.broadcastQueries();
    return new Promise((resolve, reject) => {
      const cause = {};
      return this.getObservableFromLink(mutation, {
        ...context2,
        optimisticResponse: isOptimistic ? optimisticResponse : void 0
      }, variables, {}, false).observable.pipe(validateDidEmitValue(), mergeMap((result) => {
        const storeResult = { ...result };
        return from(queryInfo.markMutationResult(storeResult, {
          document: mutation,
          variables,
          cacheWriteBehavior: fetchPolicy === "no-cache" ? 0 : 2,
          errorPolicy,
          context: context2,
          update: updateWithProxyFn,
          updateQueries,
          awaitRefetchQueries,
          refetchQueries,
          removeOptimistic: isOptimistic ? queryInfo.id : void 0,
          onQueryUpdated,
          keepRootFields
        }));
      })).pipe(map((storeResult) => {
        const hasErrors = graphQLResultHasError(storeResult);
        if (hasErrors && errorPolicy === "none") {
          throw new CombinedGraphQLErrors(storeResult);
        }
        if (mutationStoreValue) {
          mutationStoreValue.loading = false;
          mutationStoreValue.error = null;
        }
        return storeResult;
      })).subscribe({
        next: (storeResult) => {
          this.broadcastQueries();
          if (!queryInfo.hasNext) {
            const result = {
              data: this.maskOperation({
                document: mutation,
                data: storeResult.data,
                fetchPolicy,
                cause
              })
            };
            if (graphQLResultHasError(storeResult)) {
              result.error = new CombinedGraphQLErrors(storeResult);
            }
            if (Object.keys(storeResult.extensions || {}).length) {
              result.extensions = storeResult.extensions;
            }
            resolve(result);
          }
        },
        error: (error) => {
          if (mutationStoreValue) {
            mutationStoreValue.loading = false;
            mutationStoreValue.error = error;
          }
          if (isOptimistic) {
            this.cache.removeOptimistic(queryInfo.id);
          }
          this.broadcastQueries();
          if (errorPolicy === "ignore") {
            return resolve({ data: void 0 });
          }
          if (errorPolicy === "all") {
            return resolve({ data: void 0, error });
          }
          reject(error);
        }
      });
    });
  }
  fetchQuery(options, networkStatus) {
    checkDocument(options.query, OperationTypeNode.QUERY);
    return (async () => lastValueFrom(this.fetchObservableWithInfo(options, {
      networkStatus
    }).observable.pipe(filterMap((value) => {
      switch (value.kind) {
        case "E":
          throw value.error;
        case "N": {
          if (value.source !== "newNetworkStatus")
            return toQueryResult(value.value);
        }
      }
    })), {
      // This default is needed when a `standby` fetch policy is used to avoid
      // an EmptyError from rejecting this promise.
      defaultValue: { data: void 0 }
    }))();
  }
  transform(document) {
    return this.documentTransform.transformDocument(document);
  }
  transformCache = new AutoCleanedWeakCache(
    cacheSizes["queryManager.getDocumentInfo"] || 2e3
    /* defaultCacheSizes["queryManager.getDocumentInfo"] */
  );
  getDocumentInfo(document) {
    const { transformCache } = this;
    if (!transformCache.has(document)) {
      const operationDefinition = getOperationDefinition(document);
      const cacheEntry = {
        // TODO These three calls (hasClientExports, shouldForceResolvers, and
        // usesNonreactiveDirective) are performing independent full traversals
        // of the transformed document. We should consider merging these
        // traversals into a single pass in the future, though the work is
        // cached after the first time.
        hasClientExports: hasDirectives(["client", "export"], document, true),
        hasForcedResolvers: hasForcedResolvers(document),
        hasNonreactiveDirective: hasDirectives(["nonreactive"], document),
        hasIncrementalDirective: hasDirectives(["defer"], document),
        nonReactiveQuery: addNonReactiveToNamedFragments(document),
        clientQuery: hasDirectives(["client"], document) ? document : null,
        serverQuery: removeDirectivesFromDocument([
          { name: "client", remove: true },
          { name: "connection" },
          { name: "nonreactive" },
          { name: "unmask" }
        ], document),
        operationType: operationDefinition?.operation,
        defaultVars: getDefaultValues(operationDefinition),
        // Transform any mutation or subscription operations to query operations
        // so we can read/write them from/to the cache.
        asQuery: {
          ...document,
          definitions: document.definitions.map((def) => {
            if (def.kind === "OperationDefinition" && def.operation !== "query") {
              return { ...def, operation: "query" };
            }
            return def;
          })
        }
      };
      transformCache.set(document, cacheEntry);
    }
    const entry = transformCache.get(document);
    if (entry.violation) {
      throw entry.violation;
    }
    return entry;
  }
  getVariables(document, variables) {
    const defaultVars = this.getDocumentInfo(document).defaultVars;
    const varsWithDefaults = Object.entries(variables ?? {}).map(([key, value]) => [key, value === void 0 ? defaultVars[key] : value]);
    return {
      ...defaultVars,
      ...Object.fromEntries(varsWithDefaults)
    };
  }
  watchQuery(options) {
    checkDocument(options.query, OperationTypeNode.QUERY);
    const query = this.transform(options.query);
    options = {
      ...options,
      variables: this.getVariables(query, options.variables)
    };
    if (typeof options.notifyOnNetworkStatusChange === "undefined") {
      options.notifyOnNetworkStatusChange = true;
    }
    const observable2 = new ObservableQuery({
      queryManager: this,
      options,
      transformedQuery: query
    });
    return observable2;
  }
  query(options) {
    const query = this.transform(options.query);
    return this.fetchQuery({
      ...options,
      query
    }).then((value) => ({
      ...value,
      data: this.maskOperation({
        document: query,
        data: value?.data,
        fetchPolicy: options.fetchPolicy
      })
    }));
  }
  requestIdCounter = 1;
  generateRequestId() {
    return this.requestIdCounter++;
  }
  clearStore(options = {
    discardWatches: true
  }) {
    this.cancelPendingFetches(newInvariantError(85));
    this.obsQueries.forEach((observableQuery) => {
      observableQuery.reset();
    });
    if (this.mutationStore) {
      this.mutationStore = {};
    }
    return this.cache.reset(options);
  }
  getObservableQueries(include = "active") {
    const queries = /* @__PURE__ */ new Set();
    const queryNames = /* @__PURE__ */ new Map();
    const queryNamesAndQueryStrings = /* @__PURE__ */ new Map();
    const legacyQueryOptions = /* @__PURE__ */ new Set();
    if (Array.isArray(include)) {
      include.forEach((desc) => {
        if (typeof desc === "string") {
          queryNames.set(desc, desc);
          queryNamesAndQueryStrings.set(desc, false);
        } else if (isDocumentNode(desc)) {
          const queryString = print2(this.transform(desc));
          queryNames.set(queryString, getOperationName(desc));
          queryNamesAndQueryStrings.set(queryString, false);
        } else if (isNonNullObject(desc) && desc.query) {
          legacyQueryOptions.add(desc);
        }
      });
    }
    this.obsQueries.forEach((oq) => {
      const document = print2(this.transform(oq.options.query));
      if (include === "all") {
        queries.add(oq);
        return;
      }
      const { queryName, options: { fetchPolicy } } = oq;
      if (include === "active" && fetchPolicy === "standby") {
        return;
      }
      if (include === "active" || queryName && queryNamesAndQueryStrings.has(queryName) || document && queryNamesAndQueryStrings.has(document)) {
        queries.add(oq);
        if (queryName)
          queryNamesAndQueryStrings.set(queryName, true);
        if (document)
          queryNamesAndQueryStrings.set(document, true);
      }
    });
    if (legacyQueryOptions.size) {
      legacyQueryOptions.forEach((options) => {
        const oq = new ObservableQuery({
          queryManager: this,
          options: {
            ...options,
            fetchPolicy: "network-only"
          }
        });
        queries.add(oq);
      });
    }
    if (__DEV__ && queryNamesAndQueryStrings.size) {
      queryNamesAndQueryStrings.forEach((included, nameOrQueryString) => {
        if (!included) {
          const queryName = queryNames.get(nameOrQueryString);
          if (queryName) {
            __DEV__ && invariant3.warn(86, queryName);
          } else {
            __DEV__ && invariant3.warn(87);
          }
        }
      });
    }
    return queries;
  }
  refetchObservableQueries(includeStandby = false) {
    const observableQueryPromises = [];
    this.getObservableQueries(includeStandby ? "all" : "active").forEach((observableQuery) => {
      const { fetchPolicy } = observableQuery.options;
      if ((includeStandby || fetchPolicy !== "standby") && fetchPolicy !== "cache-only") {
        observableQueryPromises.push(observableQuery.refetch());
      }
    });
    this.broadcastQueries();
    return Promise.all(observableQueryPromises);
  }
  startGraphQLSubscription(options) {
    let { query, variables } = options;
    const { fetchPolicy, errorPolicy = "none", context: context2 = {}, extensions = {} } = options;
    checkDocument(query, OperationTypeNode.SUBSCRIPTION);
    query = this.transform(query);
    variables = this.getVariables(query, variables);
    let restart;
    if (__DEV__) {
      invariant3(
        !this.getDocumentInfo(query).hasClientExports || this.localState,
        88,
        getOperationName(query, "(anonymous)")
      );
    }
    const observable2 = (this.getDocumentInfo(query).hasClientExports ? from(this.localState.getExportedVariables({
      client: this.client,
      document: query,
      variables,
      context: context2
    })) : of(variables)).pipe(mergeMap((variables2) => {
      const { observable: observable3, restart: res } = this.getObservableFromLink(query, context2, variables2, extensions);
      const queryInfo = new QueryInfo(this);
      restart = res;
      return observable3.pipe(map((rawResult) => {
        queryInfo.markSubscriptionResult(rawResult, {
          document: query,
          variables: variables2,
          errorPolicy,
          cacheWriteBehavior: fetchPolicy === "no-cache" ? 0 : 2
        });
        const result = {
          data: rawResult.data ?? void 0
        };
        if (graphQLResultHasError(rawResult)) {
          result.error = new CombinedGraphQLErrors(rawResult);
        } else if (graphQLResultHasProtocolErrors(rawResult)) {
          result.error = rawResult.extensions[PROTOCOL_ERRORS_SYMBOL];
          delete rawResult.extensions[PROTOCOL_ERRORS_SYMBOL];
        }
        if (rawResult.extensions && Object.keys(rawResult.extensions).length) {
          result.extensions = rawResult.extensions;
        }
        if (result.error && errorPolicy === "none") {
          result.data = void 0;
        }
        if (errorPolicy === "ignore") {
          delete result.error;
        }
        return result;
      }), catchError((error) => {
        if (errorPolicy === "ignore") {
          return of({
            data: void 0
          });
        }
        return of({ data: void 0, error });
      }), filter((result) => !!(result.data || result.error)));
    }));
    return Object.assign(observable2, { restart: () => restart?.() });
  }
  broadcastQueries() {
    if (this.onBroadcast)
      this.onBroadcast();
    this.obsQueries.forEach((observableQuery) => observableQuery.notify());
  }
  // Use protected instead of private field so
  // @apollo/experimental-nextjs-app-support can access type info.
  inFlightLinkObservables = new Trie(false);
  getObservableFromLink(query, context2, variables, extensions, deduplication = context2?.queryDeduplication ?? this.queryDeduplication) {
    let entry = {};
    const { serverQuery, clientQuery, operationType, hasIncrementalDirective } = this.getDocumentInfo(query);
    const operationName = getOperationName(query);
    const executeContext = {
      client: this.client
    };
    if (serverQuery) {
      const { inFlightLinkObservables, link } = this;
      try {
        let withRestart = function(source) {
          return new Observable((observer) => {
            function subscribe2() {
              return source.subscribe({
                next: observer.next.bind(observer),
                complete: observer.complete.bind(observer),
                error: observer.error.bind(observer)
              });
            }
            let subscription = subscribe2();
            entry.restart ||= () => {
              subscription.unsubscribe();
              subscription = subscribe2();
            };
            return () => {
              subscription.unsubscribe();
              entry.restart = void 0;
            };
          });
        };
        const operation = this.incrementalHandler.prepareRequest({
          query: serverQuery,
          variables,
          context: {
            ...this.defaultContext,
            ...context2,
            queryDeduplication: deduplication
          },
          extensions
        });
        context2 = operation.context;
        if (deduplication) {
          const printedServerQuery = print2(serverQuery);
          const varJson = canonicalStringify(variables);
          entry = inFlightLinkObservables.lookup(printedServerQuery, varJson);
          if (!entry.observable) {
            entry.observable = execute2(link, operation, executeContext).pipe(
              withRestart,
              finalize(() => {
                if (inFlightLinkObservables.peek(printedServerQuery, varJson) === entry) {
                  inFlightLinkObservables.remove(printedServerQuery, varJson);
                }
              }),
              // We don't want to replay the last emitted value for
              // subscriptions and instead opt to wait to receive updates until
              // the subscription emits new values.
              operationType === OperationTypeNode.SUBSCRIPTION ? share() : shareReplay({ refCount: true })
            );
          }
        } else {
          entry.observable = execute2(link, operation, executeContext).pipe(withRestart);
        }
      } catch (error) {
        entry.observable = throwError(() => error);
      }
    } else {
      entry.observable = of({ data: {} });
    }
    if (clientQuery) {
      const { operation } = getOperationDefinition(query);
      if (__DEV__) {
        invariant3(
          this.localState,
          89,
          operation[0].toUpperCase() + operation.slice(1),
          operationName ?? "(anonymous)"
        );
      }
      invariant3(
        !hasIncrementalDirective,
        90,
        operation[0].toUpperCase() + operation.slice(1),
        operationName ?? "(anonymous)"
      );
      entry.observable = entry.observable.pipe(mergeMap((result) => {
        return from(this.localState.execute({
          client: this.client,
          document: clientQuery,
          remoteResult: result,
          context: context2,
          variables
        }));
      }));
    }
    return {
      restart: () => entry.restart?.(),
      observable: entry.observable.pipe(catchError((error) => {
        error = toErrorLike(error);
        registerLinkError(error);
        throw error;
      }))
    };
  }
  getResultsFromLink(options, { queryInfo, cacheWriteBehavior, observableQuery }) {
    const requestId = queryInfo.lastRequestId = this.generateRequestId();
    const { errorPolicy } = options;
    const linkDocument = this.cache.transformForLink(options.query);
    return this.getObservableFromLink(linkDocument, options.context, options.variables).observable.pipe(map((incoming) => {
      const result = queryInfo.markQueryResult(incoming, {
        ...options,
        document: linkDocument,
        cacheWriteBehavior
      });
      const hasErrors = graphQLResultHasError(result);
      if (hasErrors && errorPolicy === "none") {
        queryInfo.resetLastWrite();
        observableQuery?.["resetNotifications"]();
        throw new CombinedGraphQLErrors(result);
      }
      const aqr = {
        data: result.data,
        ...queryInfo.hasNext ? {
          loading: true,
          networkStatus: NetworkStatus.streaming,
          dataState: "streaming",
          partial: true
        } : {
          dataState: result.data ? "complete" : "empty",
          loading: false,
          networkStatus: NetworkStatus.ready,
          partial: !result.data
        }
      };
      if (hasErrors) {
        if (errorPolicy === "none") {
          aqr.data = void 0;
          aqr.dataState = "empty";
        }
        if (errorPolicy !== "ignore") {
          aqr.error = new CombinedGraphQLErrors(result);
          if (aqr.dataState !== "streaming") {
            aqr.networkStatus = NetworkStatus.error;
          }
        }
      }
      return aqr;
    }), catchError((error) => {
      if (requestId >= queryInfo.lastRequestId && errorPolicy === "none") {
        queryInfo.resetLastWrite();
        observableQuery?.["resetNotifications"]();
        throw error;
      }
      const aqr = {
        data: void 0,
        dataState: "empty",
        loading: false,
        networkStatus: NetworkStatus.ready,
        partial: true
      };
      if (errorPolicy !== "ignore") {
        aqr.error = error;
        aqr.networkStatus = NetworkStatus.error;
      }
      return of(aqr);
    }));
  }
  fetchObservableWithInfo(options, {
    // The initial networkStatus for this fetch, most often
    // NetworkStatus.loading, but also possibly fetchMore, poll, refetch,
    // or setVariables.
    networkStatus = NetworkStatus.loading,
    query = options.query,
    fetchQueryOperator = (x) => x,
    onCacheHit = () => {
    },
    observableQuery
  }) {
    const variables = this.getVariables(query, options.variables);
    const defaults = this.defaultOptions.watchQuery;
    let { fetchPolicy = defaults && defaults.fetchPolicy || "cache-first", errorPolicy = defaults && defaults.errorPolicy || "none", returnPartialData = false, notifyOnNetworkStatusChange = true, context: context2 = {} } = options;
    if (this.prioritizeCacheValues && (fetchPolicy === "network-only" || fetchPolicy === "cache-and-network")) {
      fetchPolicy = "cache-first";
    }
    const normalized = Object.assign({}, options, {
      query,
      variables,
      fetchPolicy,
      errorPolicy,
      returnPartialData,
      notifyOnNetworkStatusChange,
      context: context2
    });
    const queryInfo = new QueryInfo(this, observableQuery);
    const fromVariables = (variables2) => {
      normalized.variables = variables2;
      const cacheWriteBehavior = fetchPolicy === "no-cache" ? 0 : networkStatus === NetworkStatus.refetch && normalized.refetchWritePolicy !== "merge" ? 1 : 2;
      const observableWithInfo = this.fetchQueryByPolicy(normalized, { queryInfo, cacheWriteBehavior, onCacheHit, observableQuery });
      observableWithInfo.observable = observableWithInfo.observable.pipe(fetchQueryOperator);
      if (
        // If we're in standby, postpone advancing options.fetchPolicy using
        // applyNextFetchPolicy.
        normalized.fetchPolicy !== "standby"
      ) {
        observableQuery?.["applyNextFetchPolicy"]("after-fetch", options);
      }
      return observableWithInfo;
    };
    const cleanupCancelFn = () => {
      this.fetchCancelFns.delete(queryInfo.id);
    };
    this.fetchCancelFns.set(queryInfo.id, (error) => {
      fetchCancelSubject.next({
        kind: "E",
        error,
        source: "network"
      });
    });
    const fetchCancelSubject = new Subject();
    let observable2, containsDataFromLink;
    if (this.getDocumentInfo(normalized.query).hasClientExports) {
      if (__DEV__) {
        invariant3(this.localState, 91, getOperationName(normalized.query, "(anonymous)"));
      }
      observable2 = from(this.localState.getExportedVariables({
        client: this.client,
        document: normalized.query,
        variables: normalized.variables,
        context: normalized.context
      })).pipe(mergeMap((variables2) => fromVariables(variables2).observable));
      containsDataFromLink = true;
    } else {
      const sourcesWithInfo = fromVariables(normalized.variables);
      containsDataFromLink = sourcesWithInfo.fromLink;
      observable2 = sourcesWithInfo.observable;
    }
    return {
      // Merge `observable` with `fetchCancelSubject`, in a way that completing or
      // erroring either of them will complete the merged obserable.
      observable: new Observable((observer) => {
        observer.add(cleanupCancelFn);
        observable2.subscribe(observer);
        fetchCancelSubject.subscribe(observer);
      }).pipe(share()),
      fromLink: containsDataFromLink
    };
  }
  refetchQueries({ updateCache, include, optimistic = false, removeOptimistic = optimistic ? makeUniqueId("refetchQueries") : void 0, onQueryUpdated }) {
    const includedQueriesByOq = /* @__PURE__ */ new Map();
    if (include) {
      this.getObservableQueries(include).forEach((oq) => {
        if (oq.options.fetchPolicy === "cache-only") {
          return;
        }
        const current = oq.getCurrentResult();
        includedQueriesByOq.set(oq, {
          oq,
          lastDiff: {
            result: current?.data,
            complete: !current?.partial
          }
        });
      });
    }
    const results = /* @__PURE__ */ new Map();
    if (updateCache) {
      const handled = /* @__PURE__ */ new Set();
      this.cache.batch({
        update: updateCache,
        // Since you can perform any combination of cache reads and/or writes in
        // the cache.batch update function, its optimistic option can be either
        // a boolean or a string, representing three distinct modes of
        // operation:
        //
        // * false: read/write only the root layer
        // * true: read/write the topmost layer
        // * string: read/write a fresh optimistic layer with that ID string
        //
        // When typeof optimistic === "string", a new optimistic layer will be
        // temporarily created within cache.batch with that string as its ID. If
        // we then pass that same string as the removeOptimistic option, we can
        // make cache.batch immediately remove the optimistic layer after
        // running the updateCache function, triggering only one broadcast.
        //
        // However, the refetchQueries method accepts only true or false for its
        // optimistic option (not string). We interpret true to mean a temporary
        // optimistic layer should be created, to allow efficiently rolling back
        // the effect of the updateCache function, which involves passing a
        // string instead of true as the optimistic option to cache.batch, when
        // refetchQueries receives optimistic: true.
        //
        // In other words, we are deliberately not supporting the use case of
        // writing to an *existing* optimistic layer (using the refetchQueries
        // updateCache function), since that would potentially interfere with
        // other optimistic updates in progress. Instead, you can read/write
        // only the root layer by passing optimistic: false to refetchQueries,
        // or you can read/write a brand new optimistic layer that will be
        // automatically removed by passing optimistic: true.
        optimistic: optimistic && removeOptimistic || false,
        // The removeOptimistic option can also be provided by itself, even if
        // optimistic === false, to remove some previously-added optimistic
        // layer safely and efficiently, like we do in markMutationResult.
        //
        // If an explicit removeOptimistic string is provided with optimistic:
        // true, the removeOptimistic string will determine the ID of the
        // temporary optimistic layer, in case that ever matters.
        removeOptimistic,
        onWatchUpdated(watch, diff, lastDiff) {
          const oq = watch.watcher;
          if (oq instanceof ObservableQuery && !handled.has(oq)) {
            handled.add(oq);
            if (onQueryUpdated) {
              includedQueriesByOq.delete(oq);
              let result = onQueryUpdated(oq, diff, lastDiff);
              if (result === true) {
                result = oq.refetch().retain(
                  /* create a persistent subscription on the query */
                );
              }
              if (result !== false) {
                results.set(oq, result);
              }
              return result;
            }
            if (onQueryUpdated !== null && oq.options.fetchPolicy !== "cache-only") {
              includedQueriesByOq.set(oq, { oq, lastDiff, diff });
            }
          }
        }
      });
    }
    if (includedQueriesByOq.size) {
      includedQueriesByOq.forEach(({ oq, lastDiff, diff }) => {
        let result;
        if (onQueryUpdated) {
          if (!diff) {
            diff = oq.getCacheDiff();
          }
          result = onQueryUpdated(oq, diff, lastDiff);
        }
        if (!onQueryUpdated || result === true) {
          result = oq.refetch().retain(
            /* create a persistent subscription on the query */
          );
        }
        if (result !== false) {
          results.set(oq, result);
        }
      });
    }
    if (removeOptimistic) {
      this.cache.removeOptimistic(removeOptimistic);
    }
    return results;
  }
  noCacheWarningsByCause = /* @__PURE__ */ new WeakSet();
  maskOperation(options) {
    const { document, data } = options;
    if (__DEV__) {
      const { fetchPolicy, cause = {} } = options;
      const operationType = getOperationDefinition(document)?.operation;
      if (this.dataMasking && fetchPolicy === "no-cache" && !isFullyUnmaskedOperation(document) && !this.noCacheWarningsByCause.has(cause)) {
        this.noCacheWarningsByCause.add(cause);
        __DEV__ && invariant3.warn(92, getOperationName(document, `Unnamed ${operationType ?? "operation"}`));
      }
    }
    return this.dataMasking ? maskOperation(data, document, this.cache) : data;
  }
  maskFragment(options) {
    const { data, fragment, fragmentName } = options;
    return this.dataMasking ? maskFragment(data, fragment, this.cache, fragmentName) : data;
  }
  fetchQueryByPolicy({ query, variables, fetchPolicy, errorPolicy, returnPartialData, context: context2 }, { cacheWriteBehavior, onCacheHit, queryInfo, observableQuery }) {
    const readCache = () => this.cache.diff({
      query,
      variables,
      returnPartialData: true,
      optimistic: true
    });
    const resultsFromCache = (diff, networkStatus) => {
      const data = diff.result;
      if (__DEV__ && !returnPartialData && data !== null) {
        logMissingFieldErrors(diff.missing);
      }
      const toResult = (data2) => {
        if (!diff.complete && !returnPartialData) {
          data2 = void 0;
        }
        return {
          // TODO: Handle partial data
          data: data2,
          dataState: diff.complete ? "complete" : data2 ? "partial" : "empty",
          loading: isNetworkRequestInFlight(networkStatus),
          networkStatus,
          partial: !diff.complete
        };
      };
      const fromData = (data2) => {
        return of({
          kind: "N",
          value: toResult(data2),
          source: "cache"
        });
      };
      if (
        // Don't attempt to run forced resolvers if we have incomplete cache
        // data and partial isn't allowed since this result would get set to
        // `undefined` anyways in `toResult`.
        (diff.complete || returnPartialData) && this.getDocumentInfo(query).hasForcedResolvers
      ) {
        if (__DEV__) {
          invariant3(this.localState, 93, getOperationName(query, "(anonymous)"));
        }
        onCacheHit();
        return from(this.localState.execute({
          client: this.client,
          document: query,
          remoteResult: data ? { data } : void 0,
          context: context2,
          variables,
          onlyRunForcedResolvers: true,
          returnPartialData: true
        }).then((resolved2) => ({
          kind: "N",
          value: toResult(resolved2.data || void 0),
          source: "cache"
        })));
      }
      if (errorPolicy === "none" && networkStatus === NetworkStatus.refetch && diff.missing) {
        return fromData(void 0);
      }
      return fromData(data || void 0);
    };
    const resultsFromLink = () => this.getResultsFromLink({
      query,
      variables,
      context: context2,
      fetchPolicy,
      errorPolicy
    }, {
      cacheWriteBehavior,
      queryInfo,
      observableQuery
    }).pipe(validateDidEmitValue(), materialize(), map((result) => ({
      ...result,
      source: "network"
    })));
    switch (fetchPolicy) {
      default:
      case "cache-first": {
        const diff = readCache();
        if (diff.complete) {
          return {
            fromLink: false,
            observable: resultsFromCache(diff, NetworkStatus.ready)
          };
        }
        if (returnPartialData) {
          return {
            fromLink: true,
            observable: concat(resultsFromCache(diff, NetworkStatus.loading), resultsFromLink())
          };
        }
        return { fromLink: true, observable: resultsFromLink() };
      }
      case "cache-and-network": {
        const diff = readCache();
        if (diff.complete || returnPartialData) {
          return {
            fromLink: true,
            observable: concat(resultsFromCache(diff, NetworkStatus.loading), resultsFromLink())
          };
        }
        return { fromLink: true, observable: resultsFromLink() };
      }
      case "cache-only":
        return {
          fromLink: false,
          observable: concat(resultsFromCache(readCache(), NetworkStatus.ready))
        };
      case "network-only":
        return { fromLink: true, observable: resultsFromLink() };
      case "no-cache":
        return { fromLink: true, observable: resultsFromLink() };
      case "standby":
        return { fromLink: false, observable: EMPTY };
    }
  }
};
function validateDidEmitValue() {
  let didEmitValue = false;
  return tap({
    next() {
      didEmitValue = true;
    },
    complete() {
      invariant3(didEmitValue, 94);
    }
  });
}
function isFullyUnmaskedOperation(document) {
  let isUnmasked = true;
  visit(document, {
    FragmentSpread: (node) => {
      isUnmasked = !!node.directives && node.directives.some((directive) => directive.name.value === "unmask");
      if (!isUnmasked) {
        return BREAK;
      }
    }
  });
  return isUnmasked;
}
function addNonReactiveToNamedFragments(document) {
  return visit(document, {
    FragmentSpread: (node) => {
      if (node.directives?.some((directive) => directive.name.value === "unmask")) {
        return;
      }
      return {
        ...node,
        directives: [
          ...node.directives || [],
          {
            kind: Kind.DIRECTIVE,
            name: { kind: Kind.NAME, value: "nonreactive" }
          }
        ]
      };
    }
  });
}

// node_modules/@apollo/client/core/ApolloClient.js
var hasSuggestedDevtools = false;
var ApolloClient = class {
  link;
  cache;
  /**
   * @deprecated `disableNetworkFetches` has been renamed to `prioritizeCacheValues`.
   */
  disableNetworkFetches;
  set prioritizeCacheValues(value) {
    this.queryManager.prioritizeCacheValues = value;
  }
  /**
   * Whether to prioritize cache values over network results when `query` or `watchQuery` is called.
   * This will essentially turn a `"network-only"` or `"cache-and-network"` fetchPolicy into a `"cache-first"` fetchPolicy,
   * but without influencing the `fetchPolicy` of the created `ObservableQuery` long-term.
   *
   * This can e.g. be used to prioritize the cache during the first render after SSR.
   */
  get prioritizeCacheValues() {
    return this.queryManager.prioritizeCacheValues;
  }
  version;
  queryDeduplication;
  defaultOptions;
  devtoolsConfig;
  queryManager;
  devToolsHookCb;
  resetStoreCallbacks = [];
  clearStoreCallbacks = [];
  /**
   * Constructs an instance of `ApolloClient`.
   *
   * @example
   *
   * ```js
   * import { ApolloClient, InMemoryCache } from "@apollo/client";
   *
   * const cache = new InMemoryCache();
   *
   * const client = new ApolloClient({
   *   // Provide required constructor fields
   *   cache: cache,
   *   uri: "http://localhost:4000/",
   *
   *   // Provide some optional constructor fields
   *   name: "react-web-client",
   *   version: "1.3",
   *   queryDeduplication: false,
   *   defaultOptions: {
   *     watchQuery: {
   *       fetchPolicy: "cache-and-network",
   *     },
   *   },
   * });
   * ```
   */
  constructor(options) {
    if (__DEV__) {
      invariant3(options.cache, 65);
      invariant3(options.link, 66);
    }
    const { cache, documentTransform, ssrMode = false, ssrForceFetchDelay = 0, queryDeduplication = true, defaultOptions: defaultOptions2, defaultContext, assumeImmutableResults = cache.assumeImmutableResults, localState, devtools, dataMasking, link, incrementalHandler = new NotImplementedHandler() } = options;
    this.link = link;
    this.cache = cache;
    this.queryDeduplication = queryDeduplication;
    this.defaultOptions = defaultOptions2 || {};
    this.devtoolsConfig = {
      ...devtools,
      enabled: devtools?.enabled ?? __DEV__
    };
    this.watchQuery = this.watchQuery.bind(this);
    this.query = this.query.bind(this);
    this.mutate = this.mutate.bind(this);
    this.watchFragment = this.watchFragment.bind(this);
    this.resetStore = this.resetStore.bind(this);
    this.reFetchObservableQueries = this.refetchObservableQueries = this.refetchObservableQueries.bind(this);
    this.version = version2;
    this.queryManager = new QueryManager({
      client: this,
      defaultOptions: this.defaultOptions,
      defaultContext,
      documentTransform,
      queryDeduplication,
      ssrMode,
      dataMasking: !!dataMasking,
      clientOptions: options,
      incrementalHandler,
      assumeImmutableResults,
      onBroadcast: this.devtoolsConfig.enabled ? () => {
        if (this.devToolsHookCb) {
          this.devToolsHookCb();
        }
      } : void 0,
      localState
    });
    this.prioritizeCacheValues = ssrMode || ssrForceFetchDelay > 0;
    if (ssrForceFetchDelay) {
      setTimeout(() => {
        this.prioritizeCacheValues = false;
      }, ssrForceFetchDelay);
    }
    if (this.devtoolsConfig.enabled)
      this.connectToDevTools();
  }
  connectToDevTools() {
    if (typeof window === "undefined") {
      return;
    }
    const windowWithDevTools = window;
    const devtoolsSymbol = Symbol.for("apollo.devtools");
    (windowWithDevTools[devtoolsSymbol] = windowWithDevTools[devtoolsSymbol] || []).push(this);
    windowWithDevTools.__APOLLO_CLIENT__ = this;
    if (!hasSuggestedDevtools && __DEV__) {
      hasSuggestedDevtools = true;
      if (window.document && window.top === window.self && /^(https?|file):$/.test(window.location.protocol)) {
        setTimeout(() => {
          if (!window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__) {
            const nav = window.navigator;
            const ua = nav && nav.userAgent;
            let url;
            if (typeof ua === "string") {
              if (ua.indexOf("Chrome/") > -1) {
                url = "https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm";
              } else if (ua.indexOf("Firefox/") > -1) {
                url = "https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/";
              }
            }
            if (url) {
              __DEV__ && invariant3.log("Download the Apollo DevTools for a better development experience: %s", url);
            }
          }
        }, 1e4);
      }
    }
  }
  /**
   * The `DocumentTransform` used to modify GraphQL documents before a request
   * is made. If a custom `DocumentTransform` is not provided, this will be the
   * default document transform.
   */
  get documentTransform() {
    return this.queryManager.documentTransform;
  }
  /**
   * The configured `LocalState` instance used to enable the use of `@client`
   * fields.
   */
  get localState() {
    return this.queryManager.localState;
  }
  set localState(localState) {
    this.queryManager.localState = localState;
  }
  /**
   * Call this method to terminate any active client processes, making it safe
   * to dispose of this `ApolloClient` instance.
   *
   * This method performs aggressive cleanup to prevent memory leaks:
   *
   * - Unsubscribes all active `ObservableQuery` instances by emitting a `completed` event
   * - Rejects all currently running queries with "QueryManager stopped while query was in flight"
   * - Removes all queryRefs from the suspense cache
   */
  stop() {
    this.queryManager.stop();
  }
  /**
   * This watches the cache store of the query according to the options specified and
   * returns an `ObservableQuery`. We can subscribe to this `ObservableQuery` and
   * receive updated results through an observer when the cache store changes.
   *
   * Note that this method is not an implementation of GraphQL subscriptions. Rather,
   * it uses Apollo's store in order to reactively deliver updates to your query results.
   *
   * For example, suppose you call watchQuery on a GraphQL query that fetches a person's
   * first and last name and this person has a particular object identifier, provided by
   * `cache.identify`. Later, a different query fetches that same person's
   * first and last name and the first name has now changed. Then, any observers associated
   * with the results of the first query will be updated with a new result object.
   *
   * Note that if the cache does not change, the subscriber will _not_ be notified.
   *
   * See [here](https://medium.com/apollo-stack/the-concepts-of-graphql-bc68bd819be3#.3mb0cbcmc) for
   * a description of store reactivity.
   */
  watchQuery(options) {
    if (this.defaultOptions.watchQuery) {
      options = mergeOptions(this.defaultOptions.watchQuery, options);
    }
    return this.queryManager.watchQuery(options);
  }
  /**
   * This resolves a single query according to the options specified and
   * returns a `Promise` which is either resolved with the resulting data
   * or rejected with an error.
   *
   * @param options - An object of type `QueryOptions` that allows us to
   * describe how this query should be treated e.g. whether it should hit the
   * server at all or just resolve from the cache, etc.
   */
  query(options) {
    if (this.defaultOptions.query) {
      options = mergeOptions(this.defaultOptions.query, options);
    }
    if (__DEV__) {
      invariant3(options.fetchPolicy !== "cache-and-network", 67);
      invariant3(options.fetchPolicy !== "standby", 68);
      invariant3(options.query, 69);
      invariant3(options.query.kind === "Document", 70);
      invariant3(!options.returnPartialData, 71);
      invariant3(!options.pollInterval, 72);
      invariant3(!options.notifyOnNetworkStatusChange, 73);
    }
    return this.queryManager.query(options);
  }
  /**
   * This resolves a single mutation according to the options specified and returns a
   * Promise which is either resolved with the resulting data or rejected with an
   * error. In some cases both `data` and `errors` might be undefined, for example
   * when `errorPolicy` is set to `'ignore'`.
   *
   * It takes options as an object with the following keys and values:
   */
  mutate(options) {
    const optionsWithDefaults = mergeOptions(compact({
      fetchPolicy: "network-only",
      errorPolicy: "none"
    }, this.defaultOptions.mutate), options);
    if (__DEV__) {
      invariant3(optionsWithDefaults.mutation, 74);
      invariant3(optionsWithDefaults.fetchPolicy === "network-only" || optionsWithDefaults.fetchPolicy === "no-cache", 75);
    }
    checkDocument(optionsWithDefaults.mutation, OperationTypeNode.MUTATION);
    return this.queryManager.mutate(optionsWithDefaults);
  }
  /**
   * This subscribes to a graphql subscription according to the options specified and returns an
   * `Observable` which either emits received data or an error.
   */
  subscribe(options) {
    const cause = {};
    const observable2 = this.queryManager.startGraphQLSubscription(options);
    const mapped = observable2.pipe(map((result) => ({
      ...result,
      data: this.queryManager.maskOperation({
        document: options.query,
        data: result.data,
        fetchPolicy: options.fetchPolicy,
        cause
      })
    })));
    return Object.assign(mapped, { restart: observable2.restart });
  }
  readQuery(options, optimistic = false) {
    return this.cache.readQuery({ ...options, query: this.transform(options.query) }, optimistic);
  }
  /**
   * Watches the cache store of the fragment according to the options specified
   * and returns an `Observable`. We can subscribe to this
   * `Observable` and receive updated results through an
   * observer when the cache store changes.
   *
   * You must pass in a GraphQL document with a single fragment or a document
   * with multiple fragments that represent what you are reading. If you pass
   * in a document with multiple fragments then you must also specify a
   * `fragmentName`.
   *
   * @since 3.10.0
   * @param options - An object of type `WatchFragmentOptions` that allows
   * the cache to identify the fragment and optionally specify whether to react
   * to optimistic updates.
   */
  watchFragment(options) {
    const dataMasking = this.queryManager.dataMasking;
    return this.cache.watchFragment({
      ...options,
      fragment: this.transform(options.fragment, dataMasking)
    }).pipe(map((result) => {
      if (__DEV__) {
        if (dataMasking) {
          const data = this.queryManager.maskFragment({
            ...options,
            data: result.data
          });
          return { ...result, data };
        }
      }
      return result;
    }));
  }
  readFragment(options, optimistic = false) {
    return this.cache.readFragment({ ...options, fragment: this.transform(options.fragment) }, optimistic);
  }
  /**
   * Writes some data in the shape of the provided GraphQL query directly to
   * the store. This method will start at the root query. To start at a
   * specific id returned by `cache.identify` then use `writeFragment`.
   */
  writeQuery(options) {
    const ref = this.cache.writeQuery(options);
    if (options.broadcast !== false) {
      this.queryManager.broadcastQueries();
    }
    return ref;
  }
  /**
   * Writes some data in the shape of the provided GraphQL fragment directly to
   * the store. This method will write to a GraphQL fragment from any arbitrary
   * id that is currently cached, unlike `writeQuery` which will only write
   * from the root query.
   *
   * You must pass in a GraphQL document with a single fragment or a document
   * with multiple fragments that represent what you are writing. If you pass
   * in a document with multiple fragments then you must also specify a
   * `fragmentName`.
   */
  writeFragment(options) {
    const ref = this.cache.writeFragment(options);
    if (options.broadcast !== false) {
      this.queryManager.broadcastQueries();
    }
    return ref;
  }
  __actionHookForDevTools(cb) {
    this.devToolsHookCb = cb;
  }
  __requestRaw(request) {
    return execute2(this.link, request, { client: this });
  }
  /**
   * Resets your entire store by clearing out your cache and then re-executing
   * all of your active queries. This makes it so that you may guarantee that
   * there is no data left in your store from a time before you called this
   * method.
   *
   * `resetStore()` is useful when your user just logged out. You’ve removed the
   * user session, and you now want to make sure that any references to data you
   * might have fetched while the user session was active is gone.
   *
   * It is important to remember that `resetStore()` _will_ refetch any active
   * queries. This means that any components that might be mounted will execute
   * their queries again using your network interface. If you do not want to
   * re-execute any queries then you should make sure to stop watching any
   * active queries.
   */
  resetStore() {
    return Promise.resolve().then(() => this.queryManager.clearStore({
      discardWatches: false
    })).then(() => Promise.all(this.resetStoreCallbacks.map((fn) => fn()))).then(() => this.refetchObservableQueries());
  }
  /**
   * Remove all data from the store. Unlike `resetStore`, `clearStore` will
   * not refetch any active queries.
   */
  clearStore() {
    return Promise.resolve().then(() => this.queryManager.clearStore({
      discardWatches: true
    })).then(() => Promise.all(this.clearStoreCallbacks.map((fn) => fn())));
  }
  /**
   * Allows callbacks to be registered that are executed when the store is
   * reset. `onResetStore` returns an unsubscribe function that can be used
   * to remove registered callbacks.
   */
  onResetStore(cb) {
    this.resetStoreCallbacks.push(cb);
    return () => {
      this.resetStoreCallbacks = this.resetStoreCallbacks.filter((c) => c !== cb);
    };
  }
  /**
   * Allows callbacks to be registered that are executed when the store is
   * cleared. `onClearStore` returns an unsubscribe function that can be used
   * to remove registered callbacks.
   */
  onClearStore(cb) {
    this.clearStoreCallbacks.push(cb);
    return () => {
      this.clearStoreCallbacks = this.clearStoreCallbacks.filter((c) => c !== cb);
    };
  }
  /**
   * Refetches all of your active queries.
   *
   * `reFetchObservableQueries()` is useful if you want to bring the client back to proper state in case of a network outage
   *
   * It is important to remember that `reFetchObservableQueries()` _will_ refetch any active
   * queries. This means that any components that might be mounted will execute
   * their queries again using your network interface. If you do not want to
   * re-execute any queries then you should make sure to stop watching any
   * active queries.
   * Takes optional parameter `includeStandby` which will include queries in standby-mode when refetching.
   *
   * Note: `cache-only` queries are not refetched by this function.
   *
   * @deprecated Please use `refetchObservableQueries` instead.
   */
  reFetchObservableQueries;
  /**
   * Refetches all of your active queries.
   *
   * `refetchObservableQueries()` is useful if you want to bring the client back to proper state in case of a network outage
   *
   * It is important to remember that `refetchObservableQueries()` _will_ refetch any active
   * queries. This means that any components that might be mounted will execute
   * their queries again using your network interface. If you do not want to
   * re-execute any queries then you should make sure to stop watching any
   * active queries.
   * Takes optional parameter `includeStandby` which will include queries in standby-mode when refetching.
   *
   * Note: `cache-only` queries are not refetched by this function.
   */
  refetchObservableQueries(includeStandby) {
    return this.queryManager.refetchObservableQueries(includeStandby);
  }
  /**
   * Refetches specified active queries. Similar to "refetchObservableQueries()" but with a specific list of queries.
   *
   * `refetchQueries()` is useful for use cases to imperatively refresh a selection of queries.
   *
   * It is important to remember that `refetchQueries()` _will_ refetch specified active
   * queries. This means that any components that might be mounted will execute
   * their queries again using your network interface. If you do not want to
   * re-execute any queries then you should make sure to stop watching any
   * active queries.
   */
  refetchQueries(options) {
    const map2 = this.queryManager.refetchQueries(options);
    const queries = [];
    const results = [];
    map2.forEach((result2, obsQuery) => {
      queries.push(obsQuery);
      results.push(result2);
    });
    const result = Promise.all(results);
    result.queries = queries;
    result.results = results;
    result.catch((error) => {
      __DEV__ && invariant3.debug(76, error);
    });
    return result;
  }
  /**
   * Get all currently active `ObservableQuery` objects, in a `Set`.
   *
   * An "active" query is one that has observers and a `fetchPolicy` other than
   * "standby" or "cache-only".
   *
   * You can include all `ObservableQuery` objects (including the inactive ones)
   * by passing "all" instead of "active", or you can include just a subset of
   * active queries by passing an array of query names or DocumentNode objects.
   *
   * Note: This method only returns queries that have active subscribers. Queries
   * without subscribers are not tracked by the client.
   */
  getObservableQueries(include = "active") {
    return this.queryManager.getObservableQueries(include);
  }
  /**
   * Exposes the cache's complete state, in a serializable format for later restoration.
   *
   * @remarks
   *
   * This can be useful for debugging in order to inspect the full state of the
   * cache.
   *
   * @param optimistic - Determines whether the result contains data from the
   * optimistic layer
   */
  extract(optimistic) {
    return this.cache.extract(optimistic);
  }
  /**
   * Replaces existing state in the cache (if any) with the values expressed by
   * `serializedState`.
   *
   * Called when hydrating a cache (server side rendering, or offline storage),
   * and also (potentially) during hot reloads.
   */
  restore(serializedState) {
    return this.cache.restore(serializedState);
  }
  /**
   * Define a new ApolloLink (or link chain) that Apollo Client will use.
   */
  setLink(newLink) {
    this.link = newLink;
  }
  get defaultContext() {
    return this.queryManager.defaultContext;
  }
  maskedFragmentTransform = new DocumentTransform(removeMaskedFragmentSpreads);
  transform(document, dataMasking = false) {
    const transformed = this.queryManager.transform(document);
    return dataMasking ? this.maskedFragmentTransform.transformDocument(transformed) : transformed;
  }
};
if (__DEV__) {
  ApolloClient.prototype.getMemoryInternals = getApolloClientMemoryInternals;
}

// node_modules/@apollo/client/link/http/parseAndCheckHttpResponse.js
var { hasOwnProperty: hasOwnProperty7 } = Object.prototype;
function isApolloPayloadResult(value) {
  return isNonNullObject(value) && "payload" in value;
}
async function* consumeMultipartBody(response) {
  const decoder = new TextDecoder("utf-8");
  const contentType = response.headers?.get("content-type");
  const match = contentType?.match(
    /*
      ;\s*boundary=                # Match the boundary parameter
      (?:                          # either
        '([^']*)'                  # a string starting with ' doesn't contain ', ends with '
        |                          # or
        "([^"]*)"                  # a string starting with " doesn't contain ", ends with "
        |                          # or
        ([^"'].*?)                 # a string that doesn't start with ' or ", parsed non-greedily
        )                          # end of the group
      \s*                          # optional whitespace
      (?:;|$)                        # match a semicolon or end of string
    */
    /;\s*boundary=(?:'([^']+)'|"([^"]+)"|([^"'].+?))\s*(?:;|$)/i
  );
  const boundary = "\r\n--" + (match?.findLast((val) => !!val) || "-");
  let buffer2 = "";
  invariant3(response.body && typeof response.body.getReader === "function", 60);
  const stream = response.body;
  const reader = stream.getReader();
  let done = false;
  let encounteredBoundary = false;
  let value;
  const passedFinalBoundary = () => encounteredBoundary && buffer2[0] == "-" && buffer2[1] == "-";
  try {
    while (!done) {
      ({ value, done } = await reader.read());
      const chunk = typeof value === "string" ? value : decoder.decode(value);
      const searchFrom = buffer2.length - boundary.length + 1;
      buffer2 += chunk;
      let bi = buffer2.indexOf(boundary, searchFrom);
      while (bi > -1 && !passedFinalBoundary()) {
        encounteredBoundary = true;
        let message;
        [message, buffer2] = [
          buffer2.slice(0, bi),
          buffer2.slice(bi + boundary.length)
        ];
        const i = message.indexOf("\r\n\r\n");
        const headers = parseHeaders(message.slice(0, i));
        const contentType2 = headers["content-type"];
        if (contentType2 && contentType2.toLowerCase().indexOf("application/json") === -1) {
          throw new Error("Unsupported patch content type: application/json is required.");
        }
        const body = message.slice(i);
        if (body) {
          yield body;
        }
        bi = buffer2.indexOf(boundary);
      }
      if (passedFinalBoundary()) {
        return;
      }
    }
    throw new Error("premature end of multipart body");
  } finally {
    reader.cancel();
  }
}
async function readMultipartBody(response, nextValue) {
  for await (const body of consumeMultipartBody(response)) {
    const result = parseJsonEncoding(response, body);
    if (Object.keys(result).length == 0)
      continue;
    if (isApolloPayloadResult(result)) {
      if (Object.keys(result).length === 1 && result.payload === null) {
        return;
      }
      let next = { ...result.payload };
      if ("errors" in result) {
        next.extensions = {
          ...next.extensions,
          [PROTOCOL_ERRORS_SYMBOL]: new CombinedProtocolErrors(result.errors ?? [])
        };
      }
      nextValue(next);
    } else {
      nextValue(result);
    }
  }
}
function parseHeaders(headerText) {
  const headersInit = {};
  headerText.split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i > -1) {
      const name = line.slice(0, i).trim().toLowerCase();
      const value = line.slice(i + 1).trim();
      headersInit[name] = value;
    }
  });
  return headersInit;
}
function parseJsonEncoding(response, bodyText) {
  if (response.status >= 300) {
    throw new ServerError(`Response not successful: Received status code ${response.status}`, { response, bodyText });
  }
  try {
    return JSON.parse(bodyText);
  } catch (err) {
    throw new ServerParseError(err, { response, bodyText });
  }
}
function parseGraphQLResponseJsonEncoding(response, bodyText) {
  try {
    return JSON.parse(bodyText);
  } catch (err) {
    throw new ServerParseError(err, { response, bodyText });
  }
}
function parseResponse(response, bodyText) {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/graphql-response+json")) {
    return parseGraphQLResponseJsonEncoding(response, bodyText);
  }
  return parseJsonEncoding(response, bodyText);
}
function parseAndCheckHttpResponse(operations) {
  return (response) => response.text().then((bodyText) => {
    const result = parseResponse(response, bodyText);
    if (!Array.isArray(result) && !hasOwnProperty7.call(result, "data") && !hasOwnProperty7.call(result, "errors")) {
      throw new ServerError(`Server response was malformed for query '${Array.isArray(operations) ? operations.map((op) => op.operationName) : operations.operationName}'.`, { response, bodyText });
    }
    return result;
  });
}

// node_modules/@apollo/client/link/http/selectHttpOptionsAndBody.js
var defaultHttpOptions = {
  includeQuery: true,
  includeExtensions: true,
  preserveHeaderCase: false
};
var defaultHeaders = {
  // headers are case insensitive (https://stackoverflow.com/a/5259004)
  accept: "application/graphql-response+json,application/json;q=0.9",
  // The content-type header describes the type of the body of the request, and
  // so it typically only is sent with requests that actually have bodies. One
  // could imagine that Apollo Client would remove this header when constructing
  // a GET request (which has no body), but we historically have not done that.
  // This means that browsers will preflight all Apollo Client requests (even
  // GET requests). Apollo Server's CSRF prevention feature (introduced in
  // AS3.7) takes advantage of this fact and does not block requests with this
  // header. If you want to drop this header from GET requests, then you should
  // probably replace it with a `apollo-require-preflight` header, or servers
  // with CSRF prevention enabled might block your GET request. See
  // https://www.apollographql.com/docs/apollo-server/security/cors/#preventing-cross-site-request-forgery-csrf
  // for more details.
  "content-type": "application/json"
};
var defaultOptions = {
  method: "POST"
};
var fallbackHttpConfig = {
  http: defaultHttpOptions,
  headers: defaultHeaders,
  options: defaultOptions
};
var defaultPrinter = (ast, printer) => printer(ast);
function selectHttpOptionsAndBody(operation, fallbackConfig, ...configs) {
  configs.unshift(fallbackConfig);
  return selectHttpOptionsAndBodyInternal(operation, defaultPrinter, ...configs);
}
function selectHttpOptionsAndBodyInternal(operation, printer, ...configs) {
  let options = {};
  let http = {};
  configs.forEach((config2) => {
    options = {
      ...options,
      ...config2.options,
      headers: {
        ...options.headers,
        ...config2.headers
      }
    };
    if (config2.credentials) {
      options.credentials = config2.credentials;
    }
    options.headers.accept = (config2.http?.accept || []).concat(options.headers.accept).join(",");
    http = {
      ...http,
      ...config2.http
    };
  });
  options.headers = removeDuplicateHeaders(options.headers, http.preserveHeaderCase);
  const { operationName, extensions, variables, query } = operation;
  const body = { operationName, variables };
  if (http.includeExtensions && Object.keys(extensions || {}).length)
    body.extensions = extensions;
  if (http.includeQuery)
    body.query = printer(query, print2);
  return {
    options,
    body
  };
}
function removeDuplicateHeaders(headers, preserveHeaderCase) {
  if (!preserveHeaderCase) {
    const normalizedHeaders2 = {};
    Object.keys(Object(headers)).forEach((name) => {
      normalizedHeaders2[name.toLowerCase()] = headers[name];
    });
    return normalizedHeaders2;
  }
  const headerData = {};
  Object.keys(Object(headers)).forEach((name) => {
    headerData[name.toLowerCase()] = {
      originalName: name,
      value: headers[name]
    };
  });
  const normalizedHeaders = {};
  Object.keys(headerData).forEach((name) => {
    normalizedHeaders[headerData[name].originalName] = headerData[name].value;
  });
  return normalizedHeaders;
}

// node_modules/@apollo/client/link/http/checkFetcher.js
var checkFetcher = (fetcher) => {
  invariant3(fetcher || typeof fetch !== "undefined", 59);
};

// node_modules/@apollo/client/link/http/createSignalIfSupported.js
var createSignalIfSupported = () => {
  if (typeof AbortController === "undefined")
    return { controller: false, signal: false };
  const controller = new AbortController();
  const signal = controller.signal;
  return { controller, signal };
};

// node_modules/@apollo/client/link/http/selectURI.js
var selectURI = (operation, fallbackURI) => {
  const context2 = operation.getContext();
  const contextURI = context2.uri;
  if (contextURI) {
    return contextURI;
  } else if (typeof fallbackURI === "function") {
    return fallbackURI(operation);
  } else {
    return fallbackURI || "/graphql";
  }
};

// node_modules/@apollo/client/link/http/rewriteURIForGET.js
function rewriteURIForGET(chosenURI, body) {
  const queryParams = [];
  const addQueryParam = (key, value) => {
    queryParams.push(`${key}=${encodeURIComponent(value)}`);
  };
  if ("query" in body) {
    addQueryParam("query", body.query);
  }
  if (body.operationName) {
    addQueryParam("operationName", body.operationName);
  }
  if (body.variables) {
    let serializedVariables;
    try {
      serializedVariables = JSON.stringify(body.variables);
    } catch (parseError) {
      return { parseError };
    }
    addQueryParam("variables", serializedVariables);
  }
  if (body.extensions) {
    let serializedExtensions;
    try {
      serializedExtensions = JSON.stringify(body.extensions);
    } catch (parseError) {
      return { parseError };
    }
    addQueryParam("extensions", serializedExtensions);
  }
  let fragment = "", preFragment = chosenURI;
  const fragmentStart = chosenURI.indexOf("#");
  if (fragmentStart !== -1) {
    fragment = chosenURI.substr(fragmentStart);
    preFragment = chosenURI.substr(0, fragmentStart);
  }
  const queryParamsPrefix = preFragment.indexOf("?") === -1 ? "?" : "&";
  const newURI = preFragment + queryParamsPrefix + queryParams.join("&") + fragment;
  return { newURI };
}

// node_modules/@apollo/client/link/http/BaseHttpLink.js
var backupFetch = maybe(() => fetch);
function noop3() {
}
var BaseHttpLink = class extends ApolloLink {
  constructor(options = {}) {
    let {
      uri = "/graphql",
      // use default global fetch if nothing passed in
      fetch: preferredFetch,
      print: print3 = defaultPrinter,
      includeExtensions,
      preserveHeaderCase,
      useGETForQueries,
      includeUnusedVariables = false,
      ...requestOptions
    } = options;
    if (__DEV__) {
      checkFetcher(preferredFetch || backupFetch);
    }
    const linkConfig = {
      http: compact({ includeExtensions, preserveHeaderCase }),
      options: requestOptions.fetchOptions,
      credentials: requestOptions.credentials,
      headers: requestOptions.headers
    };
    super((operation) => {
      let chosenURI = selectURI(operation, uri);
      const context2 = operation.getContext();
      const http = { ...context2.http };
      if (isSubscriptionOperation(operation.query)) {
        http.accept = [
          "multipart/mixed;boundary=graphql;subscriptionSpec=1.0",
          ...http.accept || []
        ];
      }
      const contextConfig = {
        http,
        options: context2.fetchOptions,
        credentials: context2.credentials,
        headers: context2.headers
      };
      const { options: options2, body } = selectHttpOptionsAndBodyInternal(operation, print3, fallbackHttpConfig, linkConfig, contextConfig);
      if (body.variables && !includeUnusedVariables) {
        body.variables = filterOperationVariables(body.variables, operation.query);
      }
      let controller = new AbortController();
      let cleanupController = () => {
        controller = void 0;
      };
      if (options2.signal) {
        const externalSignal = options2.signal;
        const listener = () => {
          controller?.abort(externalSignal.reason);
        };
        externalSignal.addEventListener("abort", listener, { once: true });
        cleanupController = () => {
          controller?.signal.removeEventListener("abort", cleanupController);
          controller = void 0;
          externalSignal.removeEventListener("abort", listener);
          cleanupController = noop3;
        };
        controller.signal.addEventListener("abort", cleanupController, {
          once: true
        });
      }
      options2.signal = controller.signal;
      if (useGETForQueries && !isMutationOperation(operation.query)) {
        options2.method = "GET";
      }
      return new Observable((observer) => {
        if (options2.method === "GET") {
          const { newURI, parseError } = rewriteURIForGET(chosenURI, body);
          if (parseError) {
            throw parseError;
          }
          chosenURI = newURI;
        } else {
          options2.body = JSON.stringify(body);
        }
        const currentFetch = preferredFetch || maybe(() => fetch) || backupFetch;
        const observerNext = observer.next.bind(observer);
        currentFetch(chosenURI, options2).then((response) => {
          operation.setContext({ response });
          const ctype = response.headers?.get("content-type");
          if (ctype !== null && /^multipart\/mixed/i.test(ctype)) {
            return readMultipartBody(response, observerNext);
          } else {
            return parseAndCheckHttpResponse(operation)(response).then(observerNext);
          }
        }).then(() => {
          cleanupController();
          observer.complete();
        }).catch((err) => {
          cleanupController();
          observer.error(err);
        });
        return () => {
          if (controller)
            controller.abort();
        };
      });
    });
  }
};

// node_modules/@apollo/client/link/client-awareness/ClientAwarenessLink.js
var ClientAwarenessLink = class extends ApolloLink {
  constructor(options = {}) {
    super((operation, forward) => {
      const client = operation.client;
      const clientOptions = client["queryManager"].clientOptions;
      const context2 = operation.getContext();
      {
        const { name, version: version3, transport = "headers" } = compact({}, clientOptions.clientAwareness, options.clientAwareness, context2.clientAwareness);
        if (transport === "headers") {
          operation.setContext(({ headers, extensions }) => {
            return {
              headers: compact(
                // setting these first so that they can be overridden by user-provided headers
                {
                  "apollographql-client-name": name,
                  "apollographql-client-version": version3
                },
                headers
              )
            };
          });
        }
      }
      {
        const { transport = "extensions" } = compact({}, clientOptions.enhancedClientAwareness, options.enhancedClientAwareness);
        if (transport === "extensions") {
          operation.extensions = compact(
            // setting these first so that it can be overridden by user-provided extensions
            {
              clientLibrary: {
                name: "@apollo/client",
                version: client.version
              }
            },
            operation.extensions
          );
        }
      }
      return forward(operation);
    });
  }
};

// node_modules/@apollo/client/link/http/HttpLink.js
var HttpLink = class extends ApolloLink {
  constructor(options = {}) {
    const { left, right, request } = ApolloLink.from([
      new ClientAwarenessLink(options),
      new BaseHttpLink(options)
    ]);
    super(request);
    Object.assign(this, { left, right });
  }
};
var createHttpLink = (options = {}) => new HttpLink(options);

// node_modules/graphql-tag/lib/index.js
var docCache = /* @__PURE__ */ new Map();
var fragmentSourceMap = /* @__PURE__ */ new Map();
var printFragmentWarnings = true;
var experimentalFragmentVariables = false;
function normalize2(string) {
  return string.replace(/[\s,]+/g, " ").trim();
}
function cacheKeyFromLoc(loc) {
  return normalize2(loc.source.body.substring(loc.start, loc.end));
}
function processFragments(ast) {
  var seenKeys = /* @__PURE__ */ new Set();
  var definitions = [];
  ast.definitions.forEach(function(fragmentDefinition) {
    if (fragmentDefinition.kind === "FragmentDefinition") {
      var fragmentName = fragmentDefinition.name.value;
      var sourceKey = cacheKeyFromLoc(fragmentDefinition.loc);
      var sourceKeySet = fragmentSourceMap.get(fragmentName);
      if (sourceKeySet && !sourceKeySet.has(sourceKey)) {
        if (printFragmentWarnings) {
          console.warn("Warning: fragment with name " + fragmentName + " already exists.\ngraphql-tag enforces all fragment names across your application to be unique; read more about\nthis in the docs: http://dev.apollodata.com/core/fragments.html#unique-names");
        }
      } else if (!sourceKeySet) {
        fragmentSourceMap.set(fragmentName, sourceKeySet = /* @__PURE__ */ new Set());
      }
      sourceKeySet.add(sourceKey);
      if (!seenKeys.has(sourceKey)) {
        seenKeys.add(sourceKey);
        definitions.push(fragmentDefinition);
      }
    } else {
      definitions.push(fragmentDefinition);
    }
  });
  return __assign(__assign({}, ast), { definitions });
}
function stripLoc(doc) {
  var workSet = new Set(doc.definitions);
  workSet.forEach(function(node) {
    if (node.loc)
      delete node.loc;
    Object.keys(node).forEach(function(key) {
      var value = node[key];
      if (value && typeof value === "object") {
        workSet.add(value);
      }
    });
  });
  var loc = doc.loc;
  if (loc) {
    delete loc.startToken;
    delete loc.endToken;
  }
  return doc;
}
function parseDocument(source) {
  var cacheKey = normalize2(source);
  if (!docCache.has(cacheKey)) {
    var parsed = parse(source, {
      experimentalFragmentVariables,
      allowLegacyFragmentVariables: experimentalFragmentVariables
    });
    if (!parsed || parsed.kind !== "Document") {
      throw new Error("Not a valid GraphQL document.");
    }
    docCache.set(cacheKey, stripLoc(processFragments(parsed)));
  }
  return docCache.get(cacheKey);
}
function gql(literals) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  if (typeof literals === "string") {
    literals = [literals];
  }
  var result = literals[0];
  args.forEach(function(arg, i) {
    if (arg && arg.kind === "Document") {
      result += arg.loc.source.body;
    } else {
      result += arg;
    }
    result += literals[i + 1];
  });
  return parseDocument(result);
}
function resetCaches() {
  docCache.clear();
  fragmentSourceMap.clear();
}
function disableFragmentWarnings() {
  printFragmentWarnings = false;
}
function enableExperimentalFragmentVariables() {
  experimentalFragmentVariables = true;
}
function disableExperimentalFragmentVariables() {
  experimentalFragmentVariables = false;
}
var extras = {
  gql,
  resetCaches,
  disableFragmentWarnings,
  enableExperimentalFragmentVariables,
  disableExperimentalFragmentVariables
};
(function(gql_1) {
  gql_1.gql = extras.gql, gql_1.resetCaches = extras.resetCaches, gql_1.disableFragmentWarnings = extras.disableFragmentWarnings, gql_1.enableExperimentalFragmentVariables = extras.enableExperimentalFragmentVariables, gql_1.disableExperimentalFragmentVariables = extras.disableExperimentalFragmentVariables;
})(gql || (gql = {}));
gql["default"] = gql;

export {
  Observable,
  asapScheduler,
  observeOn,
  filter,
  maybe,
  version2 as version,
  build,
  __DEV__,
  setVerbosity,
  invariant3 as invariant,
  canUseDOM,
  Trie,
  createFulfilledPromise,
  createRejectedPromise,
  decoratePromise,
  canonicalStringify,
  maybeDeepFreeze,
  mergeOptions,
  preventUnhandledRejection,
  equal,
  ApolloLink,
  empty2 as empty,
  from2 as from,
  split,
  concat3 as concat,
  execute2 as execute,
  DocumentTransform,
  isReference,
  isNetworkRequestSettled,
  ApolloCache,
  MissingFieldError,
  defaultDataIdFromObject,
  makeVar,
  InMemoryCache,
  CombinedProtocolErrors,
  UnconventionalError,
  CombinedGraphQLErrors,
  LinkError,
  LocalStateError,
  ServerError,
  ServerParseError,
  NetworkStatus,
  ObservableQuery,
  ApolloClient,
  parseAndCheckHttpResponse,
  fallbackHttpConfig,
  defaultPrinter,
  selectHttpOptionsAndBody,
  selectHttpOptionsAndBodyInternal,
  checkFetcher,
  createSignalIfSupported,
  selectURI,
  rewriteURIForGET,
  HttpLink,
  createHttpLink,
  gql,
  resetCaches,
  disableFragmentWarnings,
  enableExperimentalFragmentVariables,
  disableExperimentalFragmentVariables
};
//# sourceMappingURL=chunk-VV7QEEJE.js.map
