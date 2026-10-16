import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (

    <View style={styles.page}>
      <View style={styles.logoBox}>
        <Text style={styles.logo}>PolyFit</Text>
      </View>

      <View style={styles.helloBox}>
        <Text>THURSDAY · OCT 01</Text>
        <Text style={styles.helloText}>HI GROUP5!</Text>
      </View>

      <View style={styles.streakBox}>
        <Text>5 DAY STREAK</Text>
        <Text>✓ ✓ ✓ • • • •</Text>
      </View>

      <View style={styles.largeBox}>
        <Text>My Upcoming Bookings</Text>
      </View>

      <View style={styles.largeBox}>
        <Text>Notifications</Text>
      </View>

      <View style={styles.navBox}>
        <Text>Home</Text>
        <Text>Workouts</Text>
        <Text>Rec Center</Text>
        <Text>Buddy Finder</Text>
        <Text>Profile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  logoBox: {
    padding: 15,
    marginBottom: 15,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
  },
  helloBox: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
  },
  helloText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  streakBox: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 25,
  },
  largeBox: {
    borderWidth: 1,
    height: 150,
    padding: 15,
    marginBottom: 20,
  },
  navBox: {
    borderWidth: 1,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

   /* <View>
      <View>
        <Text>PolyFit</Text>
      </View>

      <View>
        <Text>THURSDAY · OCT 01</Text>
        <Text>HI GROUP5!</Text>
      </View>

      <View>
        <Text>5 DAY STREAK</Text>
        <Text>✓ ✓ ✓ • • • •</Text>
      </View>

      <View>
        <Text>My Upcoming Bookings</Text>
      </View>

      <View>
        <Text>Notifications</Text>
      </View>

      <View>
        <Text>
          Home Workouts Rec Center Buddy Finder Profile
        </Text>
      </View>
    </View>
    
  );
}*/
