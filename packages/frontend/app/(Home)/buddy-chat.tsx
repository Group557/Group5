import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "@/components/ui/Icon";
import {
  findChat,
  initials,
  type ChatMessage,
  type ChatThread
} from "@/constants/mockChats";
import {
  layout,
  palette,
  radius,
  space,
  text
} from "@/constants/theme";

const HEADER_AVATAR_SIZE = 36;
const BUBBLE_AVATAR_SIZE = 28;
const INTRO_AVATAR_SIZE = 88;

/** Used when the chat is opened for someone with no messages yet. */
const NEW_CHAT: ChatThread = {
  id: "new",
  name: "Name",
  subtitle: "Major and year will show here",
  unread: false,
  messages: []
};

function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours < 12 ? "AM" : "PM";
  return `${hours % 12 || 12}:${minutes} ${suffix}`;
}

/* ------------------------------------------------------------------ *
 * Avatar
 * ------------------------------------------------------------------ */

type AvatarProps = {
  name: string;
  size: number;
};

function Avatar({ name, size }: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 }
      ]}>
      <Text
        style={[styles.avatarText, { fontSize: size * 0.38 }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Message bubble
 * ------------------------------------------------------------------ */

type BubbleProps = {
  message: ChatMessage;
  buddyName: string;
  /** A time label sits above the first message of each time group. */
  showTime: boolean;
  /** The buddy's avatar only sits beside the last message in a run. */
  showAvatar: boolean;
};

function Bubble({
  message,
  buddyName,
  showTime,
  showAvatar
}: BubbleProps) {
  const isMine = message.sender === "me";

  return (
    <View>
      {showTime ? (
        <Text style={styles.timeLabel}>{message.time}</Text>
      ) : null}
      <View
        style={[
          styles.bubbleRow,
          isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs
        ]}>
        {isMine ? null : showAvatar ? (
          <Avatar name={buddyName} size={BUBBLE_AVATAR_SIZE} />
        ) : (
          <View style={styles.avatarSpacer} />
        )}
        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleTheirs
          ]}>
          <Text
            style={[
              styles.bubbleText,
              isMine && styles.bubbleTextMine
            ]}>
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export default function BuddyChatScreen() {
  // Insets come from the provider Expo Router mounts at the root.
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const chat = findChat(id) ?? NEW_CHAT;

  const [messages, setMessages] = useState(chat.messages);
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const canSend = draft.trim().length > 0;

  const handleSendPress = () => {
    if (!canSend) {
      return;
    }
    // TODO: send through the backend; for now it only shows locally.
    setMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        sender: "me",
        text: draft.trim(),
        time: formatTime(new Date())
      }
    ]);
    setDraft("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View
        style={[
          styles.screen,
          {
            paddingTop: Math.max(
              insets.top,
              layout.minTopInset
            ),
            paddingLeft: insets.left,
            paddingRight: insets.right
          }
        ]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={space.sm}
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
              size={20}
              color={palette.ink}
            />
          </Pressable>
          <Avatar name={chat.name} size={HEADER_AVATAR_SIZE} />
          <View style={styles.headerText}>
            <Text
              style={styles.headerName}
              numberOfLines={1}
              accessibilityRole="header">
              {chat.name}
            </Text>
            <Text
              style={styles.headerSubtitle}
              numberOfLines={1}>
              {chat.subtitle}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          style={styles.flex}
          data={messages}
          keyExtractor={(message) => message.id}
          renderItem={({ item, index }) => {
            const previous = messages[index - 1];
            const next = messages[index + 1];
            return (
              <Bubble
                message={item}
                buddyName={chat.name}
                showTime={
                  !previous || previous.time !== item.time
                }
                showAvatar={
                  !next || next.sender !== item.sender
                }
              />
            );
          }}
          ListHeaderComponent={
            // Like a new DM: who you're talking to, before any messages.
            <View style={styles.intro}>
              <Avatar
                name={chat.name}
                size={INTRO_AVATAR_SIZE}
              />
              <Text style={styles.introName}>{chat.name}</Text>
              <Text style={styles.introSubtitle}>
                {chat.subtitle}
              </Text>
              <Pressable
                onPress={() => router.push("/buddy-profile")}
                style={({ pressed }) => [
                  styles.introButton,
                  pressed && styles.pressed
                ]}
                accessibilityRole="button"
                accessibilityLabel={`View ${chat.name}'s profile`}>
                <Text style={styles.introButtonText}>
                  View profile
                </Text>
              </Pressable>
            </View>
          }
          contentContainerStyle={styles.messages}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        {/* Composer */}
        <View
          style={[
            styles.composerBar,
            { paddingBottom: insets.bottom + space.sm }
          ]}>
          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message..."
              placeholderTextColor={palette.inkMuted}
              multiline
              style={styles.composerInput}
              accessibilityLabel="Message"
            />
            {canSend ? (
              <Pressable
                onPress={handleSendPress}
                hitSlop={space.sm}
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.pressed
                ]}
                accessibilityRole="button"
                accessibilityLabel="Send">
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
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
    gap: space.md,
    paddingHorizontal: layout.screenGutter,
    paddingBottom: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.surfaceSage
  },
  backButton: {
    minHeight: layout.minTouch,
    justifyContent: "center"
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  headerName: {
    ...text.bodyStrong,
    color: palette.ink
  },
  headerSubtitle: {
    ...text.caption,
    color: palette.inkMuted
  },

  // Avatar
  avatar: {
    backgroundColor: palette.surfaceSage,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    fontWeight: "700",
    color: palette.sage
  },
  avatarSpacer: {
    width: BUBBLE_AVATAR_SIZE
  },

  // Intro
  intro: {
    alignItems: "center",
    paddingVertical: space.xxl
  },
  introName: {
    ...text.title,
    color: palette.ink,
    marginTop: space.md
  },
  introSubtitle: {
    ...text.caption,
    color: palette.inkMuted,
    marginTop: 2
  },
  introButton: {
    minHeight: 36,
    justifyContent: "center",
    borderRadius: radius.sm,
    paddingHorizontal: space.lg,
    backgroundColor: palette.surfaceSage,
    marginTop: space.md
  },
  introButtonText: {
    ...text.label,
    color: palette.forest
  },

  // Messages
  messages: {
    paddingHorizontal: layout.screenGutter,
    paddingBottom: space.md
  },
  timeLabel: {
    ...text.label,
    color: palette.inkMuted,
    textAlign: "center",
    marginTop: space.lg,
    marginBottom: space.sm
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: space.sm,
    marginTop: 2
  },
  bubbleRowMine: {
    justifyContent: "flex-end"
  },
  bubbleRowTheirs: {
    justifyContent: "flex-start"
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: radius.lg,
    paddingHorizontal: space.md,
    paddingVertical: space.sm
  },
  bubbleMine: {
    backgroundColor: palette.forest
  },
  bubbleTheirs: {
    backgroundColor: palette.surface
  },
  bubbleText: {
    ...text.body,
    color: palette.ink
  },
  bubbleTextMine: {
    color: palette.onDark
  },

  // Composer
  composerBar: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: space.sm,
    backgroundColor: palette.canvas
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.surfaceSage,
    paddingLeft: space.lg,
    paddingRight: space.md,
    minHeight: layout.minTouch
  },
  composerInput: {
    ...text.body,
    color: palette.ink,
    flex: 1,
    maxHeight: 120,
    paddingVertical: space.sm
  },
  sendButton: {
    marginLeft: space.sm,
    minHeight: layout.minTouch,
    justifyContent: "center"
  },
  sendText: {
    ...text.bodyStrong,
    color: palette.forest
  }
});
