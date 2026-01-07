#!/bin/bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ati.lk","password":"admin123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token obtained: ${TOKEN:0:20}..."
echo ""

# Get timetables
echo "Fetching timetables..."
curl -s -X GET "http://localhost:5000/api/timetables" \
  -H "Authorization: Bearer $TOKEN" | jq '.count, .data[0]'
