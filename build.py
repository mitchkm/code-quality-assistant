import os
import shutil
import subprocess

DIST_DIR = "dist"
WEB_UI_DIR = "web-ui"
CODE_ANALYSIS_DIR = "code-analysis"
APP_NAME = "codequalityassist"

'''
Commands executed (if done via shell):
rmdir -r ./dist
mkdir ./dist
mkdir ./dist/web-ui
cd web-ui
node ./bundler.js > ../dist/bundle.js
cp ./dist/index.html ../dist/web-ui/index.html
cp ./dist/bundle.js ../dist/web-ui/bundle.js
cd ..

'''

# Make empty dist directory
print("Cleaning old dist directory...")
shutil.rmtree(DIST_DIR, ignore_errors=True)
print("\tDone!")

print("Making new dist directory...")
os.mkdir(DIST_DIR)
os.mkdir(DIST_DIR + "/web-ui")
os.mkdir(DIST_DIR + "/web-ui/styles")
print("\tDone!")

# Create bundled web-ui javascript
print("Bundling javascript visualizer...")
bundle = open(DIST_DIR + "/web-ui/bundle.js", "w")

proc = subprocess.Popen(["node", "bundler.js"], cwd=WEB_UI_DIR, stdout=bundle, stderr=subprocess.PIPE)
err = proc.stderr.read()
if err: 
    print("\tFailed to bundle typescript code!")
    exit()

proc = subprocess.Popen(["npm", "run", "sass"], cwd=WEB_UI_DIR, stderr=subprocess.PIPE)
err = proc.stderr.read()
if err: 
    print("\tFailed to compile sass stylesheet!")
    exit()

proc = subprocess.Popen(["cp", WEB_UI_DIR + "/dist/index.html", DIST_DIR + "/web-ui/index.html"], stderr=subprocess.PIPE)
proc2 = subprocess.Popen(["cp", WEB_UI_DIR + "/dist/styles.css", DIST_DIR + "/web-ui/styles.css"], stderr=subprocess.PIPE)
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
files = ["main.py", "lizardAnalyzer.py"]
for f in files:
    print("Copying... " + f)
    proc = subprocess.Popen(["cp", CODE_ANALYSIS_DIR + "/" + f, DIST_DIR + "/" + f], stderr=subprocess.PIPE)
    err = err or proc.stderr.read()
if err: 
    print("\tFailed to copy python files")
    exit()
print("\tDone!")

# Build standalone python script with injected web-ui code
print("Building standalone executable...")
proc = subprocess.Popen(["pyinstaller", "-F", "--add-data", "web-ui/*:web-ui", "main.py"], cwd=DIST_DIR)
if proc.wait(): 
    print("\tFailed to build!")
    exit()
print("\tDone!")

# Clean up files
print("Cleaning up...")
proc = subprocess.Popen(["cp", DIST_DIR + "/dist/main", DIST_DIR + "/" + APP_NAME], stderr=subprocess.PIPE)
if proc.wait(): 
    print("\tFailed to copy!")
    exit()
files = list(os.listdir(DIST_DIR))
files.remove(APP_NAME)
try: 
    for f in files:
        path = DIST_DIR + "/" + f
        if os.path.isfile(path):
            os.remove(path)
        else:
            shutil.rmtree(path)
except:
    print("Failed to clean up!")
    exit()
print("\tDone!")
