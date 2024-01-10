const fs = require("fs");
const path = require("path");

function formatCode(code, fileType) {
  if (fileType === "js") {
    return code.replace(/\s+/g, " ").trim();
  } else if (fileType === "html") {
    return formatHtml(code);
  }
  return code;
}

function formatHtml(code) {
  const indentSize = 2;
  const lines = code.split("\n");
  let indents = 0;
  let formattedCode = "";
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("</")) {
      indents -= 1;
    }
    formattedCode += " ".repeat(indents * indentSize) + trimmedLine + "\n";
    if (trimmedLine.startsWith("<") && !trimmedLine.endsWith("/>")) {
      indents += 1;
    }
  });
  return formattedCode.trim();
}

function formatFile(filePath) {
  const fileName = path.basename(filePath);

  // Exclude files with names like "unicformater123.js" from formatting
  if (!fileName.match(/unicformater\d+\.js/)) {
    try {
      const code = fs.readFileSync(filePath, "utf-8");
      const fileType = path.extname(filePath).slice(1);
      const formattedCode = formatCode(code, fileType);
      fs.writeFileSync(filePath, formattedCode, "utf-8");
      console.log(`Formatted: ${filePath}`);
    } catch (error) {
      console.error(`Error formatting ${filePath}: ${error.message}`);
    }
  } else {
    console.log(`Skipped formatting: ${filePath}`);
  }
}

function formatDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      formatDirectory(filePath);
    } else {
      const fileExtension = path.extname(filePath).slice(1);
      if (["js", "html"].includes(fileExtension)) {
        formatFile(filePath);
      }
    }
  });
}

function findProjectDirectory(currentPath) {
  const markerFile = "package-lock.json";
  while (!fs.existsSync(path.join(currentPath, markerFile))) {
    currentPath = path.dirname(currentPath);
    if (currentPath === path.dirname(currentPath)) {
      throw new Error("Project directory not found");
    }
  }
  return currentPath;
}

const projectDirectory = findProjectDirectory(__dirname);
console.log("checkMe", projectDirectory);
formatDirectory(projectDirectory);
