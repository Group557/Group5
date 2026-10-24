import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

const COLORS = {
  bar: "#E4E2D6",
  inactive: "#4B4B4B",
  activeBg: "#1F4A35",
  activeIcon: "#E4E2D6",
};

type TabIconProps = {
  focused: boolean;
  label: string;
  renderIcon: (color: string) => ReactNode;
};

function TabIcon({ focused, label, renderIcon }: TabIconProps) {
  if (focused) {
    return (
      <View style={styles.activeCircle}>{renderIcon(COLORS.activeIcon)}</View>
    );
  }
  return (
    <View style={styles.tab}>
      {renderIcon(COLORS.inactive)}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Home"
              renderIcon={(c) => <Ionicons name="home-outline" size={28} color={c} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Workouts"
              renderIcon={(c) => (
                <MaterialCommunityIcons name="dumbbell" size={28} color={c} />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rec-center"
        options={{
          title: "Rec Center",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Rec Center"
              renderIcon={(c) => <Ionicons name="stats-chart" size={26} color={c} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="buddy-finder"
        options={{
          title: "Buddy Finder",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Buddy Finder"
              renderIcon={(c) => (
                <MaterialCommunityIcons name="human-greeting-variant" size={28} color={c} />
              )}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Profile"
              renderIcon={(c) => <Ionicons name="person-outline" size={28} color={c} />}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.bar,
    height: 90,
    borderTopWidth: 0,
    paddingTop: 12,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    alignItems: "center",
    width: 100,
  },
  label: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.inactive,
  },
  activeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.activeBg,
    alignItems: "center",
    justifyContent: "center",
  },
});
