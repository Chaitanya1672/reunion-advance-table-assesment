import React from 'react'
import { Box, Typography, Button, IconButton, styled } from '@mui/material'
import { MRT_ColumnDef, MRT_SortingState } from 'material-react-table'
import { ArrowDownward, ArrowUpward, Close } from '@mui/icons-material'
import { CLEAR_SORT, SORTING_OPTIONS } from '../constants/constants'

interface SortPanelProps<T extends Record<string, any>> {
  columns: MRT_ColumnDef<T>[]
  sorting: MRT_SortingState
  onSortingChange: (sorting: MRT_SortingState) => void
  setDrawerOpen: (open: boolean) => void
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: 12,
  padding: 0,
  opacity: 0.5,
  '&:hover': {
    opacity: 0.7,
  },
}))

const StyledColumnBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: 40,
  padding: theme.spacing(1),
  transition: 'opacity 0.3s ease',
}))

export const SortPanel = <T extends Record<string, any>>({
  columns,
  sorting,
  onSortingChange,
  setDrawerOpen,
}: SortPanelProps<T>) => {
  const handleSortChange = (columnId: string) => {
    const currentSort = sorting.find((s) => s.id === columnId)
    let newSort: MRT_SortingState
    if (!currentSort) {
      newSort = [...sorting, { id: columnId, desc: false }]
    } else if (currentSort.desc) {
      newSort = sorting.filter((s) => s.id !== columnId)
    } else {
      newSort = sorting.map((s) =>
        s.id === columnId ? { ...s, desc: true } : s,
      )
    }
    onSortingChange(newSort)
  }

  const clearSort = () => {
    onSortingChange([])
  }

  return (
    <Box sx={{ width: 280, p: 1 }}>
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        justifyContent={'space-between'}
      >
        <Typography variant="h6">{SORTING_OPTIONS}</Typography>
        <IconButton onClick={() => setDrawerOpen(false)} size="small">
          <Close />
        </IconButton>
      </Box>
      {columns.map((column) => (
        <StyledColumnBox key={column.accessorKey as string}>
          <Typography marginRight={1}>{column.header as string}</Typography>
          <Box display={'flex'}>
            <StyledIconButton
              onClick={() => handleSortChange(column.accessorKey as string)}
              color={
                sorting.find((s) => s.id === column.accessorKey && !s.desc)
                  ? 'primary'
                  : 'default'
              }
            >
              <ArrowUpward />
            </StyledIconButton>
            <StyledIconButton
              onClick={() => handleSortChange(column.accessorKey as string)}
              color={
                sorting.find((s) => s.id === column.accessorKey && s.desc)
                  ? 'primary'
                  : 'default'
              }
            >
              <ArrowDownward />
            </StyledIconButton>
          </Box>
        </StyledColumnBox>
      ))}
      <Button fullWidth variant="contained" onClick={clearSort} sx={{ mt: 2 }}>
        {CLEAR_SORT}
      </Button>
    </Box>
  )
}
