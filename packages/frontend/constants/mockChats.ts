/* ------------------------------------------------------------------ *
 * Mock buddy conversations
 *
 * Sample data for the Buddy Finder messages screens until chats come
 * from the backend. Names and messages are made up.
 * ------------------------------------------------------------------ */

export type ChatMessage = {
  id: string;
  /** "me" for the signed-in user, otherwise the buddy. */
  sender: "me" | "buddy";
  text: string;
  /** Display time, already formatted. */
  time: string;
};

export type ChatThread = {
  id: string;
  name: string;
  /** Short line under the name in the chat header. */
  subtitle: string;
  unread: boolean;
  messages: ChatMessage[];
};

export const MOCK_CHATS: ChatThread[] = [
  {
    id: "alex",
    name: "Alex",
    subtitle: "Kinesiology · 3rd year",
    unread: true,
    messages: [
      {
        id: "1",
        sender: "buddy",
        text: "Hey! Saw you're into lifting too",
        time: "9:12 AM"
      },
      {
        id: "2",
        sender: "me",
        text: "Yeah! Mostly push/pull/legs",
        time: "9:15 AM"
      },
      {
        id: "3",
        sender: "buddy",
        text: "Want to hit legs tomorrow at 7?",
        time: "9:16 AM"
      }
    ]
  },
  {
    id: "jordan",
    name: "Jordan",
    subtitle: "Computer Science · 2nd year",
    unread: false,
    messages: [
      {
        id: "1",
        sender: "me",
        text: "Are you still doing the 6 AM runs?",
        time: "Yesterday"
      },
      {
        id: "2",
        sender: "buddy",
        text: "Every weekday, you should come",
        time: "Yesterday"
      }
    ]
  },
  {
    id: "sam",
    name: "Sam",
    subtitle: "Biology · 4th year",
    unread: false,
    messages: [
      {
        id: "1",
        sender: "buddy",
        text: "Thanks for spotting me today!",
        time: "Mon"
      }
    ]
  }
];

export function findChat(id: string | undefined) {
  return MOCK_CHATS.find((chat) => chat.id === id);
}

/** Up to two initials for the avatar placeholder. */
export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}
