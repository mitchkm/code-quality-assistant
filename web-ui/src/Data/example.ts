// An export for example data to test d3 viz with
// This output should be the json outputted by the python code analysis script
export const exampleData = {
  "path": "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/",
    "files": [
        {
            "filename": "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-me.swift",
            "functions": [
                {
                    "name": "viewDidLoad",
                    "nloc": 22,
                    "ccn": 2,
                    "tokens": 117,
                    "params": 0,
                    "length": 25
                },
                {
                    "name": "deinit",
                    "nloc": 3,
                    "ccn": 1,
                    "tokens": 11,
                    "params": 0,
                    "length": 3
                },
                {
                    "name": "adjustInsetForKeyboard",
                    "nloc": 9,
                    "ccn": 2,
                    "tokens": 69,
                    "params": 2,
                    "length": 9
                },
                {
                    "name": "dismissKeyboard",
                    "nloc": 3,
                    "ccn": 1,
                    "tokens": 11,
                    "params": 0,
                    "length": 3
                },
                {
                    "name": "keyboardWillShow",
                    "nloc": 3,
                    "ccn": 1,
                    "tokens": 18,
                    "params": 1,
                    "length": 3
                },
                {
                    "name": "keyboardWillHide",
                    "nloc": 3,
                    "ccn": 1,
                    "tokens": 18,
                    "params": 1,
                    "length": 3
                },
                {
                    "name": "openZoomingController",
                    "nloc": 3,
                    "ccn": 1,
                    "tokens": 18,
                    "params": 1,
                    "length": 3
                },
                {
                    "name": "prepare",
                    "nloc": 8,
                    "ccn": 4,
                    "tokens": 42,
                    "params": 2,
                    "length": 8
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
        { name: "adjustInsetForKeyboard", value: 9, value2: 2, children: undefined },
        { name: "dismissKeyboard", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillShow", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillHide", value: 3, value2: 1, children: undefined },
        { name: "openZoomingController", value: 3, value2: 1, children: undefined },
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
        { name: "adjustInsetForKeyboard", value: 9, value2: 2, children: undefined },
        { name: "dismissKeyboard", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillShow", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillHide", value: 3, value2: 1, children: undefined },
        { name: "openZoomingController", value: 3, value2: 1, children: undefined },
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
        { name: "adjustInsetForKeyboard", value: 9, value2: 2, children: undefined },
        { name: "dismissKeyboard", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillShow", value: 3, value2: 1, children: undefined },
        { name: "keyboardWillHide", value: 3, value2: 1, children: undefined },
        { name: "openZoomingController", value: 3, value2: 1, children: undefined },
        { name: "prepare", value: 8, value2: 4, children: undefined }
      ]
    }
  ]
};
