import React from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import processedCourses from "../data/processed_courses.json"

export const CourseDetailScreen = ({ route }) => {
  const navigation = useNavigation()
  const { courseId } = route.params
  const course = processedCourses.find((c) => c.id === courseId)

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Course not found.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.code}>{course.code}</Text>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.meta}>
        {course.term_name} · {course.credits} credits · {course.department}
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text>{course.description || "No description available."}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Prerequisites (raw)</Text>
        <Text>{course.prerequisites_raw || "None"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Exclusions</Text>
        <Text>{course.exclusions_raw || "None"}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Prerequisite", { courseId: course.id })}
      >
        <Text style={styles.buttonText}>Explore Prerequisites</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  code: { fontSize: 24, fontWeight: "bold" },
  title: { fontSize: 18, color: "#333", marginTop: 5 },
  meta: { fontSize: 13, color: "#999", marginTop: 5, marginBottom: 20 },
  section: { marginBottom: 15 },
  label: { fontWeight: "bold", marginBottom: 3, fontSize: 15 },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontWeight: "bold" },
})
