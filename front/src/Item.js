/*
 * Project 2
 * Item component JavaScript source code
 *
 * Author: Denis Gracanin
 * Version: 1.0
 */
// Project 1 solution skeleton code, this is left unchanged
import { Box } from "@mui/system";
import React from "react";

const Item = (props) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#101010" : "#fff",
        color: (theme) =>
          theme.palette.mode === "dark" ? "grey.300" : "grey.800",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.300",
        p: 1,
        m: 1,
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
};

export default Item;
