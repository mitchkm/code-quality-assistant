// An export for example data to test d3 viz with
// This output should be the json outputted by the python code analysis script
export const exampleData = {
  path: "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/",
  duplicateInfo: {
    duplicates: [
      [
        {
          filename:
            "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-me.swift",
          startLine: 13,
          endLine: 84
        },
        {
          filename:
            "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-us.swift",
          startLine: 13,
          endLine: 84
        }
      ]
    ],
    duplicateRate: 0.6430517711171662,
    uniqueRate: 0.6745562130177515
  },
  files: [
    {
      filename:
        "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-you.py",
      filetype: "py",
      functions: [
        {
          name: "run",
          longName: "run( )",
          startLine: 18,
          nloc: 6,
          ccn: 1,
          tokens: 32,
          params: 0,
          length: 6,
          fanIn: 0,
          fanOut: 4,
          generalFanOut: 15,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "checkPathExists",
          longName: "checkPathExists( )",
          startLine: 27,
          nloc: 11,
          ccn: 4,
          tokens: 85,
          params: 0,
          length: 11,
          fanIn: 1,
          fanOut: 0,
          generalFanOut: 24,
          maxNestingDepth: 3,
          maxNestedStructures: 3
        },
        {
          name: "resource_path",
          longName: "resource_path( relative_path )",
          startLine: 40,
          nloc: 6,
          ccn: 2,
          tokens: 37,
          params: 1,
          length: 9,
          fanIn: 1,
          fanOut: 0,
          generalFanOut: 6,
          maxNestingDepth: 1,
          maxNestedStructures: 5
        },
        {
          name: "createWebFiles",
          longName: "createWebFiles( )",
          startLine: 51,
          nloc: 2,
          ccn: 1,
          tokens: 13,
          params: 0,
          length: 2,
          fanIn: 1,
          fanOut: 1,
          generalFanOut: 6,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "injectData",
          longName: "injectData( json )",
          startLine: 55,
          nloc: 8,
          ccn: 2,
          tokens: 61,
          params: 1,
          length: 9,
          fanIn: 1,
          fanOut: 0,
          generalFanOut: 15,
          maxNestingDepth: 1,
          maxNestedStructures: 8
        },
        {
          name: "buildFilenameList",
          longName: "buildFilenameList( path )",
          startLine: 66,
          nloc: 10,
          ccn: 5,
          tokens: 76,
          params: 1,
          length: 10,
          fanIn: 1,
          fanOut: 1,
          generalFanOut: 15,
          maxNestingDepth: 4,
          maxNestedStructures: 12
        },
        {
          name: "getExtensionFromFilename",
          longName: "getExtensionFromFilename( path )",
          startLine: 78,
          nloc: 4,
          ccn: 1,
          tokens: 24,
          params: 1,
          length: 4,
          fanIn: 1,
          fanOut: 0,
          generalFanOut: 3,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        }
      ]
    },
    {
      filename:
        "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-me.swift",
      filetype: "swift",
      functions: [
        {
          name: "viewDidLoad",
          longName: "viewDidLoad",
          startLine: 24,
          nloc: 22,
          ccn: 2,
          tokens: 117,
          params: 0,
          length: 25,
          fanIn: 1,
          fanOut: 1,
          generalFanOut: 8,
          maxNestingDepth: 1,
          maxNestedStructures: 13
        },
        {
          name: "deinit",
          longName: "deinit",
          startLine: 50,
          nloc: 3,
          ccn: 1,
          tokens: 11,
          params: 0,
          length: 3,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 0,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "adjustInsetForKeyboard",
          longName:
            "adjustInsetForKeyboard isShow : Bool , notification : Notification",
          startLine: 54,
          nloc: 9,
          ccn: 2,
          tokens: 69,
          params: 2,
          length: 9,
          fanIn: 2,
          fanOut: 0,
          generalFanOut: 2,
          maxNestingDepth: 1,
          maxNestedStructures: 13
        },
        {
          name: "dismissKeyboard",
          longName: "dismissKeyboard",
          startLine: 64,
          nloc: 3,
          ccn: 1,
          tokens: 11,
          params: 0,
          length: 3,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "keyboardWillShow",
          longName: "keyboardWillShow notification : Notification",
          startLine: 68,
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3,
          fanIn: 0,
          fanOut: 1,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "keyboardWillHide",
          longName: "keyboardWillHide notification : Notification",
          startLine: 72,
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3,
          fanIn: 0,
          fanOut: 1,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "openZoomingController",
          longName: "openZoomingController sender : AnyObject",
          startLine: 76,
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "prepare",
          longName: "prepare for segue : UIStoryboardSegue , sender : Any?",
          startLine: 80,
          nloc: 8,
          ccn: 4,
          tokens: 42,
          params: 2,
          length: 8,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 0,
          maxNestingDepth: 3,
          maxNestedStructures: 15
        }
      ]
    },
    {
      filename:
        "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-us.swift",
      filetype: "swift",
      functions: [
        {
          name: "viewDidLoad",
          longName: "viewDidLoad",
          startLine: 24,
          nloc: 22,
          ccn: 2,
          tokens: 117,
          params: 0,
          length: 25,
          fanIn: 1,
          fanOut: 1,
          generalFanOut: 8,
          maxNestingDepth: 1,
          maxNestedStructures: 1
        },
        {
          name: "deinit",
          longName: "deinit",
          startLine: 50,
          nloc: 3,
          ccn: 1,
          tokens: 11,
          params: 0,
          length: 3,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 0,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "adjustInsetForKeyboard",
          longName:
            "adjustInsetForKeyboard isShow : Bool , notification : Notification",
          startLine: 54,
          nloc: 9,
          ccn: 2,
          tokens: 69,
          params: 2,
          length: 9,
          fanIn: 2,
          fanOut: 0,
          generalFanOut: 2,
          maxNestingDepth: 1,
          maxNestedStructures: 1
        },
        {
          name: "dismissKeyboard",
          longName: "dismissKeyboard",
          startLine: 64,
          nloc: 3,
          ccn: 1,
          tokens: 11,
          params: 0,
          length: 3,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "keyboardWillShow",
          longName: "keyboardWillShow notification : Notification",
          startLine: 68,
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3,
          fanIn: 0,
          fanOut: 1,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "keyboardWillHide",
          longName: "keyboardWillHide notification : Notification",
          startLine: 72,
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3,
          fanIn: 0,
          fanOut: 1,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "openZoomingController",
          longName: "openZoomingController sender : AnyObject",
          startLine: 76,
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 1,
          maxNestingDepth: 0,
          maxNestedStructures: 0
        },
        {
          name: "prepare",
          longName: "prepare for segue : UIStoryboardSegue , sender : Any?",
          startLine: 80,
          nloc: 8,
          ccn: 4,
          tokens: 42,
          params: 2,
          length: 8,
          fanIn: 0,
          fanOut: 0,
          generalFanOut: 0,
          maxNestingDepth: 3,
          maxNestedStructures: 3
        }
      ]
    }
  ]
};

