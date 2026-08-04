const logs = [];

function describeError(err) {
  if (err instanceof Error) {
    const code = err.code ? ` (${err.code})` : "";
    const name = err.name && err.name !== "Error" ? `${err.name}: ` : "";
    return `${name}${err.message}${code}`;
  }
  if (err === undefined) return "undefined";
  if (err === null) return "null";
  if (typeof err === "object") {
    try {
      return JSON.stringify(err);
    } catch (_) {
      return String(err);
    }
  }
  return String(err);
}

function stringify(part) {
  return part instanceof Error || typeof part === "object"
    ? describeError(part)
    : String(part);
}

function addLog(...parts) {
  const time = new Date().toLocaleTimeString();
  const message = parts.map(stringify).join(" ");
  const formatted = `[${time}] ${message}`;

  console.log(formatted); // still goes to Render logs

  logs.push(formatted);

  if (logs.length > 300) logs.shift();
}

function addErrorLog(scope, err) {
  addLog(`${scope} ${describeError(err)}`);
  if (err instanceof Error && err.stack) console.error(err.stack);
}

function getLogs() {
  return logs;
}

module.exports = { addLog, addErrorLog, describeError, getLogs };
