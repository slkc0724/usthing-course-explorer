# just for my testing and debugging
import json
import re

with open('app/data/processed_courses.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

print(f"Total processed courses: {len(courses)}")
print("=" * 60)

print("\n[CHECK 1] Sample courses WITH prerequisites:")
print("-" * 60)

count = 0
for c in courses:
    if c["prerequisites_raw"]:
        print(f"  {c['code']} - {c['title'][:50]}")
        print(f"    Term: {c['term_name']}")
        print(f"    Prereq: {c['prerequisites_raw'][:120]}")
        print()
        count += 1
        if count >= 3:
            break

print("\n[CHECK 2] Testing prerequisite code extraction:")
print("-" * 60)

def extract_prerequisite_codes(text):
    if not text:
        return []
    regex = r'\b([A-Z]{3,4})\s?(\d{4}[A-Z]?)\b'
    matches = re.findall(regex, text)
    results = [f"{m[0]} {m[1]}" for m in matches]
    return list(set(results))

with_prereq = [c for c in courses if c["prerequisites_raw"]]
print(f"Testing on {min(10, len(with_prereq))} courses:")
for c in with_prereq[:10]:
    codes = extract_prerequisite_codes(c["prerequisites_raw"])
    print(f"  {c['code']}: extracted -> {codes}")

print("\n[CHECK 3] Overall statistics:")
print("-" * 60)
with_prereq_count = sum(1 for c in courses if c["prerequisites_raw"])
print(f"  Total courses: {len(courses)}")
print(f"  With prerequisites: {with_prereq_count}")
print(f"  Without prerequisites: {len(courses) - with_prereq_count}")

unique_codes = set(c["code"] for c in courses)
print(f"  Unique course codes: {len(unique_codes)}")

unique_depts = set(c["department"] for c in courses if c["department"])
print(f"  Unique departments: {len(unique_depts)}")
print(f"  Sample departments: {sorted(list(unique_depts))[:10]}")

print("\n[CHECK 4] Simulating prerequisite tree traversal:")
print("-" * 60)

course_map = {}
for c in courses:
    if c["code"] not in course_map:
        course_map[c["code"]] = c

def find_prereq_tree(course_code, visited=None, level=0, max_level=3):
    """Simulate the recursive traversal in React Native"""
    if visited is None:
        visited = set()
    
    indent = "  " * level
    
    if course_code in visited:
        print(f"{indent}{course_code} (cycle detected, stopping)")
        return
    
    course = course_map.get(course_code)
    if not course:
        print(f"{indent}{course_code} (not in dataset)")
        return
    
    print(f"{indent}{course_code} - {course['title'][:50]}")
    
    if level >= max_level:
        return
    
    visited.add(course_code)
    prereq_codes = extract_prerequisite_codes(course["prerequisites_raw"])
    
    for code in prereq_codes:
        find_prereq_tree(code, visited.copy(), level + 1, max_level)

test_course = None
for c in with_prereq:
    codes = extract_prerequisite_codes(c["prerequisites_raw"])
    if codes:
        test_course = c
        break

if test_course:
    print(f"Root: {test_course['code']}")
    find_prereq_tree(test_course["code"])
else:
    print("  No course found to test.")

print("\n[CHECK 5] Simulating search functionality:")
print("-" * 60)

def search_courses(query):
    q = query.strip().lower()
    if not q:
        return courses

    code_matches = [c for c in courses if q in c["code"].lower()]
    title_matches = [
        c for c in courses
        if q not in c["code"].lower() and q in c["title"].lower()
    ]
    return code_matches + title_matches

for query in ["COMP", "accounting", "1021"]:
    results = search_courses(query)
    print(f"  Search '{query}': {len(results)} results")
    if results:
        print(f"    First: {results[0]['code']} - {results[0]['title'][:60]}")

print("\n" + "=" * 60)
print("ALL CHECKS COMPLETE")
print("=" * 60)