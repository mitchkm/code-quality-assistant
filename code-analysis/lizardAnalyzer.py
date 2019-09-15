# Code Analysis module via Lizard code analyzer
# provides functions to analyze a list of files
# the analyze funciton returns a json string to be injected into a web-ui

import json
import lizard
from lizard_ext.lizardduplicate import LizardExtension as DuplicateDetector
from lizard_ext.lizardcpre import LizardExtension as lizardcpre
from lizard_ext.lizardnd import LizardExtension as lizardnd
from lizard_ext.lizardio import LizardExtension as lizardio
from lizard_ext.lizardns import LizardExtension as lizardns

#GLOBALS
LIZARD_SUPPORTED_LANGUAGES = ["c", "cpp", "cc", "mm", "cxx", "h", "hpp", "cs", "gd",
                      "go", "java", "js", "lua", "m", "php", "py", "rb",
                      "scala", "swift", "tnsdl", "sdl", "ttcn", "ttcnpp"]
# How many tokens such as: "if", "(", "abc", "%", "4", ")" must be repeated to appear in duplicate detection list
MIN_DUP_TOKENS = 70 

# analyzes all files, with lizard, provided in list and returns a json string of the raw data
def analyze(path, filenameList):
    lizOut = runLizard(filenameList)
    asDict = filesInfoToDict(path, lizOut)

    # for more readable json output:
    data = json.dumps(asDict, indent=4, sort_keys=False)
    # for compressed json:
    # data = json.dumps(asDict, sort_keys=False)
    return data

# Runs lizard on each individual file designated in the given filenameList.
def runLizard(filenameList):
    duplicates = DuplicateDetector()
    cpre = lizardcpre()
    nd = lizardnd()
    ns = lizardns()
    io = lizardio()
    extensions = lizard.get_extensions([duplicates, cpre, ns, nd, io])
    outList = list(lizard.analyze_files(filenameList, exts=extensions))
    dupCodeSnips = list(duplicates.get_duplicates(min_duplicate_tokens=MIN_DUP_TOKENS))
    dupInfo = { 'duplicates': [dupInfoToDict(d) for d in dupCodeSnips], 
                'duplicateRate': duplicates.saved_duplicate_rate, 
                'uniqueRate': duplicates.saved_unique_rate }
    return { 'fileList': outList, 
             'dupInfo': dupInfo }

# converts a list of FileInformation objects into a list of dictionaries
def filesInfoToDict(path, info):
    filesAsDicts = [fileInfoToDict(f) for f in info['fileList']]

    return { 'path'  : path,
             'duplicateInfo': info['dupInfo'],
             'files' : filesAsDicts }

# converts FileInformation object into a dictionary
def fileInfoToDict(fileInfo):
    filename = fileInfo.filename
    funcs = []
    for func in fileInfo.function_list:
        funcs.append(funcInfoToDict(func))
    
    return {'filename'  : filename,
            'filetype'  : filename.split('.')[1],
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
             'length' : funcInfo.length,
             'fanIn'  : funcInfo.fan_in,
             'fanOut' : funcInfo.fan_out,
             'generalFanOut': funcInfo.general_fan_out,
             'maxNestingDepth': funcInfo.max_nesting_depth,
             'maxNestedStructures': funcInfo.max_nested_structures}

# converts duplicate CodeSnippet objects to dicts of info
def dupInfoToDict(snippets):    
    return [{ 'filename': c.file_name,
              'startLine': c.start_line, 
              'endLine': c.end_line} for c in snippets]