import requests
import json

BASE_URL = "http://localhost:8000"
tests_passed = 0
tests_failed = 0

def test(name, condition, details=""):
    global tests_passed, tests_failed
    if condition:
        print(f"  ✅ PASS — {name}")
        tests_passed += 1
    else:
        print(f"  ❌ FAIL — {name} {details}")
        tests_failed += 1

print("\n" + "="*60)
print("  TAKA SMART WASTE — SYSTEM VALIDATION TEST")
print("="*60)

print("\n📡 Testing Backend Connection...")
try:
    r = requests.get(f"{BASE_URL}/")
    test("Backend is running", r.status_code == 200)
    test("API returns correct message", "Taka" in r.json().get("message", ""))
except Exception as e:
    test("Backend connection", False, str(e))

print("\n🔐 Testing Authentication...")
try:
    r = requests.post(f"{BASE_URL}/api/auth/register?full_name=Test+User&email=testvalidation@taka.com&password=test123&phone=0700000001&location=Nairobi+Test")
    test("User registration works", r.status_code == 200)
except Exception as e:
    test("User registration", False, str(e))

try:
    r = requests.post(f"{BASE_URL}/api/auth/login?email=testvalidation@taka.com&password=test123")
    test("User login works", r.status_code == 200)
    token = r.json().get("access_token")
    test("JWT token received", token is not None)
    headers = {"Authorization": f"Bearer {token}"}
except Exception as e:
    test("User login", False, str(e))
    headers = {}
    token = None

print("\n📋 Testing Reports...")
try:
    r = requests.get(f"{BASE_URL}/api/reports/", headers=headers)
    test("Get reports works", r.status_code == 200)
except Exception as e:
    test("Get reports", False, str(e))

print("\n📅 Testing Schedules...")
try:
    r = requests.get(f"{BASE_URL}/api/schedules/", headers=headers)
    test("Get schedules works", r.status_code == 200)
except Exception as e:
    test("Get schedules", False, str(e))

print("\n🔔 Testing Notifications...")
try:
    r = requests.get(f"{BASE_URL}/api/notifications/", headers=headers)
    test("Get notifications works", r.status_code == 200)
    r = requests.get(f"{BASE_URL}/api/notifications/unread-count", headers=headers)
    test("Unread count works", r.status_code == 200)
except Exception as e:
    test("Notifications", False, str(e))

print("\n🏢 Testing Companies...")
try:
    r = requests.get(f"{BASE_URL}/api/companies/", headers=headers)
    test("Get companies works", r.status_code == 200)
except Exception as e:
    test("Get companies", False, str(e))

print("\n🔑 Testing Admin Login...")
try:
    r = requests.post(f"{BASE_URL}/api/auth/login?email=admin@taka.com&password=admin123")
    test("Admin login works", r.status_code == 200)
    admin_token = r.json().get("access_token")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    test("Admin token received", admin_token is not None)
except Exception as e:
    test("Admin login", False, str(e))
    admin_headers = {}

print("\n📊 Testing Admin Dashboard...")
try:
    r = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=admin_headers)
    test("Admin dashboard works", r.status_code == 200)
    r = requests.get(f"{BASE_URL}/api/admin/leaderboard", headers=admin_headers)
    test("Leaderboard works", r.status_code == 200)
    r = requests.get(f"{BASE_URL}/api/admin/analytics", headers=admin_headers)
    test("Analytics works", r.status_code == 200)
    r = requests.get(f"{BASE_URL}/api/admin/compliance", headers=admin_headers)
    test("Compliance works", r.status_code == 200)
except Exception as e:
    test("Admin features", False, str(e))

print("\n" + "="*60)
print(f"  RESULTS: {tests_passed} passed | {tests_failed} failed")
if tests_failed == 0:
    print("  🎉 ALL TESTS PASSED — System is ready!")
else:
    print("  ⚠️  Some tests failed — check errors above")
print("="*60 + "\n")