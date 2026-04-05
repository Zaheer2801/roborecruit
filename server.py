import http.server
import socketserver
import csv
import json
import os

PORT = 3000
DIRECTORY = "public"

class APIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def do_GET(self):
        if self.path == '/api/drivers':
            try:
                # Read the CSV natively on the backend server
                csv_path = os.path.join(os.path.dirname(__file__), 'roborecruit_drivers_1000.csv')
                
                drivers = []
                with open(csv_path, mode='r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    for row in reader:
                        # Convert number strings to floats/ints for JS compatibility
                        for key, value in row.items():
                            if value.isdigit():
                                row[key] = int(value)
                            else:
                                try:
                                    row[key] = float(value)
                                except ValueError:
                                    pass
                        drivers.append(row)
                
                # Serialize to JSON and send response
                json_data = json.dumps(drivers)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json_data.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_msg = json.dumps({"error": str(e)})
                self.wfile.write(error_msg.encode('utf-8'))
        else:
            # Serve standard static frontend files from /public
            super().do_GET()

with socketserver.TCPServer(("", PORT), APIHandler) as httpd:
    print(f"Backend Server running successfully on port {PORT}")
    print(f"REST API available at http://localhost:{PORT}/api/drivers")
    httpd.serve_forever()
