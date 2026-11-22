import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://localhost:8080/api/auth/login"

accounts = [
    ("Patient Demo (patient@example.com)", "patient@example.com", "Password123!", 200),
    ("Patient Demo (aarav.patel@mindbridge.local)", "aarav.patel@mindbridge.local", "Password123!", 200),
    ("Registered User (himanshuyadav6844@gmail.com)", "himanshuyadav6844@gmail.com", "Password123!", 200),
    ("Doctor (dr.sharma@mindbridge.local)", "dr.sharma@mindbridge.local", "Password123!", 200),
    ("Doctor (dr.verma@mindbridge.local)", "dr.verma@mindbridge.local", "Password123!", 200),
    ("Doctor (dr.ananya@mindbridge.local)", "dr.ananya@mindbridge.local", "Password123!", 200),
    ("Admin (admin@mindbridge.local)", "admin@mindbridge.local", "Password123!", 200),
    ("Security Test: Incorrect Password", "patient@example.com", "WrongPassword!", 401),
    ("Security Test: Unknown Email", "unknown_user@example.com", "AnyPassword123!", 401)
]

all_passed = True

print("=== RUNNING MULTI-ACCOUNT AUTHENTICATION VERIFICATION ===")
for label, email, password, expected_status in accounts:
    payload = json.dumps({"email": email, "password": password}).encode("utf-8")
    req = urllib.request.Request(BASE_URL, data=payload, headers={"Content-Type": "application/json"})
    
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            status = resp.status
            if status == expected_status:
                role = data.get("data", {}).get("role")
                token_present = bool(data.get("data", {}).get("token"))
                print(f"[PASS] {label}: Status {status} OK | Role: {role} | Token Generated: {token_present}")
            else:
                print(f"[FAIL] {label}: Expected {expected_status} but got {status}")
                all_passed = False
    except urllib.error.HTTPError as e:
        status = e.code
        body = json.loads(e.read().decode())
        if status == expected_status:
            print(f"[PASS] {label}: Correctly rejected with HTTP {status} ({body.get('message')})")
        else:
            print(f"[FAIL] {label}: Expected {expected_status} but got HTTP {status} ({body})")
            all_passed = False
    except Exception as e:
        print(f"[ERROR] {label}: {e}")
        all_passed = False

if all_passed:
    print("\n>>> ALL 9 AUTHENTICATION TESTS PASSED SUCCESSFULLY! <<<")
else:
    print("\n>>> SOME TESTS FAILED <<<")
    sys.exit(1)
