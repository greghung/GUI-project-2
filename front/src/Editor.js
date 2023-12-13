/*
 * Project 2
 * Editor component JavaScript source code
 *
 * Author: Denis Gracanin, Craig Huang
 * Version: 1.0
 */

// Uses Project 1 solution skeleton code, basically left unchanged except I increase rows per page to 100
// Imports
import "./Editor.css";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Checkbox, TablePagination } from "@mui/material";

const Editor = (props) => {
  // States
  const [newX, setNewX] = useState(null); //New X Value
  const [newY, setNewY] = useState(null); //New Y Value
  const [page, setPage] = React.useState(0); //Current table page
  const [rowsPerPage, setRowsPerPage] = React.useState(100); // 100 rows displayed per page

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <div className="centerDiv">
        <TextField
          id="newX"
          size="small"
          variant="outlined"
          label={"New X Value"}
          onChange={(e) => setNewX(e.target.value)}
        />
        <TextField
          id="newY"
          size="small"
          variant="outlined"
          label={"New Y Value"}
          onChange={(e) => setNewY(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={() => props.addElementHandler(newX, Number(newY))}
        >
          Add
        </Button>
      </div>
      <div className="centerDiv">
        <TextField
          id="titleText"
          value={props.dataset ? props.dataset.title : ""}
          size="small"
          variant="filled"
          label={"Title"}
          onChange={(e) => props.titleHandler(e)}
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={props.selected.indexOf(-1) !== -1}
                onChange={(e) => props.selectHandler(e, -1)}
              />
            </TableCell>
            <TableCell key="x">
              <TextField
                variant="standard"
                size="small"
                value={
                  props.dataset ? Object.keys(props.dataset.data[0])[0] : ""
                }
                label={"X Label"}
                onChange={(e) => props.xLabelHandler(e)}
              />
            </TableCell>
            <TableCell key="y">
              <TextField
                variant="standard"
                size="small"
                value={
                  props.dataset ? Object.keys(props.dataset.data[0])[1] : ""
                }
                label={"Y Label"}
                onChange={(e) => props.yLabelHandler(e)}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.dataset &&
            props.dataset.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((currentValue, index) => {
                return (
                  <TableRow
                    key={index + page * rowsPerPage}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={props.selected.indexOf(index) !== -1}
                        onChange={(e) =>
                          props.selectHandler(e, index + page * rowsPerPage)
                        }
                      />
                    </TableCell>
                    <TableCell key="x">
                      <TextField
                        variant="standard"
                        size="small"
                        value={
                          Object.values(
                            props.dataset.data[index + page * rowsPerPage]
                          )[0]
                        }
                        onChange={(e) =>
                          props.editElementHandler(
                            e.target.value,
                            index + page * rowsPerPage,
                            true
                          )
                        }
                      />
                    </TableCell>
                    <TableCell key="y">
                      <TextField
                        variant="standard"
                        size="small"
                        value={
                          Object.values(
                            props.dataset.data[index + page * rowsPerPage]
                          )[1]
                        }
                        onChange={(e) =>
                          props.editElementHandler(
                            Number(e.target.value),
                            index + page * rowsPerPage,
                            false
                          )
                        }
                      />
                    </TableCell>
                    <TableCell key="delete">
                      <DeleteOutlinedIcon
                        onClick={() =>
                          props.deleteElementHandler(index + page * rowsPerPage)
                        }
                      ></DeleteOutlinedIcon>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={100}
        component="div"
        count={props.dataset ? props.dataset.data.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Editor;
