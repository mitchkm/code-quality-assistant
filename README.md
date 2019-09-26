# Code Quality Assistant
Our intention in this project is to provide a simple-to-use tool that produces an easily accessible and usable interface for exploring high-level metrics about a specific coding project. Our final deliverable will be a standalone executable usable on Unix systems that produces a local landing page to view this analysis. This method will not only provide easy and immediate feedback at individual developer’s local workstations on a day-to-day basis but is intended to easily fit into a CI type pipeline. The executable could be kicked off on a remote machine and producing a webpage that could then be accessed by all developers remotely. Additionally, we intend to provide documentation for the tool’s use, and documentation on how to get started extending the tool.

## Dependencies List
### Project
- Node/npm
- Python 3.7
- Pip
### Web UI (see web-ui/package.json for full list)
- Typescript
- browserify
- tsify
- d3
### Code Analysis
- [lizard](https://github.com/terryyin/lizard) 1.16.6
### Build script dependencies
- Pyinstaller
