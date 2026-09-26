import React, { useState, useMemo, useCallback } from "react"
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import processedCourses from "../data/processed_courses.json"

export const CourseListScreen = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")

  const departments = useMemo(() => {
    const depts = new Set(processedCourses.map((c) => c.department).filter(Boolean))
    return Array.from(depts).sort()
  }, [])

  const [selectedDept, setSelectedDept] = useState("")

  const filteredCourses = useMemo(() => {
    let courses = processedCourses

    if (selectedDept) {
      courses = courses.filter((c) => c.department === selectedDept)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      courses = courses.filter(
        (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
      )
    }

    return courses
  }, [searchQuery, selectedDept])

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
      >
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.term_name} · {item.department}
        </Text>
      </TouchableOpacity>
    ),
    [navigation],
  )

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by course code or title..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        horizontal
        data={["", ...departments]}
        keyExtractor={(item) => item || "ALL"}
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedDept === item && styles.chipActive]}
            onPress={() => setSelectedDept(item)}
          >
            <Text style={[styles.chipText, selectedDept === item && styles.chipTextActive]}>
              {item || "ALL"}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => `${item.id}-${item.term_code}`}
        renderItem={renderItem}
        initialNumToRender={20}
        windowSize={10}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  filterBar: { maxHeight: 40, marginBottom: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 16,
    marginRight: 8,
    height: 32,
  },
  chipActive: { backgroundColor: "#007AFF" },
  chipText: { color: "#333" },
  chipTextActive: { color: "white", fontWeight: "bold" },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  code: { fontWeight: "bold", fontSize: 16 },
  title: { fontSize: 14, color: "#333", marginTop: 2 },
  meta: { fontSize: 12, color: "#999", marginTop: 2 },
})
