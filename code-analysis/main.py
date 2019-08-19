# Make this the actual full script
# runs lizard on given file/directory and then outputs the .json formatted results to the command line
# input : file or directory to run lizard analysis on
# output: JSON formatted results of lizard analysis to the command line


import json
import lizard
import glob
import sys
import os
import pathlib
from distutils.dir_util import copy_tree


#GLOBALS
SUPPORTED_LANGUAGES = ["c", "cpp", "cc", "mm", "cxx", "h", "hpp", "cs", "gd",
                      "go", "java", "js", "lua", "m", "php", "py", "rb",
                      "scala", "swift", "tnsdl", "sdl", "ttcn", "ttcnpp"]
OUT_DIR = "./code-quality-assistant"

# For packaged data files
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

# runs it all. This is called down below.
def run():
    path = checkPathExists()
    filenameList = buildFilenameList(path)
    # print(filenameList)
    lizOut = runLizard(filenameList)
    asDict = fileListToDict(path, lizOut)
    rawData = json.dumps(asDict, indent=4, sort_keys=False)
    createWebFiles()
    injectData(rawData)

# Runs lizard on each individual file designated in the given filenameList.
def runLizard(filenameList):
    outList = []
    for file in filenameList:
        outList.append((lizard.analyze_file(file))) 
    return outList


# returns the input string if no errors, signals error and quits else
def checkPathExists():
    if(len(sys.argv) < 2):
        print("error: No path given.")
        sys.exit()
    path = sys.argv[1]
    if (path[-1] is not '/') and os.path.isdir(path):
        path += "/"
    if(os.path.exists(path) is not True):
        print("error: Path \'", path, "\' does not exist.")
        sys.exit()
    if path[0] is not '/':
        path = os.getcwd() + "/" + path
        # print(path)
    return path

# creates necessary web-ui files
def createWebFiles():
    copy_tree(resource_path("web-ui"), OUT_DIR)

# injects rawData aquired into html file to be accessible for web visualization
def injectData(json):
    file_in = OUT_DIR + "/index.html"
    file_out = OUT_DIR + "/tmp.txt"
    with open(file_in, "rt") as fin:
        with open(file_out, "wt") as fout:
            for line in fin:
                fout.write(line.replace("{code_analysis_json}", json))

    os.rename(file_out, file_in)

# goes through given path and identifies all files within that are supported by lizard, then puts those files in a list
def buildFilenameList(path):
    files = []
    if(os.path.isfile(path)):
        if getExtensionFromFilename(path) in SUPPORTED_LANGUAGES:
            files.append(path)
            return files
    for ext in SUPPORTED_LANGUAGES:
        addUs = [f for f in glob.glob(path + "**/*." + ext, recursive=True)]
        files.extend(addUs)
    return files

# returns just the extension from a file name
def getExtensionFromFilename(path):
    ext = pathlib.Path(path).suffix
    ext = ext[1:] # strip off the '.'
    return ext

# converts a list of FileInformation objects into a list of dictionaries
def fileListToDict(path, fileList):
    filesAsDicts = [fileInfoToDict(f) for f in fileList]

    return { 'path'  : path,
             'files' : {str(i) : filesAsDicts[i] for i in range(0, len(filesAsDicts))}}

# converts FileInformation object into a dictionary
def fileInfoToDict(fileInfo):
    filename = fileInfo.filename
    funcs = []
    for func in fileInfo.function_list:
        funcs.append(funcInfoToDict(func))
    funcsDict = {str(i) : funcs[i] for i in range(0, len(funcs))}
    return {'filename'  : filename,
            'functions' : funcsDict}

# converts FunctionInformation object into dictionary
def funcInfoToDict(funcInfo):
    return { 'name'   : funcInfo.name,
             'nloc'   : funcInfo.nloc,
             'ccn'    : funcInfo.cyclomatic_complexity,
             'tokens' : funcInfo.token_count,
             'params' : len(funcInfo.parameters),
             'length' : funcInfo.length}


run()
