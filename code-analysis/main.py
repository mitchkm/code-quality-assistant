# Code Quality Assistant
# input : file or directory to run code analysis on
# output: hmtl website to analyze code analysis results found ./code-quality-assistant directory

import analyzer

import glob
import sys
import os
import pathlib
from distutils.dir_util import copy_tree

# GLOBALS
OUT_DIR = "./code-quality-assistant"
DATA_REPLACE_TOKEN = "{code_analysis_json}"

# runs it all. This is called down below.
def run():
    path = checkPathExists()
    filenameList = buildFilenameList(path)
    jsonData = analyzer.lizAnalyze(path, filenameList)
    createWebFiles()
    injectData(jsonData)


# returns the input string if no errors, signals error and quits else
def checkPathExists():
    if(len(sys.argv) < 2):
        print("error: No path given.")
        sys.exit()
    path = os.path.abspath(sys.argv[1])
    if(os.path.exists(path) is not True):
        print("error: Path \'", path, "\' does not exist.")
        sys.exit()
    return path

# for packaged data files in the stand alone executable
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

# creates necessary web-ui files 
def createWebFiles():
    copy_tree(resource_path("web-ui"), OUT_DIR)

# injects json data aquired into html file to be accessible for web visualization
def injectData(json):
    file_in = OUT_DIR + "/index.html"
    file_out = OUT_DIR + "/tmp.txt"
    with open(file_in, "rt") as fin:
        with open(file_out, "wt") as fout:
            for line in fin:
                fout.write(line.replace(DATA_REPLACE_TOKEN, json))

    os.rename(file_out, file_in)

# goes through given path and identifies all files within that are supported by lizard, then puts those files in a list
def buildFilenameList(path):
    files = []
    if(os.path.isfile(path)):
        if getExtensionFromFilename(path) in analyzer.LIZARD_SUPPORTED_LANGUAGES:
            files.append(path)
            return files
    for ext in analyzer.LIZARD_SUPPORTED_LANGUAGES:
        addUs = [f for f in glob.glob(path + "/**/*." + ext, recursive=True)]
        files.extend(addUs)
    return files

# returns just the extension from a file name
def getExtensionFromFilename(path):
    ext = pathlib.Path(path).suffix
    ext = ext[1:] # strip off the '.'
    return ext

run()
