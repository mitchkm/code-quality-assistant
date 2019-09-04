# Code Analysis module
# provides functions to analyze a list of files
# the analyze funciton returns a json string to be injected into a web-ui

import json
import lizard

#GLOBALS
LIZARD_SUPPORTED_LANGUAGES = ["c", "cpp", "cc", "mm", "cxx", "h", "hpp", "cs", "gd",
                      "go", "java", "js", "lua", "m", "php", "py", "rb",
                      "scala", "swift", "tnsdl", "sdl", "ttcn", "ttcnpp"]

# analyzes all files, with lizard, provided in list and returns a json string of the raw data
def lizAnalyze(path, filenameList):
    lizOut = runLizard(filenameList)
    asDict = fileListToDict(path, lizOut)
    data = json.dumps(asDict, indent=4, sort_keys=False)
    return data

# Runs lizard on each individual file designated in the given filenameList.
def runLizard(filenameList):
    outList = []
    for file in filenameList:
        outList.append((lizard.analyze_file(file))) 
    return outList

# converts a list of FileInformation objects into a list of dictionaries
def fileListToDict(path, fileList):
    filesAsDicts = [fileInfoToDict(f) for f in fileList]

    return { 'path'  : path,
             'files' : filesAsDicts }

# converts FileInformation object into a dictionary
def fileInfoToDict(fileInfo):
    filename = fileInfo.filename
    funcs = []
    for func in fileInfo.function_list:
        funcs.append(funcInfoToDict(func))
    return {'filename'  : filename,
            'functions' : funcs}

# converts FunctionInformation object into dictionary
def funcInfoToDict(funcInfo):
    return { 'name'   : funcInfo.name,
             'longName': funcInfo.long_name,
             'startLine': funcInfo.start_line,
             'nloc'   : funcInfo.nloc,
             'ccn'    : funcInfo.cyclomatic_complexity,
             'tokens' : funcInfo.token_count,
             'params' : len(funcInfo.parameters),
             'length' : funcInfo.length}