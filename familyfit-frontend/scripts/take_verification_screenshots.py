import subprocess, os, time

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

# 1. Login page screenshot
login_out = os.path.abspath('public/images/verify_login_screen.png')
subprocess.run([
    chrome, 
    '--headless=new', 
    '--disable-gpu',
    f'--screenshot={login_out}', 
    '--window-size=1440,900', 
    'http://localhost:5173/login'
], capture_output=True, text=True)
print(f'Captured: {login_out}, exists: {os.path.exists(login_out)}')

# 2. Landing navbar screenshot
landing_out = os.path.abspath('public/images/verify_landing_nav.png')
subprocess.run([
    chrome, 
    '--headless=new', 
    '--disable-gpu',
    f'--screenshot={landing_out}', 
    '--window-size=1440,500', 
    'http://localhost:5173/'
], capture_output=True, text=True)
print(f'Captured: {landing_out}, exists: {os.path.exists(landing_out)}')

# 3. Create a verification html file rendering all logo components in dark and light backgrounds
verify_html = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; margin: 0; padding: 24px; background: #f0f2f5; }
    .card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .card-dark { background: #132A1C; color: white; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    h3 { margin-top: 0; font-size: 16px; color: #475467; }
    .card-dark h3 { color: #A5D6A7; }
    .row { display: flex; gap: 32px; align-items: center; }
  </style>
</head>
<body>
  <div class="card">
    <h3>Header / Navbar Color Logo (Light Background)</h3>
    <img src="/brand/logo-lockup.svg" height="40" />
  </div>

  <div class="card-dark">
    <h3>Footer White Logo with Tagline (Dark Green Background #132A1C)</h3>
    <img src="/brand/logo-full-white.svg" height="52" />
  </div>

  <div class="card-dark">
    <h3>Header White Logo (over dark photo on login page)</h3>
    <img src="/brand/logo-lockup-white.svg" height="40" />
  </div>
</body>
</html>"""

with open('public/verify_brand_logos.html', 'w', encoding='utf-8') as f:
    f.write(verify_html)

logos_out = os.path.abspath('public/images/verify_brand_logos.png')
subprocess.run([
    chrome,
    '--headless=new',
    '--disable-gpu',
    f'--screenshot={logos_out}',
    '--window-size=1000,500',
    'http://localhost:5173/verify_brand_logos.html'
], capture_output=True, text=True)
print(f'Captured: {logos_out}, exists: {os.path.exists(logos_out)}')
