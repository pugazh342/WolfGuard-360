import socket
import requests
from sqlalchemy.orm import Session
from app import models
from datetime import datetime
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

COMMON_PORTS = [21, 22, 23, 25, 53, 80, 443, 3306, 5432, 8080]

SENSITIVE_PATHS = [
    "/.git/config", "/.env", "/phpinfo.php", "/admin/", "/login.php", "/.aws/credentials", "/backup.zip"
]

# --- NEW: Subdomain Enumeration ---
def enumerate_subdomains(domain: str):
    print(f"[SCANNER] Hunting for subdomains for {domain}...")
    subdomains = set()
    try:
        # Query the public Certificate Transparency logs
        url = f"https://crt.sh/?q=%.{domain}&output=json"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            for entry in data:
                name = entry.get('name_value', '').lower()
                # Clean up wildcards (e.g., *.target.com -> target.com)
                if not name.startswith("*.") and name != domain.lower():
                    # Sometimes crt.sh returns multiple domains separated by newlines
                    for split_name in name.split('\n'):
                        subdomains.add(split_name.strip())
    except Exception as e:
        print(f"[SCANNER] Subdomain enum failed: {e}")
    
    return list(subdomains)[:15] # Limit to 15 so we don't overwhelm the dashboard
# -----------------------------------

def perform_scan(asset_id: int, db: Session):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset: return

    print(f"[SCANNER] Starting Advanced Scan for: {asset.domain}")
    
    try:
        # 1. Resolve IP
        ip_address = socket.gethostbyname(asset.domain)
        asset.ip_address = ip_address
        
        # 2. Subdomain Enumeration
        asset.subdomains = enumerate_subdomains(asset.domain)
        
        # 3. Port Scan
        open_ports = []
        for port in COMMON_PORTS:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2.0) 
            if sock.connect_ex((ip_address, port)) == 0:
                open_ports.append(port)
            sock.close()
        asset.ports = open_ports

        # 4. Vulnerability Scan
        found_vulns = []
        if 80 in open_ports or 443 in open_ports:
            protocol = "https" if 443 in open_ports else "http"
            base_url = f"{protocol}://{asset.domain}"
            for path in SENSITIVE_PATHS:
                try:
                    res = requests.get(base_url + path, timeout=5, verify=False)
                    if res.status_code == 200 and "html" not in res.headers.get("Content-Type", ""):
                        found_vulns.append(f"Exposed: {path}")
                except Exception:
                    pass 
        asset.vulnerabilities = found_vulns
        
        asset.last_scanned = datetime.now()
        db.commit()
        print(f"[SCANNER] Finished {asset.domain}")
        
    except Exception as e:
        print(f"[SCANNER] Error: {e}")