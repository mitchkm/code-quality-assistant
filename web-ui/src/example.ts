// An export for example data to test d3 viz with
// This output should be the json outputted by the python code analysis script
export const exampleData = undefined;

// This output should be the processed version of the python script output
// Readable by d3
export const exampleProcessedData = {
  name: "nloc",
  children: [
    {
      name: "analyze-me.swift",
      value: 68,
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
      name: "analyze-me.swift",
      value: 68,
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
      ]
    }
  ]
};
