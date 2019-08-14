// An export for example data to test d3 viz with
// This output should be the json outputted by the python code analysis script
export const exampleData = {
  path: "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/",
  files: {
    "0": {
      filename:
        "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-me.swift",
      functions: {
        "0": {
          name: "viewDidLoad",
          nloc: 22,
          ccn: 2,
          tokens: 117,
          params: 0,
          length: 25
        },
        "1": {
          name: "deinit",
          nloc: 3,
          ccn: 1,
          tokens: 11,
          params: 0,
          length: 3
        },
        "2": {
          name: "adjustInsetForKeyboard",
          nloc: 9,
          ccn: 2,
          tokens: 69,
          params: 2,
          length: 9
        },
        "3": {
          name: "dismissKeyboard",
          nloc: 3,
          ccn: 1,
          tokens: 11,
          params: 0,
          length: 3
        },
        "4": {
          name: "keyboardWillShow",
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3
        },
        "5": {
          name: "keyboardWillHide",
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3
        },
        "6": {
          name: "openZoomingController",
          nloc: 3,
          ccn: 1,
          tokens: 18,
          params: 1,
          length: 3
        },
        "7": {
          name: "prepare",
          nloc: 8,
          ccn: 4,
          tokens: 42,
          params: 2,
          length: 8
        }
      }
    }
  }
};

// This output should be the processed version of the python script output
// Readable by d3
export const exampleProcessedData = {
  name: "Metrics",
  children: [
    {
      name: "analyze-me.swift",
      value: 68, //if it's bigger than 15, it's bad like "Warning CCN > 15 in lizard"
      children: [
        {
          name: "nloc",
          value: 53, //avg nloc
          children: [
            {
              name: "viewDidLoad",
              value: 22
            },
            {
              name: "deinit",
              value: 3
            },
            {
              name: "adjustInsetForKeyboard",
              value: 9
            },
            {
              name: "dismissKeyboard",
              value: 3
            },
            {
              name: "keyboardWillShow",
              value: 3
            },
            {
              name: "keyboardWillHide",
              value: 3
            },
            {
              name: "openZoomingController",
              value: 3
            },
            {
              name: "prepare",
              value: 8
            }
          ]
        },
        {
          name: "cyclocomplexity",
          value: 68, // avg cyclocomplexity
          children: [
            {
              name: "viewDidLoad",
              value: 22
            },
            {
              name: "deinit",
              value: 3
            },
            {
              name: "adjustInsetForKeyboard",
              value: 9
            },
            {
              name: "dismissKeyboard",
              value: 3
            },
            {
              name: "keyboardWillShow",
              value: 3
            }
          ]
        }
      ]
    },
    {
      name: "analyze-you.swift",
      value: 78,
      children: [
        {
          name: "nloc",
          value: 80, //avg nloc
          children: [
            {
              name: "viewDidLoad",
              value: 10
            },
            {
              name: "deinit",
              value: 2
            },
            {
              name: "adjustInsetForKeyboard",
              value: 9
            },
            {
              name: "dismissKeyboard",
              value: 3
            },
            {
              name: "keyboardWillShow",
              value: 3
            },
            {
              name: "keyboardWillHide",
              value: 3
            },
            {
              name: "openZoomingController",
              value: 3
            },
            {
              name: "prepare",
              value: 8
            }
          ]
        },
        {
          name: "cyclocomplexity",
          value: 68, // avg cyclocomplexity
          children: [
            {
              name: "viewDidLoad",
              value: 22
            },
            {
              name: "deinit",
              value: 3
            },
            {
              name: "adjustInsetForKeyboard",
              value: 9
            },
            {
              name: "dismissKeyboard",
              value: 3
            },
            {
              name: "keyboardWillShow",
              value: 3
            }
          ]
        }
      ]
    },
    {
      name: "analyze-them.swift",
      value: 68,
      children: [
        {
          name: "nloc",
          value: 53, //avg nloc
          children: [
            {
              name: "viewDidLoad",
              value: 22
            },
            {
              name: "deinit",
              value: 3
            },
            {
              name: "adjustInsetForKeyboard",
              value: 9
            },
            {
              name: "dismissKeyboard",
              value: 3
            },
            {
              name: "keyboardWillShow",
              value: 3
            },
            {
              name: "keyboardWillHide",
              value: 3
            },
            {
              name: "openZoomingController",
              value: 3
            },
            {
              name: "prepare",
              value: 8
            }
          ]
        },
        {
          name: "cyclocomplexity",
          value: 68, // avg cyclocomplexity
          children: [
            {
              name: "viewDidLoad",
              value: 22
            },
            {
              name: "deinit",
              value: 3
            },
            {
              name: "adjustInsetForKeyboard",
              value: 9
            },
            {
              name: "dismissKeyboard",
              value: 3
            },
            {
              name: "keyboardWillShow",
              value: 3
            }
          ]
        }
      ]
    }
  ]
};
