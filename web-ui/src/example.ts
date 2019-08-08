// An export for example data to test d3 viz with
// This output should be the json outputted by the python code analysis script
export const exampleData = undefined;

// This output should be the processed version of the python script output
// Readable by d3
export const exampleProcessedData = 
{
  "name":"Metrics",
  "children":
    [
      {
      "name":"file1",
      "children":
        [
          {
           "name": "CCN",
           "value" : "2"
          },
          {
           "name": "NLOC",
           "value":"10"
          },
          {
            "name" : "TOKEN",
            "value" : "29"
          },
          {
            "name" : "PARAM",
            "value" : "2"
          }
        ]
      },
      {
      "name":"file2",
      "children":
      [
        {
         "name": "CCN",
         "value" : "1"
        },
        {
         "name": "NLOC",
         "value":"6"
        },
        {
          "name" : "TOKEN",
          "value" : "3"
        },
        {
          "name" : "PARAM",
          "value" : "1"
        }
      ]
      },
      {
        "name":"file3",
        "children":
          [
            {
             "name": "CCN",
             "value" : "5"
            },
            {
             "name": "NLOC",
             "value":"30"
            },
            {
              "name" : "TOKEN",
              "value" : "50"
            },
            {
              "name" : "PARAM",
              "value" : "10"
            }
          ]
        },
        {
          "name":"file4",
          "children":
            [
              {
               "name": "CCN",
               "value" : "8"
              },
              {
               "name": "NLOC",
               "value":"50"
              },
              {
                "name" : "TOKEN",
                "value" : "60"
              },
              {
                "name" : "PARAM",
                "value" : "8"
              }
            ]
          }
    ]
  }