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
os.mkdir(DIST_DIR + "/web-ui")
print("\tDone!")

# Create bundled web-ui javascript
print("Bundling javascript visualizer...")
bundle = open(DIST_DIR + "/web-ui/bundle.js", "w")

proc = subprocess.Popen(["node", "bundler.js"], cwd=WEB_UI_DIR, stdout=bundle, stderr=subprocess.PIPE)
err = proc.stderr.read()
if err: 
    print("\tFailed to bundle typescript code!")
    exit()

proc = subprocess.Popen(["cp", WEB_UI_DIR + "/dist/index.html", DIST_DIR + "/web-ui/index.html"], stderr=subprocess.PIPE)
proc2 = subprocess.Popen(["cp", WEB_UI_DIR + "/dist/style.css", DIST_DIR + "/web-ui/style.css"], stderr=subprocess.PIPE)
# proc3 = subprocess.Popen(["cp", WEB_UI_DIR + "/dist/index.html", DIST_DIR + "web-ui/index.html"], stderr=subprocess.PIPE)
err = proc.stderr.read()
err2 = proc2.stderr.read()
# err3 = proc3.stderr.read()
if err or err2: 
    print("\tFailed to copy web files!")
    exit()

print("\tDone!")

# Get python files
print("Get python files...")
proc = subprocess.Popen(["cp", CODE_ANALYSIS_DIR + "/lizard-to-json.py", DIST_DIR + "/lizard-to-json.py"], stderr=subprocess.PIPE)
err = proc.stderr.read()
if err: 
    print("\tFailed to copy python files")
    exit()
print("\tDone!")

# Build standalone python script with injected web-ui code
print("Building standalone executable...")
webFiles = os.listdir(DIST_DIR + "/web-ui")
dataArgs = ["web-ui/" + f + ":web-ui/" + f for f in webFiles]
pyinstall = ["pyinstaller", "-F", "--add-data"]
pyinstall.extend(dataArgs)
pyinstall.append("lizard-to-json.py")
print(pyinstall)
proc = subprocess.Popen(["pyinstaller", "-F", "--add-data", "web-ui/*:web-ui", "lizard-to-json.py"], cwd=DIST_DIR)
if proc.wait(): 
    print("\tFailed to build!")
    exit()
print("\tDone!")
