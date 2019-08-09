// An export for example data to test d3 viz with
// This output should be the json outputted by the python code analysis script
export const exampleData = undefined;

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
                        },
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
                        },
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
                        },
                    ]
                }
            ]  
        }    
    ]
};
