import React, { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import processedCourses from "../data/processed_courses.json"

const courseMap = new Map()
processedCourses.forEach((c) => {
  if (!courseMap.has(c.code)) {
    courseMap.set(c.code, c)
  }
})

const extractPrerequisiteCodes = (text) => {
  if (!text) return []
  const regex = /\b([A-Z]{3,4})\s?(\d{4}[A-Z]?)\b/g
  const results = []
  let match
  while ((match = regex.exec(text)) !== null) {
    results.push(`${match[1]} ${match[2]}`)
  }
  return [...new Set(results)]
}

const PrerequisiteNode = ({ courseCode, visited, level = 0 }) => {
  const course = courseMap.get(courseCode)
  const [expanded, setExpanded] = useState(level < 1)

  if (!course) {
    return (
      <Text style={[styles.node, { marginLeft: level * 20, color: "#999" }]}>
        {courseCode} (not in dataset)
      </Text>
    )
  }

  const prereqCodes = extractPrerequisiteCodes(course.prerequisites_raw)
  const isCycle = visited.has(course.code)
  const canExpand = prereqCodes.length > 0 && !isCycle

  return (
    <View style={{ marginLeft: level * 20, marginTop: 6 }}>
      <TouchableOpacity onPress={() => canExpand && setExpanded(!expanded)} disabled={!canExpand}>
        <Text style={[styles.node, { color: isCycle ? "#c00" : "#007AFF" }]}>
          {canExpand ? (expanded ? "▼ " : "▶ ") : "• "}
          {courseCode} — {course.title}
          {isCycle ? "  (already shown)" : ""}
        </Text>
      </TouchableOpacity>

      {expanded &&
        !isCycle &&
        prereqCodes.map((code) => (
          <PrerequisiteNode
            key={code}
            courseCode={code}
            visited={new Set(visited).add(course.code)}
            level={level + 1}
          />
        ))}
    </View>
  )
}

export const PrerequisiteScreen = ({ route }) => {
  const { courseId } = route.params
  const course = processedCourses.find((c) => c.id === courseId)

  if (!course) return <Text>Course not found</Text>

  const prereqCodes = extractPrerequisiteCodes(course.prerequisites_raw)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Prerequisites for {course.code}</Text>
      {prereqCodes.length === 0 ? (
        <Text>This course has no listed prerequisites.</Text>
      ) : (
        prereqCodes.map((code) => (
          <PrerequisiteNode key={code} courseCode={code} visited={new Set([course.code])} />
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  node: { fontSize: 14, paddingVertical: 2 },
})
