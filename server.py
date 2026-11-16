
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json

BASE_DIR = Path(__file__).resolve().parent
LOG_FOLDER = BASE_DIR / "data" / "logs"

class ArchiveHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/logs":
            logs = []

            for file in sorted(LOG_FOLDER.glob("*.json")):
                try:
                    with file.open("r", encoding="utf-8") as f:
                        logs.append(json.load(f))
                except (json.JSONDecodeError, OSError) as error:
                    print(f"Could not load {file}: {error}")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(logs).encode("utf-8"))
        else:
            super().do_GET()

server = ThreadingHTTPServer(("localhost", 8000), ArchiveHandler)

print("ESC Archive running at http://localhost:8000")
server.serve_forever()
