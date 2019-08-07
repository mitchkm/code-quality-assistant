// An export for example data to test d3 viz with
// This output should be the json outputted by the python code analysis script
export const exampleData = undefined;

// This output should be the processed version of the python script output
// Readable by d3
export const exampleProcessedData = {
  name: "Max",
  value: 100,
  children: [
    {
      name: "Sylvia",
      value: 75,
      children: [
        { name: "Craig", value: 25 },
        { name: "Robin", value: 25 },
        { name: "Anna", value: 25 }
      ]
    },
    {
      name: "David",
      value: 75,
      children: [{ name: "Jeff", value: 25 }, { name: "Buffy", value: 25 }]
    },
    {
      name: "Mr X",
      value: 75
    }
  ]
};
