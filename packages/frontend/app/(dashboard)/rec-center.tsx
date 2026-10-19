import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RecCenterScreen() {
  const handleRecIdPress = () => {
    // TODO: implement rec ID scan-in
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.todayLabel}>TODAY</Text>
          <Text style={styles.greeting}>Good day</Text>
        </View>
        <View style={styles.headerCircle} />
      </View>

      {/* My Rec ID */}
      <Pressable style={styles.recIdCard} onPress={handleRecIdPress}>
        <View style={styles.recIdRow}>
          <View style={styles.recIdIcon} />
          <View style={styles.recIdText}>
            <Text style={styles.recIdTitle}>My Rec ID</Text>
            <Text style={styles.recIdSubtitle}>Tap to scan in</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Pressable>

      {/* Live crowd card */}
      <View style={styles.crowdCard}>
        <View style={styles.crowdHeader}>
          <Text style={styles.crowdLabel}>RECREATION CENTER</Text>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.crowdSubtitle}>Live crowd level</Text>
        <View style={styles.crowdMain}>
          <View>
            <Text style={styles.crowdLevelLabel}>Crowd level</Text>
            <Text style={styles.crowdLevelValuePlaceholder}>
              Percent full will show here
            </Text>
          </View>
          <View style={styles.crowdCircle} />
        </View>
        <View style={styles.divider} />
        <View style={styles.bestTimeRow}>
          <Text style={styles.bestTimeLabel}>Best time to go: </Text>
          <Text style={styles.bestTimeValue}>will show here</Text>
        </View>
      </View>

      {/* Today's activity */}
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Today's activity</Text>
          <Text style={styles.activityPill}>Today</Text>
        </View>
        <Text style={styles.activitySubtitle}>Crowd chart will show here</Text>
        <View style={styles.chartArea} />
      </View>

      {/* Info tiles */}
      <View style={styles.tilesRow}>
        <View style={styles.tile}>
          <View style={styles.tileIconCloses} />
          <View style={styles.tileText}>
            <Text style={styles.tileLabel}>Closes at</Text>
            <Text style={styles.tileValue}>Time will show here</Text>
          </View>
        </View>
        <View style={styles.tile}>
          <View style={styles.tileIconWait} />
          <View style={styles.tileText}>
            <Text style={styles.tileLabel}>Current wait</Text>
            <Text style={styles.tileValue}>Wait will show here</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0",
    padding: 20,
  },
  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  todayLabel: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#789F90",
    textTransform: "uppercase",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: "#154734",
    marginTop: 4,
  },
  headerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#154734",
  },
  // My Rec ID
  recIdCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  recIdRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recIdIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#BD8013",
  },
  recIdText: {
    flex: 1,
    marginHorizontal: 12,
  },
  recIdTitle: {
    fontWeight: "bold",
    color: "#154734",
    fontSize: 16,
  },
  recIdSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  chevron: {
    color: "#6B7280",
    fontWeight: "600",
  },
  // Live crowd card
  crowdCard: {
    backgroundColor: "#154734",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  crowdHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  crowdLabel: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#87CDC2",
    textTransform: "uppercase",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#BD8013",
    marginRight: 6,
  },
  liveText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  crowdSubtitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 14,
  },
  crowdMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  crowdLevelLabel: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 30,
  },
  crowdLevelValuePlaceholder: {
    color: "#C9DDD5",
    fontSize: 13,
    marginTop: 4,
  },
  crowdCircle: {
    width: 84,
    height: 84,
    borderWidth: 8,
    borderColor: "#BD8013",
    borderRadius: 42,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 10,
  },
  bestTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bestTimeLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  bestTimeValue: {
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 4,
  },
  // Today's activity
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityTitle: {
    color: "#154734",
    fontWeight: "bold",
    fontSize: 18,
  },
  activityPill: {
    backgroundColor: "#E6EFEA",
    color: "#154734",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "600",
  },
  activitySubtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 14,
  },
  chartArea: {
    height: 130,
    backgroundColor: "#EEF3EF",
    borderRadius: 12,
  },
  // Info tiles
  tilesRow: {
    flexDirection: "row",
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
  },
  tileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tileIconCloses: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#DCEBE5",
  },
  tileIconWait: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F6E8C8",
  },
  tileText: {
    marginLeft: 10,
  },
  tileLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  tileValue: {
    fontWeight: "bold",
    color: "#154734",
    fontSize: 16,
    marginTop: 2,
  },
});