// This output should be the processed version of the python script output
// Readable by d3
export const exampleProcessedData = {
  name: "nlocxccn",
  value: 54,
  value2: 13,
  children: [
    {
      name:
        "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-me.swift",
      value: 54,
      value2: 13,
      children: [
        { name: "viewDidLoad", value: 22, value2: 2, children: undefined },
        { name: "deinit", value: 3, value2: 1, children: undefined },
        {
          name: "adjustInsetForKeyboard",
          value: 9,
          value2: 2,
          children: undefined
        },
        { name: "dismissKeyboard", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillShow", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillHide", value: 3, value2: 1, children: undefined },
        {
          name: "openZoomingController",
          value: 3,
          value2: 1,
          children: undefined
        },
        { name: "prepare", value: 8, value2: 4, children: undefined }
      ]
    },
    {
      name:
        "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-you.swift",
      value: 54,
      value2: 13,
      children: [
        { name: "viewDidLoad", value: 22, value2: 1, children: undefined },
        { name: "deinit", value: 3, value2: 1, children: undefined },
        {
          name: "adjustInsetForKeyboard",
          value: 9,
          value2: 2,
          children: undefined
        },
        { name: "dismissKeyboard", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillShow", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillHide", value: 3, value2: 1, children: undefined },
        {
          name: "openZoomingController",
          value: 3,
          value2: 1,
          children: undefined
        },
        { name: "prepare", value: 8, value2: 4, children: undefined }
      ]
    },
    {
      name:
        "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-me.swift",
      value: 54,
      value2: 13,
      children: [
        { name: "viewDidLoad", value: 22, value2: 2, children: undefined },
        { name: "deinit", value: 3, value2: 1, children: undefined },
        {
          name: "adjustInsetForKeyboard",
          value: 9,
          value2: 2,
          children: undefined
        },
        { name: "dismissKeyboard", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillShow", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillHide", value: 3, value2: 1, children: undefined },
        {
          name: "openZoomingController",
          value: 3,
          value2: 1,
          children: undefined
        },
        { name: "prepare", value: 8, value2: 4, children: undefined }
      ]
    }
  ]
};
