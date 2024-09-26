import React, { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { MRT_ColumnDef, MRT_ColumnFiltersState } from 'material-react-table'

interface ChipMultiSelectFilterProps {
  column: MRT_ColumnDef<any>
  onFilterChange: (columnId: string, value: any) => void
  columnFilters: MRT_ColumnFiltersState
  data: any[]
}

interface Option {
  value: string
  label: string
  count: number
}

const ChipMultiSelectFilter: React.FC<ChipMultiSelectFilterProps> = ({
  column,
  onFilterChange,
  columnFilters,
  data,
}) => {
  const [options, setOptions] = useState<Option[]>([])
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  useEffect(() => {
    const uniqueValues = new Set(
      data.map((row) => row[column.accessorKey as string]),
    )
    const newOptions = Array.from(uniqueValues).map((value) => ({
      value: value as string,
      label: value as string,
      count: data.filter((row) => row[column.accessorKey as string] === value)
        .length,
    }))
    setOptions(newOptions)

    const currentFilter = columnFilters.find(
      (filter) => filter.id === column.accessorKey,
    )
    if (currentFilter) {
      setSelectedValues(currentFilter.value as string[])
    }
    
    if (columnFilters.length === 0) {
      setSelectedValues([])
    }
  }, [data, column.accessorKey, columnFilters])

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[]
    setSelectedValues(value)
    if (value.length === 0) {
      return onFilterChange(column.accessorKey as string, '')
    }
    onFilterChange(column.accessorKey as string, value)
  }

  const handleDelete = (valueToDelete: string) => {
    const newValues = selectedValues.filter((value) => value !== valueToDelete)
    setSelectedValues(newValues)
    onFilterChange(column.accessorKey as string, newValues)
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>{column.header}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        label={column.header}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={value}
                onDelete={() => handleDelete(value)}
                clickable={true}
                deleteIcon={<CloseIcon />}
                size="small"
              />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
              width: 250,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={selectedValues?.indexOf(option.value) > -1} />
            <ListItemText primary={`${option.value} (${option.count})`} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ChipMultiSelectFilter
