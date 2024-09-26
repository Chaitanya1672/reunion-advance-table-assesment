import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  IconButton,
} from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import {
  APPLY_GROUPING,
  CLEAR_GROUPING,
  CREATE_GROUPS,
  SELECT_A_COLUMN,
} from '../constants/constants'
import { Close } from '@mui/icons-material'

interface GroupPanelProps<T extends Record<string, any>> {
  columns: MRT_ColumnDef<T>[]
  grouping?: string[]
  onGroupingChange: (grouping: string[]) => void
  setDrawerOpen: (open: boolean) => void
}

export const GroupPanel = <T extends Record<string, any>>({
  columns,
  grouping,
  onGroupingChange,
  setDrawerOpen,
}: GroupPanelProps<T>) => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(
    grouping && grouping[0] ? grouping[0] : null,
  )
  const handleSelectChange = (event: any) => {
    setSelectedColumn(event.target.value)
  }
  const handleGroupingChange = (columnId: string) => {
    onGroupingChange([columnId])
  }

  const clearGrouping = () => {
    setSelectedColumn(null)
    onGroupingChange([])
  }

  const groupingColumns = columns.filter(
    (column) => column.filterVariant === 'multi-select',
  )

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={'space-between'}
        mb={2}
      >
        <Typography variant="h6">{CREATE_GROUPS}</Typography>
        <IconButton onClick={() => setDrawerOpen(false)} size="small">
          <Close />
        </IconButton>
      </Box>
      <FormControl fullWidth>
        <InputLabel>{SELECT_A_COLUMN}</InputLabel>
        <Select
          value={selectedColumn}
          onChange={handleSelectChange}
          label={SELECT_A_COLUMN}
          fullWidth
        >
          <MenuItem value="" disabled>
            {SELECT_A_COLUMN}
          </MenuItem>
          {groupingColumns.map((column) => (
            <MenuItem key={column.accessorKey} value={column.accessorKey}>
              {column.header}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid2 marginTop={2} display="flex" flexDirection={'column'} gap={1}>
        <Button
          onClick={clearGrouping}
          variant="outlined"
          color="primary"
          fullWidth
        >
          {CLEAR_GROUPING}
        </Button>
        <Button
          onClick={() => handleGroupingChange(selectedColumn!)}
          variant="contained"
          color="primary"
          fullWidth
        >
          {APPLY_GROUPING}
        </Button>
      </Grid2>
    </Box>
  )
}
