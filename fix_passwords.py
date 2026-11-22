import subprocess

psql_exe = r"C:\Users\SIDHANT\tools\pgsql\bin\psql.exe"

# 1. Fetch exact valid BCrypt hash from temp_test
res = subprocess.check_output([
    psql_exe, "-U", "postgres", "-d", "mindbridge_db", "-t", "-c",
    "SELECT password_hash FROM users WHERE email='temp_test@mindbridge.local';"
]).decode().strip()

print(f"Using exact BCrypt hash: {res}")

# 2. Update all accounts
emails = [
    'dr.sharma@mindbridge.local',
    'dr.verma@mindbridge.local',
    'dr.ananya@mindbridge.local',
    'admin@mindbridge.local',
    'himanshuyadav6844@gmail.com',
    'patient@example.com',
    'aarav.patel@mindbridge.local'
]

for email in emails:
    subprocess.check_call([
        psql_exe, "-U", "postgres", "-d", "mindbridge_db", "-c",
        f"UPDATE users SET password_hash = '{res}' WHERE email = '{email}';"
    ])

print("All user passwords successfully synchronized to 'Password123!'")
