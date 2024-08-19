import json
import sys
import random
import calendar

# Load the schedule data from the JSON file passed as an argument
schedule_data_file = sys.argv[1]
with open(schedule_data_file, 'r') as file:
    data = json.load(file)

schedule_data = data['scheduleData']
month_year = data['month']

# Extract month and year from the "02-2024" format
month, year = map(int, month_year.split('-'))

# Determine the number of days in the specified month and year
_, total_days = calendar.monthrange(year, month)

doctors_per_visit = {
    'Super Core': 6,  # 6 visits
    'Core': 4,        # 4 visits
    'Important': 2    # 2 visits
}

# Generate random doctors' list based on schedule_data
doctors = [
    {
        "name": dr['findDr']['firstName'],
        "category": dr['findDr']['visit_type'],
        "address": dr['findAddress'][0]['address']  # Assuming there's at least one address per doctor
    } for dr in schedule_data
]
random.shuffle(doctors)

# Partition the doctors randomly into three categories
partitions = {
    'Super Core': [],
    'Core': [],
    'Important': []
}

# Randomly assign doctors to categories
for doctor in doctors:
    if len(partitions['Super Core']) < len(doctors) * 0.2:  # 20% of doctors
        partitions['Super Core'].append(doctor)
    elif len(partitions['Core']) < len(doctors) * 0.5:  # 50% of doctors
        partitions['Core'].append(doctor)
    else:
        partitions['Important'].append(doctor)  # Remaining 30% of doctors

# Allocate visits over the number of days in the specified month
visit_plan = {}

# Function to allocate visits sequentially
def allocate_visits_in_order(category, num_visits):
    doctors = partitions[category]
    day = 1
    for doctor in doctors:
        for _ in range(num_visits):
            if day > total_days:
                break
            date_str = f"{day:02d}-{month:02d}-{year}"
            if date_str not in visit_plan:
                visit_plan[date_str] = []
            visit_plan[date_str].append({
                "doctor": doctor['name'],
                "category": category,
                "address": doctor['address']
            })
            day += 1

# Allocate visits based on category in order
allocate_visits_in_order('Super Core', doctors_per_visit['Super Core'])
allocate_visits_in_order('Core', doctors_per_visit['Core'])
allocate_visits_in_order('Important', doctors_per_visit['Important'])

# Return the visit plan as a JSON string
print(json.dumps(visit_plan))
