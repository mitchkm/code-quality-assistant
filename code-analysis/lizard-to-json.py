# runs lizard on given file/directory and then outputs the .json formatted results to the command line
# input : file or directory to run lizard analysis on
# output: .json formatted results of lizard analysis to the command line


import json
import lizard
import glob
import sys
import os
import pathlib


#GLOBALS
XMLTEMPFILENAME = "__temp_xml_output__.xml"
OUTPUTFILENAME  = "output.json"

SUPPORTEDLANGUAGES = ["c", "cpp", "cc", "mm", "cxx", "h", "hpp", "cs", "gd",
                      "go", "java", "js", "lua", "m", "php", "py", "rb",
                      "scala", "swift", "tnsdl", "sdl", "ttcn", "ttcnpp"]


# runs it all. This is called down below.
def run():
    path = checkPathExists()
    filenameList = buildFilenameList(path)
    print(filenameList)
    lizOut = runLizard(filenameList)
    asDict = fileListToDict(path, lizOut)
    print(json.dumps(asDict, indent=4, sort_keys=False))
    #printAllDicts(lizOut)


# print json for
def printAllDicts(dictList):
    for d in dictList:
        print(d)


# Runs lizard on each individual file designated in the given filenameList. Currently the only working on this one.
def runLizard(filenameList):
    outList = []
    for file in filenameList:
        outList.append((lizard.analyze_file(file)))
    return outList


# returns the input string if no errors, signals error and quits else
def checkPathExists():
    if(len(sys.argv) < 2):
        print("lizard-to-json error: No path given.")
        sys.exit()
    path = sys.argv[1]
    if (path[-1] is not '/') and os.path.isdir(path):
        path += "/"
    if(os.path.exists(path) is not True):
        print("lizard-to-json error: Path \'", path, "\' does not exist.")
        sys.exit()
    if path[0] is not '/':
        path = os.getcwd() + "/" + path
        print(path)
    return path

def buildFilenameList(path):
    files = []
    if(os.path.isfile(path)):
        if getExtensionFromFilename(path) in SUPPORTEDLANGUAGES:
            files.append(path)
            return files
    for ext in SUPPORTEDLANGUAGES:
        addUs = [f for f in glob.glob(path + "**/*." + ext, recursive=True)]
        files.extend(addUs)
    return files


def getExtensionFromFilename(path):
    ext = pathlib.Path(path).suffix
    ext = ext[1:] # strip off the '.'
    return ext

def fileListToDict(path, fileList):
    filesAsDicts = [fileInfoToDict(f) for f in fileList]

    return { 'path'  : path,
             'files' : {"file" + str(i) : filesAsDicts[i] for i in range(0, len(filesAsDicts))}}

def fileInfoToDict(fileInfo):
    filename = fileInfo.filename
    funcs = []
    for func in fileInfo.function_list:
        funcs.append(funcInfoToDict(func))
    funcsDict = {"function" + str(i) : funcs[i] for i in range(0, len(funcs))}
    return {'filename'  : filename,
            'functions' : funcsDict}

def funcInfoToDict(funcInfo):
    return { 'name'   : funcInfo.name,
             'nloc'   : funcInfo.nloc,
             'ccn'    : funcInfo.cyclomatic_complexity,
             'tokens' : funcInfo.token_count,
             'params' : len(funcInfo.parameters),
             'length' : funcInfo.length}


run()
