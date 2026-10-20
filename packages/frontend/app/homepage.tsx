import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>
      {/* App name */}
      <View style={styles.logoRow}>
        <Text style={styles.logoIcon}>✣</Text>
        <Text style={styles.logo}>PolyFit</Text>
        <View style={styles.logoDot} />
      </View>

      {/* Greeting */}
      <View style={styles.helloBox}>
        <Text style={styles.dateText}>THURSDAY · OCT 01</Text>

        <View style={styles.greetingRow}>
          <Text style={styles.helloText}>HI GROUP5!</Text>

          <View style={styles.profileCircle}>
            <View style={styles.profileHead} />
            <View style={styles.profileBody} />
          </View>
        </View>
      </View>

      {/* Streak */}
      <View style={styles.streakBox}>
        <View style={styles.streakInfo}>
          <Text style={styles.flame}>♨</Text>
          <View>
            <Text style={styles.streakNumber}>8</Text>
            <Text style={styles.streakLabel}>DAY STREAK</Text>
          </View>
        </View>

        <View style={styles.daysRow}>
          <View style={styles.dayColumn}>
            <View
              style={[styles.dayCircle, styles.completedDay]}>
              <Text style={styles.check}>✓</Text>
            </View>
            <Text style={styles.dayLabel}>M</Text>
          </View>

          <View style={styles.dayColumn}>
            <View
              style={[styles.dayCircle, styles.completedDay]}>
              <Text style={styles.check}>✓</Text>
            </View>
            <Text style={styles.dayLabel}>T</Text>
          </View>

          <View style={styles.dayColumn}>
            <View
              style={[styles.dayCircle, styles.completedDay]}>
              <Text style={styles.check}>✓</Text>
            </View>
            <Text style={styles.dayLabel}>W</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={[styles.dayCircle, styles.currentDay]}>
              <Text style={styles.currentDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>T</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={styles.dayCircle}>
              <Text style={styles.futureDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>F</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={styles.dayCircle}>
              <Text style={styles.futureDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>S</Text>
          </View>

          <View style={styles.dayColumn}>
            <View style={styles.dayCircle}>
              <Text style={styles.futureDot}>•</Text>
            </View>
            <Text style={styles.dayLabel}>S</Text>
          </View>
        </View>
      </View>

      {/* Upcoming bookings */}
      <View style={styles.largeBox}>
        <Text style={styles.cardTitle}>
          My Upcoming Bookings
        </Text>
        <Text style={styles.cardSubtitle}>
          Your scheduled workouts will appear here.
        </Text>
      </View>

      {/* Notifications */}
      <View style={styles.largeBox}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.cardSubtitle}>
          Updates and reminders will appear here.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0"
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 32
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28
  },
  logoIcon: {
    color: "#154734",
    fontSize: 25,
    marginRight: 7
  },
  logo: {
    color: "#154734",
    fontSize: 22,
    fontWeight: "800"
  },
  logoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#BD8013",
    marginLeft: 7,
    marginTop: 5
  },

  helloBox: {
    backgroundColor: "#154734",
    padding: 20,
    marginBottom: 20
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700"
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8
  },
  helloText: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800"
  },
  profileCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: "#BD8013",
    backgroundColor: "#D7DDDA",
    alignItems: "center",
    justifyContent: "center"
  },
  profileHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    marginBottom: 3
  },
  profileBody: {
    width: 34,
    height: 19,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#FFFFFF"
  },

  streakBox: {
    backgroundColor: "#E9E8D8",
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center"
  },
  streakInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: 135
  },
  flame: {
    color: "#789F90",
    fontSize: 28,
    marginRight: 9
  },
  streakNumber: {
    color: "#5B5F61",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 28
  },
  streakLabel: {
    color: "#5B5F61",
    fontSize: 11,
    fontWeight: "800"
  },
  daysRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dayColumn: {
    alignItems: "center"
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#BBD7CF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6
  },
  completedDay: {
    backgroundColor: "#84AA9E"
  },
  currentDay: {
    backgroundColor: "#F8F6F0",
    borderWidth: 2,
    borderColor: "#84AA9E"
  },
  check: {
    color: "#154734",
    fontSize: 18,
    fontWeight: "800"
  },
  currentDot: {
    color: "#154734",
    fontSize: 22
  },
  futureDot: {
    color: "#6B7280",
    fontSize: 18
  },
  dayLabel: {
    color: "#5B5F61",
    fontSize: 11,
    fontWeight: "700"
  },

  largeBox: {
    height: 156,
    backgroundColor: "#84AA9E",
    padding: 18,
    marginBottom: 20
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  cardSubtitle: {
    color: "#EAF3EF",
    fontSize: 13,
    marginTop: 8
  }
});
