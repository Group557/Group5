import { isUsernameTaken } from "./username";

test("rejects a username if it is already taken", () => {
    const username = "maddie";
    const takenUsernames = ["maddie", "maddie123", "mads"];

    const taken = isUsernameTaken(username, takenUsernames);

    expect(taken).toBe(true);
})