import json
import re
import os

def clean_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def main():
    input_file = 'courses.json'
    output_file = 'app/data/processed_courses.json'

    print(f"Reading {input_file} ...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    courses_list = data
    print(f"Total records: {len(courses_list)}")

    processed_courses = []
    seen = set() 

    for course in courses_list:
        prefix = course.get("prefix", "").strip()
        number = course.get("number", "").strip()
        code = f"{prefix} {number}".strip()

        if not code:
            continue

        term_name = course.get("term_name", "")
        key = f"{code}|{term_name}"
        if key in seen:
            continue
        seen.add(key)

        processed = {
            "id": course.get("id", ""),
            "code": code,
            "title": course.get("title", ""),
            "description": clean_text(course.get("description", "")),
            "department": course.get("department_code", ""),
            "term_name": term_name,
            "term_code": course.get("term_code", ""),
            "academic_year": course.get("academic_year", ""),
            "credits": course.get("min_credits", 0),
            "prerequisites_raw": clean_text(course.get("prerequisite", "")),
            "corequisites_raw": clean_text(course.get("corequisite", "")),
            "exclusions_raw": clean_text(course.get("exclusion", "")),
        }
        processed_courses.append(processed)

    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    print(f"Writing {len(processed_courses)} processed courses to {output_file} ...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(processed_courses, f, ensure_ascii=False, separators=(',', ':'))

    print("Done!")
    with_prereq = sum(1 for c in processed_courses if c["prerequisites_raw"])
    print(f"Courses with prerequisites: {with_prereq} / {len(processed_courses)}")

if __name__ == "__main__":
    main()