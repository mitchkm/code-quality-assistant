import os
import shutil
import subprocess

DIST_DIR = "dist"
WEB_UI_DIR = "web-ui"
CODE_ANALYSIS_DIR = "code-analysis"

'''
Commands executed (if done via shell):
rmdir -r ./dist
mkdir ./dist
cd web-ui
node ./bundler.js > ../dist/bundle.js
cp ./dist/index.html ../dist/index.html
cd ..

'''

# Make empty dist directory
print("Cleaning old dist directory...")
shutil.rmtree(DIST_DIR, ignore_errors=True)
print("\tDone!")

print("Making new dist directory...")
os.mkdir(DIST_DIR)
print("\tDone!")

# Create bundled web-ui javascript
print("Bundling javascript visualizer...")
bundle = open(DIST_DIR + "/bundle.js", "w")

proc = subprocess.Popen(["node", "bundler.js"], cwd=WEB_UI_DIR, stdout=bundle, stderr=subprocess.PIPE)
err = proc.stderr.read()
if err: 
    print("\tFailed to bundle typescript code!")
    exit()

proc = subprocess.Popen(["cp", WEB_UI_DIR + "/dist/index.html", DIST_DIR + "/index.html"], stderr=subprocess.PIPE)
err = proc.stderr.read()
if err: 
    print("\tFailed to copy index.html!")
    exit()

print("\tDone!")

# Inject web-ui code
print("Injecting web-ui code into python script...")
proc = subprocess.Popen(["cp", CODE_ANALYSIS_DIR + "/lizard-to-json.py", DIST_DIR + "/lizard-to-json.py"], stderr=subprocess.PIPE)
err = proc.stderr.read()
if err: 
    print("\tFailed to copy index.html!")
    exit()
print("\tNOT IMPLEMENTED!")
# print("\tDone!")

# Build standalone python script with injected web-ui code
print("Building standalone executable...")
proc = subprocess.Popen(["pyinstaller", "-F", "lizard-to-json.py"], cwd=DIST_DIR)
if proc.wait(): 
    print("\tFailed to build!")
    exit()
print("\tDone!")
