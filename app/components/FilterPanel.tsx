import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  TextField,
  Stack,
  IconButton,
  Grid2,
  Button,
  Slider,
  styled,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MRT_ColumnDef, MRT_ColumnFiltersState } from 'material-react-table'
import dayjs from 'dayjs'
import { CLEAR_FILTERS, FILTERS, SEARCH_BY_NAME } from '../constants/constants'
import { Close } from '@mui/icons-material'
import RefreshIcon from '@mui/icons-material/Refresh'
import ChipMultiSelectFilter from './ChipMultiSelectFilter'
import { DataType } from '../types/common'

const StyledFilterBox = styled(Box)(({ theme }) => ({
  marginBottom: '1rem',
  border: '1px solid #E0E0E0',
  padding: '1rem',
  backgroundColor: '#fafbfd',
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

interface FilterPanelProps<T extends Record<string, any>> {
  columns: MRT_ColumnDef<T>[]
  onFilterChange: (filters: MRT_ColumnFiltersState) => void
  setDrawerOpen: (open: boolean) => void
  columnFilters: MRT_ColumnFiltersState
  data: any[]
}

export const FilterPanel = <T extends Record<string, any>>({
  columns,
  onFilterChange,
  setDrawerOpen,
  columnFilters,
  data,
}: FilterPanelProps<T>) => {
  const [filters, setFilters] = useState<MRT_ColumnFiltersState>([])

  const handleFilterChange = (columnId: string, value: any) => {
    const newFilters = filters.filter((f) => f.id !== columnId)
    if (value !== undefined && value !== '') {
      newFilters.push({ id: columnId, value })
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setFilters([])
    onFilterChange([])
  }

  const clearFilter = (columnId: string) => {
    setFilters(filters.filter((f) => f.id !== columnId))
    onFilterChange(filters.filter((f) => f.id !== columnId))
  }

  const handleSliderChange = (columnId: any, newValue: number | number[]) => {
    handleFilterChange(columnId, newValue)
  }

  const getFilterValue = (columnId: string): any => {
    const filter = filters.find((f) => f.id === columnId)
    if (columnId === 'name') {
      return filter?.value ?? ''
    }
    if (!filter) return ['', '']

    return Array.isArray(filter.value) ? filter.value : ['', '']
  }
  const validateDate = (columnId: string, index: number): any => {
    dayjs(getFilterValue(columnId)[index]).isValid()
      ? dayjs(getFilterValue(columnId)[index])
      : null
  }

  const getSliderValues = (columnId: string): number[] => {
    const minValue = getFilterValue(columnId)[0]
    const maxValue = getFilterValue(columnId)[1]

    return [minValue, maxValue]
  }

  const priceStatistics = useMemo(() => {
    const prices = data.map((item: DataType) => item.price)
    const salePrices = data
      .map((item) => item.sale_price)
      .filter(
        (salePrice): salePrice is number =>
          salePrice !== undefined && salePrice !== null,
      )
    return {
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      lowestSalePrice: Math.min(...salePrices),
      highestSalePrice: Math.max(...salePrices),
    }
  }, [data])

  const { lowestPrice, highestPrice, lowestSalePrice, highestSalePrice } =
    priceStatistics

  useEffect(() => {
    setFilters(columnFilters)
  }, [columns, filters])

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        justifyContent={'space-between'}
      >
        <Typography variant="h6">{FILTERS}</Typography>
        <IconButton onClick={() => setDrawerOpen(false)} size="small">
          <Close />
        </IconButton>
      </Box>
      {columns.map((column: MRT_ColumnDef<T, T>) => (
        <>
          {column.accessorKey === 'name' && (
            <StyledFilterBox key={column.accessorKey as string}>
              <StyledTypography variant="subtitle2">
                {column.header as string}
                <IconButton
                  size="small"
                  onClick={() => clearFilter(column.accessorKey as string)}
                  sx={{ p: 0 }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </StyledTypography>
              <TextField
                fullWidth
                size="small"
                placeholder={SEARCH_BY_NAME}
                value={getFilterValue(column.accessorKey as string)}
                onChange={(e) =>
                  handleFilterChange(
                    column.accessorKey as string,
                    e.target.value,
                  )
                }
              />
            </StyledFilterBox>
          )}
          {column.filterVariant && (
            <StyledFilterBox key={column.accessorKey}>
              <StyledTypography variant="subtitle2">
                {column.header as string}
                <IconButton
                  size="small"
                  onClick={() => clearFilter(column.accessorKey as string)}
                  sx={{ p: 0 }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </StyledTypography>
              {column.filterVariant === 'multi-select' && (
                <ChipMultiSelectFilter
                  column={column}
                  onFilterChange={handleFilterChange}
                  columnFilters={columnFilters}
                  data={data}
                />
              )}
              {column.filterVariant === 'range' && (
                <Stack
                  direction="row"
                  spacing={2}
                  mt={1}
                  justifyContent={'center'}
                >
                  <Slider
                    value={getSliderValues(column.accessorKey as string)}
                    onChange={(e, newValue) =>
                      handleSliderChange(column.accessorKey as string, newValue)
                    }
                    valueLabelDisplay="auto"
                    min={
                      column.accessorKey === 'price'
                        ? lowestPrice
                        : lowestSalePrice
                    }
                    max={
                      column.accessorKey === 'price'
                        ? highestPrice
                        : highestSalePrice
                    }
                    sx={{ width: '100%' }}
                  />
                </Stack>
              )}
              {column.filterVariant === 'date-range' && (
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    label="Start Date"
                    name="startDate"
                    value={validateDate(column.accessorKey as string, 0)}
                    onChange={(date) =>
                      handleFilterChange(column.accessorKey as string, [
                        dayjs(date).format('YYYY-MM-DD'),
                        getFilterValue(column.accessorKey as string)[1],
                      ])
                    }
                  />
                  <DatePicker
                    label="End Date"
                    name="endDate"
                    value={validateDate(column.accessorKey as string, 1)}
                    onChange={(date) =>
                      handleFilterChange(column.accessorKey as string, [
                        getFilterValue(column.accessorKey as string)[0],
                        dayjs(date).format('YYYY-MM-DD'),
                      ])
                    }
                  />
                </Stack>
              )}
            </StyledFilterBox>
          )}
        </>
      ))}
      <Grid2 marginTop={2} display="flex" flexDirection={'column'} gap={1}>
        <Button
          onClick={clearFilters}
          variant="outlined"
          color="primary"
          fullWidth
        >
          {CLEAR_FILTERS}
        </Button>
      </Grid2>
    </Box>
  )
}
