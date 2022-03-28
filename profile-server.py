
import subprocess
import os
import argparse

from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8000
PID = None

def main():
    global PID
    parse()
    # We probably could get stack traces for the entire system instead
    PID = get_mongod_pid()
    webServer = HTTPServer(('', PORT), ProfileServer)
    try:
        print(f"Starting server on port {PORT}")
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")

def parse():
    global PORT
    parser = argparse.ArgumentParser(description='Sidecar profiler')
    parser.add_argument('--port', dest='port', type=int, nargs='?')
    args = parser.parse_args()
    if args.port is not None:
        PORT = args.port

def handle_profile(profile_server):
    profile_pid()
    run_perf_script()

    profile_server.send_response(200)
    profile_server.end_headers()
    with open('out.perf', 'rb') as f:
        profile_server.wfile.write(f.read())


PATH_HANDLERS = {
    '/debug/pprof/profile': handle_profile
}



class ProfileServer(BaseHTTPRequestHandler):
    def do_GET(self):
        PATH_HANDLERS[self.path](self)



# Probably need to set kernel.perf_event_paranoid = -1
# Preferably run with sudo
def profile_pid():
    subprocess.run(['rm', '-f', 'perf.data'])
    frequency_hertz = 99
    duration_secs = 10
    cmd = ['perf', 'record', '-F', str(frequency_hertz), '-p', str(PID), '-g', '--',
        'sleep', str(duration_secs)]

    if as_sudo():
        cmd = ['sudo'] + cmd

    print("Running command: " + ' '.join(cmd))
    subprocess.run(cmd)

def run_perf_script():
    cmd = ['perf', 'script', '-i', 'perf.data']
    if as_sudo():
        cmd = ['sudo'] + cmd

    subprocess.run(['rm', '-f', 'out.perf'])
    print("Running command: " + ' '.join(cmd))
    with open('out.perf', 'w') as f:
        subprocess.run(cmd, stdout=f)


def get_mongod_pid():
    cmd = ['ps', 'aux']

    if as_sudo():
        cmd = ['sudo'] + cmd

    ps_output = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout.splitlines()
    for line in ps_output:
        if b'mongod' in line:
            return int(line.split()[1].strip())
    raise RuntimeError("Could not find mongod process")


def as_sudo():
    return os.environ['USER'] == 'root'



if __name__ == "__main__":
    main()
