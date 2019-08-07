# runs lizard on given file/directory and then outputs the .json formatted results to the command line
# input : file or directory to run lizard analysis on
# output: .json formatted results of lizard analysis to the command line


import json
import sys
import os
import xmltodict
import lizard
import collections
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
    clean(True, True)
    lizOut = runLizard3(filenameList)
    printAllDicts(lizOut)
    clean(True, False)

# print json for
def printAllDicts(dictList):
    for d in dictList:
        print(d)

# old function. It is unused, but I am keeping until I have a better solution.
def printJSON(lizOut):
    print("PRINTING JSON")
    print(type(lizOut))
    if type(lizOut) is collections.OrderedDict:
        print(lizOut)
        print("\n\n")
        print(json.dumps(lizOut))
        return
    for item in lizOut:
        if(type(item) is lizard.FileInformation):
            print("TYPOOOO")
            print(type(item))
        else:
            printJSON(item)

#just deletes files
def clean(cleanXMLTempFile, cleanOutputFile):
    if(cleanOutputFile):
        if os.path.exists(OUTPUTFILENAME):
            os.remove(OUTPUTFILENAME)

    if(cleanXMLTempFile):
        if os.path.exists(XMLTEMPFILENAME):
            os.remove(XMLTEMPFILENAME)

# Runs lizard on each individual file designated in the given filenameList. Currently the only working on this one.
def runLizard3(filenameList):
    outList = []
    for file in filenameList:
        outList.append((lizard.analyze_file(file)).__dict__)
    return outList

# old function and doesn't work fully. Keeping this old code until I have a definite solution.
# runs lizard on a given path by using lizard as a python extension.
def runLizard2(path):
    i = lizard.analyze(path)
    print(type(i))
    if(type(i) is lizard.FileInformation):
        print("FOUND FILE INFORMATION")
        returnme = list()
        returnme.append(i)
        return returnme
    print("FOUND ITERATOR")
    return i

# old function and doesn't work fully. Keeping this old code until I have a definite solution.
# runs lizard on a given path through an os command. Outputs to temp xml file, then converts xml to json.
def runLizard(path):
    command = "lizard --xml " + path + " >> " + XMLTEMPFILENAME
    os.system(command)
    jsonDict = convertXMLtoJSON()
    return jsonDict


def convertXMLtoJSON():
    xmlData = open(XMLTEMPFILENAME, 'r').read()
    jsonData = xmltodict.parse(xmlData)
    xmlData.close()
    return jsonData

# returns the input string if no errors, signals error and quits else
def checkPathExists():
    if(len(sys.argv) < 2):
        print("lizard-to-json error: No path given.")
        sys.exit()
    path = sys.argv[1]
    if(os.path.exists(path) is not True):
        print("lizard-to-json error: Path \'", path, "\' does not exist.")
        sys.exit()
    if path[0] is not '/':
        path = os.getcwd() + "/" + path
        print(path)
    return path


def buildFilenameList(path):
    print("BUILDING NAME LIST")
    print(path)
    nameList = []
    if(os.path.isdir(path)):
        entriesInDir = os.listdir(path)
        for entry in entriesInDir:
            fullPath = path
            if fullPath[-1] is not "/": fullPath += "/"
            fullPath += entry + "/"
            nameList.extend(buildFilenameList(fullPath))
    else:
        if getExtensionFromFilename(path) in SUPPORTEDLANGUAGES:
            nameList.append(path)
    return nameList


def getExtensionFromFilename(path):
    ext = pathlib.Path(path).suffix
    ext = ext[1:] # strip off the '.'
    return ext


run()
