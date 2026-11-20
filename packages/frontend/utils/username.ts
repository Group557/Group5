export function normalizeUsername(text: string): string {
    return text.toLowerCase().replace(/\s/g, "")
}

export function validateUsername(username: string): string | null {
    if (!/^[a-z0-9._]{3,20}$/.test(username)) {
    return "3–20 characters: lowercase letters, numbers, . or _";
  }
  return null;
}

export function isUsernameTaken(username: string, existingUsernames: string[]): boolean {
    return existingUsernames.includes(username);
  }