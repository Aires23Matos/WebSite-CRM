import React from "react";
import "./table.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const rows = [
  {
    id: 1,
    name: "Frozen yoghurt",
    calories: 159,
    fat: 6.0,
    status: "Pending",
    protein: 4.0,
  },
  {
    id: 2,
    name: "Eclair",
    calories: 237,
    fat: 9.0,
    status: "Approved",
    protein: 4.3,
  },
  {
    id: 3,
    name: "Eclair",
    calories: 237,
    fat: 9.0,
    status: "Pending",
    protein: 4.3,
  },
  {
    id: 4,
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    status: "Approved",
    protein: 4.3,
  },
  {
    id: 5,
    name: "Gingerbread",
    calories: 305,
    fat: 3.7,
    status: "Approved",
    protein: 4.3,
  },
];

const Table_home = () => {
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="tableCell">Calories</TableCell>
            <TableCell align="tableCell">Product</TableCell>
            <TableCell align="tableCell">Customer</TableCell>
            <TableCell align="tableCell">Status</TableCell>
             <TableCell align="tableCell">protein</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {row.id}
              </TableCell>
              <TableCell align="tableCell">{row.name}</TableCell>
               <TableCell align="tableCell">{row.calories}</TableCell>
              <TableCell align="tableCell">{row.fat}</TableCell>
              <TableCell align="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
              <TableCell align="tableCell">{row.protein}</TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Table_home;
