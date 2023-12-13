/*
 * Project 2
 * Editor component JavaScript source code
 *
 * Author: Denis Gracanin, Craig Huang
 * Version: 1.0
 */
// Uses Project 1 solution skeleton code, added the edit menu. All menu methods are called as props from App.js
// Imports
import "./MenuBar.css";
import React from "react";
import Box from "@mui/material/Box";
import {
  AppBar,
  Button,
  Toolbar,
  Menu,
  MenuItem,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import TextField from "@mui/material/TextField";

const MenuBar = (props) => {
  // States
  const [fileAnchor, setFileAnchor] = React.useState(null); //Anchor for file menu
  const [editAnchor, setEditAnchor] = React.useState(null); //Anchor for edit menu
  const [newOpen, setNewOpen] = React.useState(false); //New dialog state
  const [loadOpen, setLoadOpen] = React.useState(false); //Load dialog state
  const [saveOpen, setSaveOpen] = React.useState(false); //Save As dialog state
  const [fileName, setFileName] = React.useState(""); //New File Name
  const fileOpen = Boolean(fileAnchor); //File Menu state
  const editOpen = Boolean(editAnchor); //Edit Menu state
  const handleFileClick = (event) => {
    setFileAnchor(event.currentTarget);
  };
  const handleFileClose = () => {
    setFileAnchor(null);
  };
  const handleEditClick = (event) => {
    setEditAnchor(event.currentTarget);
  };
  const handleEditClose = () => {
    setEditAnchor(null);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div>
            {/* File function button */}
            <Button
              sx={{ bgcolor: "white", color: "blue" }}
              id="basic-button"
              aria-controls={fileOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={fileOpen ? "true" : undefined}
              onClick={handleFileClick}
            >
              File
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={fileAnchor}
              open={fileOpen}
              onClose={handleFileClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {/* New button */}
              <MenuItem
                onClick={() => {
                  setNewOpen(true);
                }}
              >
                New
              </MenuItem>
              {/* New button dialog */}
              <Dialog
                open={newOpen}
                onClose={() => {
                  setNewOpen(false);
                }}
              >
                <DialogTitle>Enter new file name</DialogTitle>
                <DialogContent>
                  <TextField
                    margin="dense"
                    id="newFileName"
                    label="File Name"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setNewOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      props.newFileHandler(fileName);
                      setFileName("");
                      setNewOpen(false);
                    }}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Load button */}
              <MenuItem
                onClick={() => {
                  setLoadOpen(true);
                }}
              >
                Load
              </MenuItem>
              {/* Load button dialog */}
              <Dialog
                open={loadOpen}
                onClick={() => {
                  setLoadOpen(false);
                }}
              >
                <DialogTitle>Select file to load</DialogTitle>
                <List sx={{ pt: 0 }}>
                  {props.fileList &&
                    props.fileList.map((file) => (
                      <ListItemButton
                        onClick={() => props.loadHandler(file.id)}
                        key={file.id}
                      >
                        <ListItemText primary={file.fileName} />
                      </ListItemButton>
                    ))}
                </List>
              </Dialog>
              {/* Save button */}
              <MenuItem onClick={props.saveHandler}>Save</MenuItem>

              {/* Save As button */}
              <MenuItem
                onClick={() => {
                  setSaveOpen(true);
                }}
              >
                Save As
              </MenuItem>
              {/* Save As dialog */}
              <Dialog
                open={saveOpen}
                onClose={() => {
                  setSaveOpen(false);
                }}
              >
                <DialogTitle>Enter File Name</DialogTitle>
                <DialogContent>
                  <TextField
                    margin="dense"
                    id="name"
                    label="File Name"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setSaveOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      props.saveAsHandler(fileName);
                      setFileName("");
                      setSaveOpen(false);
                    }}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </Menu>

            {/* Edit button */}
            <Button
              sx={{ bgcolor: "white", color: "blue", marginLeft: 1 }}
              id="basic-button"
              aria-controls={editOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={editOpen ? "true" : undefined}
              onClick={handleEditClick}
            >
              Edit
            </Button>
            {/* Menu for Edit button */}
            <Menu
              id="basic-menu"
              anchorEl={editAnchor}
              open={editOpen}
              onClose={handleEditClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {/* Cut button */}
              <MenuItem onClick={props.deleteElementHandler}>Cut</MenuItem>
              {/* Copy button */}
              <MenuItem onClick={props.copyElementHandler}>Copy</MenuItem>
              {/* Paste button */}
              <MenuItem onClick={props.pasteElementHandler}>Paste</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MenuBar;
