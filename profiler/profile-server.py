
import subprocess
import os
import argparse
import random
import threading
from pymongo import MongoClient
import datetime
import socket
import time
import pathlib

port = 8000
pid = None
host_name = "0.0.0.0"
FREQUENCY = 97
DURATION = 5

def get_perl_scripts():
    delete_file("stackcollapse-perf.pl")
    subprocess.run(['wget', 'https://raw.githubusercontent.com/brendangregg/FlameGraph/810687f180f3c4929b5d965f54817a5218c9d89b/stackcollapse-perf.pl'])
    subprocess.run(['chmod', '+x', 'stackcollapse-perf.pl'])
    delete_file("wget-log")
    delete_file("flamegraph.pl")
    subprocess.run(['wget', 'https://raw.githubusercontent.com/brendangregg/FlameGraph/810687f180f3c4929b5d965f54817a5218c9d89b/flamegraph.pl'])
    subprocess.run(['chmod', '+x', 'flamegraph.pl'])
    delete_file("wget-log")

def parse():
    global port
    parser = argparse.ArgumentParser(description='Sidecar profiler')
    parser.add_argument('--port', dest='port', type=int, nargs='?')
    args = parser.parse_args()
    if args.port is not None:
        port = args.port

def all_steps(frequency=FREQUENCY, duration=DURATION):
    output_file = profile_pid(frequency, duration)
    perf_script_output = run_perf_script(output_file)
    delete_file(output_file)
    stack_collapse_output = run_stack_collapse(perf_script_output)
    delete_file(perf_script_output)
    svg_file = gen_flamegraph(stack_collapse_output)
    return svg_file


# Probably need to set kernel.perf_event_paranoid = -1
# Preferably run with sudo
def profile_pid(frequency, duration):
    output_file = f'perf-{random.randrange(10000)}.data'
    subprocess.run(['rm', '-f', output_file])
    cmd = ['perf', 'record', '-F', str(frequency), '-p', str(pid), '-g', '-o', output_file, '--',
        'sleep', str(duration)]

    if as_sudo():
        cmd = ['sudo'] + cmd

    print("Running command: " + ' '.join(cmd))
    subprocess.run(cmd)
    return output_file

def run_stack_collapse(perf_script_output):
    stack_collapse_output = f'out-{random.randrange(10000)}.folded'
    cmd = [os.path.join(str(pathlib.Path().resolve()), 'stackcollapse-perf.pl'), perf_script_output]
    if as_sudo():
        cmd = ['sudo'] + cmd
    f = open(stack_collapse_output, "w")
    print(f'About to run: {" ".join(cmd)}')
    subprocess.run(cmd, stdout=f)
    subprocess.run(['rm', '-f', perf_script_output])
    return stack_collapse_output

def gen_flamegraph(collapsed_stacks):
    cmd = [os.path.join(str(pathlib.Path().resolve()), 'flamegraph.pl'), collapsed_stacks]
    if as_sudo():
        cmd = ['sudo'] + cmd
    output_file = f'kernel-{random.randrange(10000)}.svg'
    f = open(output_file, "w")
    print(f'About to run: {" ".join(cmd)}')
    subprocess.run(cmd, stdout=f, check=True)
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

def delete_file(file_name):
    cmd = ['rm', '-f', file_name]
    if as_sudo():
        cmd = ['sudo'] + cmd
    print(f'About to run {" ".join(cmd)}')
    subprocess.run(cmd)



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
    get_perl_scripts()
    setup()

    #client = MongoClient('mongodb+srv://skunkworks:skunkworks@cluster0.vqgeawv.mongodb.net/?retryWrites=true&w=majority')
    client = MongoClient(os.environ["ATLAS_URI"])
    db = client['flamegraphs']
    print(f'filepath: {__file__}')

    while True:
        print("In while true")
        try:
            svg_file = all_steps()
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(e)
            delete_file("*.perf")
            delete_file("*.folded")
            delete_file("*.data")
            continue
        f = open(svg_file, 'r')
        b = f.read()
        f.close()
        post = {"hostname": socket.gethostname(),
            "flamegraph": b,
            "date": datetime.datetime.utcnow()}
        delete_file(svg_file)

        insert_id = db.flamegraphs.insert_one(post)
        print(insert_id)
