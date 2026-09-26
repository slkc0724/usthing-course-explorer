# HKUST Course Explorer

A React Native + Expo app for browsing HKUST courses and exploring prerequisite relationships as an interactive tree.

Built for the **USThing App Team 2026-27 Fall Technical Test**.

---

## Setup & Run

**Prerequisites:** Node.js 18+, Yarn, Python 3.10+, Expo Go app (or iOS/Android simulator).

```bash
# 1. Install dependencies
yarn install

# 2. Preprocess the raw dataset (required before first run)
python preprocess_data.py

# 3. Start the app
yarn start
```

Scan the QR code with Expo Go, or press `i` (iOS) / `a` (Android) in the terminal.

---

## Platforms Tested

- **Data processing & logic:** Python 3.10 (Windows)
- **App logic:** Verified via `test.py`, a Python simulation mirroring the React Native implementation.

> The developer did not have access to an iOS/Android simulator during development, so all core logic (search, filter, prerequisite traversal) was first validated in Python, then ported to React Native.

---

## Architecture

```
app/
├── data/processed_courses.json   # Lightweight preprocessed dataset
├── navigators/AppNavigator.tsx   # Stack navigation
└── screens/
    ├── CourseListScreen.tsx      # Browse, search, filter
    ├── CourseDetailScreen.tsx    # Course info + entry to prereq tree
    └── PrerequisiteScreen.tsx    # Recursive prerequisite tree

preprocess_data.py                # Raw data → lightweight JSON
test.py                     # Python verification of app logic
courses.json                      # Raw dataset (28 MB)
```

- **State management:** Local `useState` + `useMemo`. No global state library needed (dataset is read-only, loaded once).
- **Navigation:** React Navigation (Stack).

---

## Data Processing

The raw `courses.json` is ~28 MB with **15,178 records** (course × term combinations). Loading it directly would be slow.

`preprocess_data.py`:

1. Reads the raw list.
2. Combines `prefix` + `number` → `code` (e.g. `"ACCT 1010"`).
3. Renames fields (`prerequisite` → `prerequisites_raw`).
4. Cleans whitespace in text fields.
5. Deduplicates by `(code, term)`.
6. Drops long unused fields (`cilos`, `attributes`, `timestamp`).

**Result:** **4,030 unique course codes** across **72 departments**. About **26%** (3,973 records) have prerequisite info.

---

## Search & Filter

Implemented in `CourseListScreen.tsx` with `useMemo`.

- **Design decision:** When a query matches a course-code prefix (e.g. `"COMP"`), code matches are sorted **before** title matches. So typing `"COMP"` shows COMP courses first, not "Company" courses.
- **Filter:** Department chips (72 options + "ALL").
- **Performance:** `FlatList` with `initialNumToRender={20}` and `windowSize={10}`.

---

## Prerequisite Traversal

`PrerequisiteScreen` renders prerequisites as an **expandable tree**.

1. **Extraction:** Regex `/\b([A-Z]{3,4})\s?(\d{4}[A-Z]?)\b/g` pulls course codes from free-form text (e.g. `"COMP 1021"`, `"MATH1013"`).
2. **Recursion:** A recursive `<PrerequisiteNode>` component. First level expanded by default.
3. **Cycle handling:** A `visited` set (copied at each recursion step) tracks the path. Repeated courses are marked `"already shown"` in red and not expanded further.
4. **Missing courses:** Rendered as `"(not in dataset)"` in gray.
5. **No prerequisites:** Shows _"This course has no listed prerequisites."_

---

## Assumptions, Limitations & Optional Features

**Assumptions**

- Dataset is bundled (no live API). All required features work offline.
- Multiple records per course across terms are shown as separate list entries; prerequisite lookup uses the first occurrence per code.

**Limitations**

- Prerequisite parsing is heuristic; it does not understand AND/OR, GPA cutoffs, or phrases like "for non-BIBU students". A full NLP parser was explicitly not required.
- Section quota/enrolment is not displayed — per the 2026-09-24 update, the supplied dataset does not include these fields.
- No persistence (favourites not implemented).

**Optional features implemented**

- Department filter chips.
- Smart search ordering (code matches first).
- Cycle-safe prerequisite traversal with visual indicators.

**Not implemented**

- Favourites / persistent preferences
- Dependency graph visualization
- "What this course unlocks" reverse lookup
- Fuzzy search

---
