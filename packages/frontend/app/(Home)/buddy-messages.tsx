import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "@/components/ui/Icon";
import {
  MOCK_CHATS,
  initials,
  type ChatThread
} from "@/constants/mockChats";
import {
  layout,
  palette,
  radius,
  space,
  text
} from "@/constants/theme";

const AVATAR_SIZE = 56;

/** Last message as the inbox preview, prefixed when you sent it. */
function previewFor(chat: ChatThread) {
  const last = chat.messages[chat.messages.length - 1];
  if (!last) {
    return { text: "Say hi!", time: "" };
  }
  return {
    text:
      last.sender === "me" ? `You: ${last.text}` : last.text,
    time: last.time
  };
}

/* ------------------------------------------------------------------ *
 * Inbox row
 * ------------------------------------------------------------------ */

type ChatRowProps = {
  chat: ChatThread;
  onPress: () => void;
};

function ChatRow({ chat, onPress }: ChatRowProps) {
  const preview = previewFor(chat);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.pressed
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${chat.name}${chat.unread ? ", unread" : ""}. ${preview.text}${preview.time ? `, ${preview.time}` : ""}`}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {initials(chat.name)}
        </Text>
      </View>

      <View style={styles.rowText}>
        <Text
          style={[
            styles.rowName,
            chat.unread && styles.rowUnread
          ]}
          numberOfLines={1}>
          {chat.name}
        </Text>
        <Text
          style={[
            styles.rowPreview,
            chat.unread && styles.rowUnread
          ]}
          numberOfLines={1}>
          {preview.text}
        </Text>
      </View>

      {preview.time ? (
        <Text
          style={[
            styles.rowTime,
            chat.unread && styles.rowUnread
          ]}>
          {preview.time}
        </Text>
      ) : null}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function BuddyMessagesScreen() {
  // Insets come from the provider Expo Router mounts at the root.
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const search = query.trim().toLowerCase();
  const chats = search
    ? MOCK_CHATS.filter((chat) =>
        chat.name.toLowerCase().includes(search)
      )
    : MOCK_CHATS;

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, layout.minTopInset),
          paddingLeft: insets.left,
          paddingRight: insets.right
        }
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <Icon
            name={{
              ios: "chevron.left",
              android: "chevron_left",
              web: "chevron_left"
            }}
            size={18}
            color={palette.sage}
          />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          Messages
        </Text>
        {/* Balances the back button so the title stays centred. */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.search}>
        <Icon
          name={{
            ios: "magnifyingglass",
            android: "search",
            web: "search"
          }}
          size={16}
          color={palette.inkMuted}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          placeholderTextColor={palette.inkMuted}
          autoCorrect={false}
          style={styles.searchInput}
          accessibilityLabel="Search messages"
        />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(chat) => chat.id}
        renderItem={({ item }) => (
          <ChatRow
            chat={item}
            onPress={() =>
              router.push({
                pathname: "/buddy-chat",
                params: { id: item.id }
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No conversations found.
          </Text>
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom + space.xxl
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.canvas
  },
  pressed: {
    opacity: layout.pressedOpacity
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.screenGutter,
    marginBottom: space.sm
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    minWidth: 64,
    minHeight: layout.minTouch
  },
  backLabel: {
    ...text.bodyStrong,
    color: palette.sage
  },
  title: {
    ...text.title,
    color: palette.ink,
    textAlign: "center",
    flex: 1
  },
  headerSpacer: {
    minWidth: 64
  },

  // Search
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    marginHorizontal: layout.screenGutter,
    marginBottom: space.md
  },
  searchInput: {
    ...text.body,
    color: palette.ink,
    flex: 1,
    minHeight: 40
  },

  // Inbox rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.screenGutter,
    paddingVertical: space.sm,
    minHeight: AVATAR_SIZE + space.lg
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: palette.surfaceSage,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    ...text.heading,
    color: palette.sage
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: space.md
  },
  rowName: {
    ...text.body,
    color: palette.ink
  },
  rowPreview: {
    ...text.caption,
    color: palette.inkMuted,
    marginTop: 2
  },
  rowUnread: {
    fontWeight: "700",
    color: palette.ink
  },
  rowTime: {
    ...text.caption,
    color: palette.inkMuted
  },
  empty: {
    ...text.body,
    color: palette.inkMuted,
    textAlign: "center",
    marginTop: space.xxl
  }
});
