import React from 'react'
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  IconButton,
} from '@mui/material'
import { MRT_ColumnDef, MRT_VisibilityState } from 'material-react-table'
import {
  APPLY,
  SHOW_ALL_COLUMNS,
  SHOW_HIDE_COLUMNS,
} from '../constants/constants'
import { Close } from '@mui/icons-material'

interface ColumnVisibilityPanelProps<T extends Record<string, any>> {
  columns: MRT_ColumnDef<T>[]
  visibility: MRT_VisibilityState
  onVisibilityChange: (visibility: MRT_VisibilityState) => void
  setDrawerOpen: (open: boolean) => void
}

export const ColumnVisibilityPanel = <T extends Record<string, any>>({
  columns,
  visibility,
  onVisibilityChange,
  setDrawerOpen,
}: ColumnVisibilityPanelProps<T>) => {
  const handleVisibilityChange = (columnId: string, isVisible: boolean) => {
    onVisibilityChange({ ...visibility, [columnId]: isVisible })
  }

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={'space-between'}
        mb={2}
      >
        <Typography variant="h6">{SHOW_HIDE_COLUMNS}</Typography>
        <IconButton onClick={() => setDrawerOpen(false)} size="small">
          <Close />
        </IconButton>
      </Box>
      {columns.map((column) => (
        <Box
          key={column.accessorKey as string}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            border: '1px solid #ddd',
            borderRadius: 1,
            padding: 1,
          }}
        >
          <Typography sx={{ flexGrow: 1 }}>{column.header}</Typography>
          <Switch
            checked={visibility[column.accessorKey as string] ?? true}
            onChange={(e, checked) =>
              handleVisibilityChange(column.accessorKey as string, checked)
            }
            color="primary"
            size="small"
          />
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            const newVisibility = { ...visibility }
            columns.forEach((column) => {
              newVisibility[column.accessorKey as string] = true
            })
            onVisibilityChange(newVisibility)
          }}
          fullWidth
        >
          {SHOW_ALL_COLUMNS}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Button variant="contained" fullWidth>
          {APPLY}
        </Button>
      </Box>
    </Box>
  )
}
