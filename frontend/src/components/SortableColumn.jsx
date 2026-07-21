import { IconButton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const SortableColumn = ({ column, sortColumn, sortOrder, onSort,bool=false}) => {
  console.log('bool',bool)
  return (
    <IconButton onClick={() => onSort(column,column==='fournisseur'||column==='client'?true:bool)}>
      {sortColumn === column ? (
        sortOrder === 1 ? <ArrowUpward style={{ color: "white" }} /> : <ArrowDownward style={{ color: "white" }} />
      ) : (
        <ArrowDownward style={{ color: "white" }} />
      )}
    </IconButton>
  );
};

export default SortableColumn;
