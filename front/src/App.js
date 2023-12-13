/*
 * Project 2
 * App component JavaScript source code
 *
 * Author: Denis Gracanin, Craig Huang
 * Version: 1.0
 */

// Uses Project 1 solution skeleton code
// Imports
import "./App.css";
import React, { useState, useEffect } from "react";
import Item from "./Item.js";
import MenuBar from "./MenuBar";
import BarChart from "./BarChart";
import Editor from "./Editor";
import { Box, Container } from "@mui/system";
import axios from "axios";

const App = (props) => {
  // States
  const [key, setKey] = useState(null); // LocalStorage key (_id)
  const [value, setValue] = useState(null); // Current dataset
  const [fileList, setFileList] = useState(null); // File list which stores file name and id
  const [dataSize, setDataSize] = useState(0); // Size of data
  const [selected, setSelected] = useState([]); // Selected elements
  const [clipboard, setClipboard] = useState(null); // Clipboard for paste
  const [isInitialized, setIsInitialized] = useState(false); // Initialization state

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      document.title = "Project 2: chuang25";
      // Use axios to get the data from local host 3000
      axios.get("http://localhost:3000/db/find").then((res) => {
        // Clear local storage
        localStorage.clear();
        // Map over each dataset
        const files = res.data.map((item, i) => {
          localStorage.setItem(item._id, JSON.stringify(item.fileContent));
          // Save file names and id into an array
          return { fileName: item.fileName, id: item._id };
        });
        // Save the file names and id into the file list
        setFileList(files);
      });
    }
  });

  //Load file given a key. The key is the _id so each dataset has a unique identifier.
  const loadDataset = (key) => {
    setKey(key);
    let val = JSON.parse(localStorage[key]);
    if (val.data.length === 0) {
      val.data.push({ x: "", y: 0 });
    }
    setValue(val);
    setDataSize(val.data.length);
    setSelected([]);
  };

  //Open New File
  const newDataset = (fileName) => {
    // Create a new dataset with one item that is blank
    let newDataset = {
      title: fileName,
      data: [{ x: "", y: 0 }],
    };

    // Save the new dataset to the database
    axios
      .post("http://localhost:3000/db/create", {
        fileName: fileName,
        fileContent: newDataset,
      })
      .then((res) => {
        const createdDataset = res.data;
        console.log(createdDataset);

        // Refetch the updated backend
        axios.get("http://localhost:3000/db/find").then((res) => {
          // Clear local storage
          localStorage.clear();
          // Map over datasets
          const files = res.data.map((item, i) => {
            localStorage.setItem(item._id, JSON.stringify(item.fileContent));
            // Return list of files so we can save it in our file list
            return { fileName: item.fileName, id: item._id };
          });
          // Save list of files
          setFileList(files);
          console.log(createdDataset._id);
          // Load the new dataset
          loadDataset(createdDataset._id);
        });
      })
      .catch((error) => {
        console.error("Error creating a new dataset:", error);
      });
  };

  //Save Current File
  const saveDataset = () => {
    if (!value) {
      console.error("Cannot save. No dataset loaded.");
      return;
    }

    localStorage[key] = JSON.stringify(value);

    // Update the database in the backend
    axios
      .post("http://localhost:3000/db/update/" + key, { fileContent: value })
      .then((res) => {
        console.log("Saving: ", res.data);
      });
  };

  //Save File with new name
  const saveAsDataset = (fileName) => {
    // Handle if no file is loaded
    if (!value) {
      console.error("Cannot save as. No dataset loaded.");
      return;
    }
    let newDataset = {
      title: fileName,
      data: value.data,
    };

    // Save the new dataset to the database
    axios
      .post("http://localhost:3000/db/create", {
        fileName: fileName,
        fileContent: newDataset,
      })
      .then((res) => {
        const createdDataset = res.data;
        console.log(createdDataset);
        // Refetch the updated backend
        axios.get("http://localhost:3000/db/find").then((res) => {
          // Clear local storage
          localStorage.clear();
          const files = res.data.map((item, i) => {
            localStorage.setItem(item._id, JSON.stringify(item.fileContent));
            // Return list of files so we can save it in our file list
            return { fileName: item.fileName, id: item._id };
          });
          // Save list of files
          setFileList(files);
          console.log(createdDataset._id);
          // Load the new dataset
          loadDataset(createdDataset._id);
        });
      })
      .catch((error) => {
        console.error("Error creating a new dataset:", error);
      });
  };

  //Change Chart Title
  const changeTitle = (e) => {
    // Handle if no file is loaded
    if (!value) {
      console.error("Cannot edit. No dataset loaded.");
      return;
    }
    value.title = e.target.value;
    setValue(value);
    setDataSize(dataSize + 1);
    console.log(value);
  };

  //Change X label
  const changeXLabel = (e) => {
    // Handle if no file is loaded
    if (!value) {
      console.error("Cannot edit. No dataset loaded.");
      return;
    }
    let newValue = value;
    newValue.data = value.data.map((x, i) => {
      return {
        [e.target.value]: Object.values(value.data[i])[0],
        [Object.keys(value.data[0])[1]]: Object.values(value.data[i])[1],
      };
    });
    setValue(newValue);
    setDataSize(dataSize + 1);
    console.log(value);
  };

  //Change Y Label
  const changeYLabel = (e) => {
    // Handle if no file is loaded
    if (!value) {
      console.error("Cannot edit. No dataset loaded.");
      return;
    }
    let newValue = value;
    newValue.data = value.data.map((x, i) => {
      return {
        [Object.keys(value.data[0])[0]]: Object.values(value.data[i])[0],
        [e.target.value]: Object.values(value.data[i])[1],
      };
    });
    setValue(newValue);
    setDataSize(dataSize + 1);
    console.log(value);
  };

  //Add a new row
  const addElement = (newX, newY) => {
    if (!value) {
      console.error("Cannot edit. No dataset loaded.");
      return;
    }
    console.log(dataSize);
    let c1 = Object.keys(value.data[0])[0];
    let c2 = Object.keys(value.data[0])[1];
    const newRow = { [c1]: newX, [c2]: newY };
    value.data.push(newRow);
    setDataSize(dataSize + 1);
    console.log(dataSize);
    setValue(value);
  };

  //Delete a row
  const deleteElement = (index) => {
    if (value.data.length > 1) {
      let newValue = value;
      newValue.data = value.data.filter((x, i, arr) => {
        return i !== index;
      });
      setValue(newValue);
      console.log(newValue);
      setDataSize(newValue.data.length);
    }
  };

  // Cut method, deletes multiple selected rows
  const deleteSelectedElements = () => {
    // Handle if no file is loaded
    if (!value) {
      console.error("Cannot delete. No dataset loaded.");
      return;
    } else if (selected.length === 0) {
      console.error("No items selected for deletion.");
      return;
    }
    setValue((prevValue) => {
      // Filter the data
      const newData = prevValue.data.filter(
        (_, index) => !selected.includes(index)
      );
      // If all items are deleted, repopulate with a single item
      const updatedData = newData.length === 0 ? [{ x: "", y: 0 }] : newData;
      // Update data size
      setDataSize(updatedData.length);
      // Return the updated dataset
      return { ...prevValue, data: updatedData };
    });

    // Unselect everything
    setSelected([]);
  };

  // Copy method
  const copySelectedElements = () => {
    // Handle if no file is loaded
    if (!value) {
      console.error("Cannot copy. No dataset loaded.");
      return;
    } else if (selected.length === 0) {
      console.error("No items selected for copying.");
      return;
    }

    // Extract selected data by mapping over selected items.
    //Exclude the index of -1 since this represent all items are being selected, and doesn't actually hold any data.
    const copiedData = selected
      .filter((index) => index !== -1)
      .map((index) => {
        return value.data[index];
      });

    // Save selected data to clipboard
    setClipboard(copiedData);
    console.log("Copied data: ", copiedData);
  };

  // Paste method. Pasting ensures that there is no duplicate X value, creating a numerical suffix at the end.
  const pasteElements = () => {
    // Handle if no file is loaded
    if (!value) {
      console.error("Cannot paste. No dataset loaded.");
      return;
      // Handle if nothing was copied
    } else if (!clipboard) {
      console.error("Cannot paste. Nothing copied on clipboard.");
      return;
    }
    // Create copy of current data
    const updatedData = [...value.data];

    // Go through each item in the clipboard
    clipboard.forEach((item) => {
      let newX = Object.values(item)[0];
      // Check for duplicate X value, and add a suffix if the duplicate exists
      let suffix = 1;
      while (
        updatedData.some((dataItem) => Object.values(dataItem)[0] === newX)
      ) {
        // If a duplicate X value is found, then append the suffix to the X value
        newX = Object.values(item)[0] + suffix;
        suffix++;
      }
      // Push a new item with the new X to the updated data
      const newItem = { ...item, [Object.keys(item)[0]]: newX };
      updatedData.push(newItem);
    });

    console.log("Updated data: ", updatedData);

    // Set the current dataset to the updated data
    setValue((prevValue) => ({ ...prevValue, data: updatedData }));
    // Update current dataset size
    setDataSize(updatedData.length);
    console.log("Pasted data: ", clipboard);
  };

  //Edit a row
  const editElement = (newVal, index, xVal) => {
    console.log("Edit Elem: ", index, newVal, xVal);
    let c1 = Object.keys(value.data[0])[0];
    let c2 = Object.keys(value.data[0])[1];
    xVal ? (value.data[index][c1] = newVal) : (value.data[index][c2] = newVal);
    setDataSize(dataSize + 1);
    setValue(value);
    console.log(value);
  };

  //Select with checkboxes
  const selectElement = (e, index) => {
    if (!value) {
      console.error("Cannot select. No dataset loaded.");
      return;
    }
    if (e.target.checked) {
      console.log("Checked: " + index);
      selected.push(index);
      if (index === -1) {
        for (let i = 0; i < value.data.length; i++) {
          if (selected.indexOf(i) === -1) {
            selected.push(i);
          }
        }
      }
      setSelected(selected);
    } else {
      console.log("Unchecked: " + index);
      if (index === -1) {
        setSelected([]);
      } else {
        let newSelected = selected.filter((value, i, arr) => {
          return value !== index;
        });
        setSelected(newSelected);
      }
    }
    setDataSize(dataSize + 1);
    console.log(selected);
  };

  //Select by clicking bars
  const selectBar = (index) => {
    // Case when the bar is initially unselected
    if (!selected.includes(index)) {
      console.log("Checked: " + index);
      // Add the selected bar to the selected list
      selected.push(index);
      // Check if index is -1, which selects all items
      if (index === -1) {
        for (let i = 0; i < value.data.length; i++) {
          if (selected.indexOf(i) === -1) {
            selected.push(i);
          }
        }
      }
      // Update the list of selected items
      setSelected(selected);
    } else {
      // Case when the bar is initially selected
      console.log("Unchecked: " + index);
      // Check if index is -1, which deselects all items
      if (index === -1) {
        setSelected([]);
      } else {
        // Deselect a specific bar by filtering out the item we are deselecting
        let newSelected = selected.filter((value, i, arr) => {
          return value !== index;
        });
        // Update the list of selected items
        setSelected(newSelected);
      }
    }
    setDataSize(dataSize + 1);
    console.log(selected);
  };

  return (
    <Container className="App">
      {/* MenuBar Component */}
      <MenuBar
        loadHandler={loadDataset}
        newFileHandler={newDataset}
        saveHandler={saveDataset}
        saveAsHandler={saveAsDataset}
        deleteElementHandler={deleteSelectedElements}
        fileList={fileList}
        copyElementHandler={copySelectedElements}
        pasteElementHandler={pasteElements}
      ></MenuBar>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <Item>
          {/* Editor component */}
          <Editor
            dataset={value}
            sx={{ bgcolor: "white", width: "100%", height: "100%" }}
            addElementHandler={addElement}
            deleteElementHandler={deleteElement}
            editElementHandler={editElement}
            selected={selected}
            selectHandler={selectElement}
            titleHandler={changeTitle}
            xLabelHandler={changeXLabel}
            yLabelHandler={changeYLabel}
          />
        </Item>
        <Item>
          {/* BarChart component */}
          <BarChart
            dataset={value}
            selected={selected}
            selectHandler={selectBar}
            sx={{
              bgcolor: "white",
              width: "100%",
              height: "100%",
            }}
          ></BarChart>
        </Item>
      </Box>
    </Container>
  );
};

export default App;
