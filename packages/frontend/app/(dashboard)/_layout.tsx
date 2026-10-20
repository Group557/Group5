import { Tabs } from "expo-router";
import {
  StyleSheet,
  View,
  type ColorValue
} from "react-native";

import { Icon, type IconName } from "../../theme";
import { colors, tabBar } from "../../theme";

type TabIconNames = {
  ios: string;
  android: string;
  web: string;
};

const TAB_ICONS: Record<string, TabIconNames> = {
  index: {
    ios: "house",
    android: "home",
    web: "home"
  },
  workout: {
    ios: "dumbbell",
    android: "fitness_center",
    web: "fitness_center"
  },
  "rec-center": {
    ios: "building.2",
    android: "location_city",
    web: "location_city"
  },
  dashboard: {
    ios: "person.crop.circle",
    android: "account_circle",
    web: "account_circle"
  }
};

/**
 * The signed in area.
 *
 * Home, Workouts, Rec Center and Account are the four places a
 * member can go, so they are one tap away from each other. The
 * workout detail screens live in their own stack inside the Workouts
 * tab, so they push on top of the list instead of becoming tabs.
 */
export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: tabBar.bar,
        tabBarLabelStyle: tabBar.label,
        sceneStyle: { backgroundColor: colors.canvas }
      }}>
      <Tabs.Screen
        name="homepage"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon name="index" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => (
            <TabIcon name="workout" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="rec-center"
        options={{
          title: "Rec Center",
          tabBarIcon: ({ color }) => (
            <TabIcon name="rec-center" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <TabIcon name="dashboard" color={color} />
          )
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  color
}: {
  name: keyof typeof TAB_ICONS;
  color: ColorValue;
}) {
  const icon = TAB_ICONS[name] as TabIconNames;

  return (
    <View style={styles.icon}>
      <Icon
        name={
          {
            ios: icon.ios,
            android: icon.android,
            web: icon.web
          } as IconName
        }
        size={24}
        color={color}
        weight="regular"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  }
});
