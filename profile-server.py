
import subprocess
import os
import argparse
import random
import threading
import flask

port = 8000
pid = None
host_name = "0.0.0.0"
app = flask.Flask(__name__)

def parse():
    global port
    parser = argparse.ArgumentParser(description='Sidecar profiler')
    parser.add_argument('--port', dest='port', type=int, nargs='?')
    args = parser.parse_args()
    if args.port is not None:
        port = args.port

@app.route("/flamegraph", methods=["GET"])
def handle_profile():
    output_file = profile_pid()
    perf_script_output = run_perf_script(output_file)
    stack_collapse_output = run_stack_collapse(perf_script_output)
    svg_file = gen_flamegraph(stack_collapse_output)

    return flask.send_file(svg_file)

@app.route("/favicon.ico", methods=["GET"])
def handle_favicon():
    resp = flask.Response()
    resp.status = 404
    return resp


# Probably need to set kernel.perf_event_paranoid = -1
# Preferably run with sudo
def profile_pid():
    output_file = f'perf-{random.randrange(10000)}.data'
    subprocess.run(['rm', '-f', output_file])
    frequency_hertz = 197
    duration_secs = 5
    cmd = ['perf', 'record', '-F', str(frequency_hertz), '-p', str(pid), '-g', '-o', output_file, '--',
        'sleep', str(duration_secs)]

    if as_sudo():
        cmd = ['sudo'] + cmd

    print("Running command: " + ' '.join(cmd))
    subprocess.run(cmd)
    return output_file

def run_stack_collapse(perf_script_output):
    stack_collapse_output = f'out-{random.randrange(10000)}.folded'
    cmd = [os.path.join(os.path.dirname(__file__), 'stackcollapse-perf.pl'), perf_script_output]
    if as_sudo():
        cmd = ['sudo'] + cmd
    f = open(stack_collapse_output, "w")
    print(f'About to run: {" ".join(cmd)}')
    subprocess.run(cmd, stdout=f)
    subprocess.run(['rm', '-f', perf_script_output])
    return stack_collapse_output

def gen_flamegraph(collapsed_stacks):
    cmd = [os.path.join(os.path.dirname(__file__), 'flamegraph.pl'), collapsed_stacks]
    if as_sudo():
        cmd = ['sudo'] + cmd
    output_file = f'kernel-{random.randrange(10000)}.svg'
    f = open(output_file, "w")
    print(f'About to run: {" ".join(cmd)}')
    subprocess.run(cmd, stdout=f)
    subprocess.run(['rm', '-f', collapsed_stacks])
    return output_file

def run_perf_script(perf_record_output):
    perf_script_output = f'out-{random.randrange(10000)}.perf'
    cmd = ['perf', 'script', '-i', perf_record_output]
    if as_sudo():
        cmd = ['sudo'] + cmd

    print("Running command: " + ' '.join(cmd))
    with open(perf_script_output, 'w') as f:
        subprocess.run(cmd, stdout=f)
    subprocess.run(['rm', '-f', perf_record_output])

    return perf_script_output


def get_mongod_pid():
    cmd = ['pgrep', 'mongod']
    if as_sudo():
        cmd = ['sudo'] + cmd
    ps_output = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout.splitlines()
    for line in ps_output:
        return int(line.strip())
    raise RuntimeError("Could not find mongod process")


def as_sudo():
    return os.environ['USER'] == 'root'

def setup():
    global pid
    pid = get_mongod_pid()


if __name__ == "__main__":
    setup()
    threading.Thread(target=lambda: app.run(host=host_name, port=port, debug=True, use_reloader=False)).start()
    while True:
        pass
