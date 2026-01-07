import fs from "node:fs/promises";

export const hasContentChanged = async (path: string, newContent: string) => {
  try {
    const currentContent = await fs.readFile(path, "utf-8");
    return currentContent !== newContent;
  } catch {
    return true;
  }
};
