import React, { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_VisibilityState,
} from 'material-react-table'
import { Box, IconButton, Drawer } from '@mui/material'
import {
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Sort as SortIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'

import { ColumnVisibilityPanel } from './ColumnVisibilityPanel'
import { SortPanel } from './SortPanel'
import { FilterPanel } from './FilterPanel'
import { GroupPanel } from './GroupPanel'
import DummyData from '../data.json'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {
  CREATE_GROUPS,
  FILTERS,
  SHOW_HIDE_COLUMNS,
  SORTING_OPTIONS,
} from '../constants/constants'
import { DataType } from '../types/common'

dayjs.extend(utc)
dayjs.extend(timezone)

// Sample data
const data: DataType[] = DummyData

const AdvancedDataTable: React.FC = () => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {},
  )
  const [grouping, setGrouping] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerContent, setDrawerContent] = useState<
    'filter' | 'columns' | 'sort' | 'group' | null
  >(null)

  const columns = useMemo<MRT_ColumnDef<DataType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        filterFn: 'fuzzy',
      },
      {
        accessorKey: 'category',
        header: 'Category',
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'subcategory',
        header: 'Subcategory',
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        filterVariant: 'date-range',
        Cell: ({ cell }) => (
          <>
            {cell.getValue<string>()
              ? dayjs(cell.getValue<string>()).format('DD-MMM-YYYY HH:MM')
              : ''}
          </>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        Cell: ({ cell }) => (
          <>
            {cell.getValue<string>()
              ? dayjs(cell.getValue<string>()).format('DD-MMM-YYYY HH:MM')
              : ''}
          </>
        ),
        filterVariant: 'date-range',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        filterVariant: 'range',
        size: 130,
      },
      {
        accessorKey: 'sale_price',
        header: 'Sales Price',
        filterVariant: 'range',
        size: 130,
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilters: false,
    enableFilters: true,
    enableGlobalFilter: true,
    enableGrouping: true,
    enableColumnActions: true,
    enableColumnDragging: false,
    enableTopToolbar: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    paginationDisplayMode: 'pages',
    enablePagination: true,
    enableColumnResizing: true,
    enableFacetedValues: true,
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined',
    },
    positionToolbarAlertBanner: 'none',
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    initialState: { density: 'spacious', showGlobalFilter: true },
    enableFilterMatchHighlighting: false,
    renderToolbarInternalActions: () => (
      <Box>
        <IconButton
          onClick={() => {
            setDrawerContent('filter')
            setDrawerOpen(true)
          }}
          title={FILTERS}
        >
          <FilterIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setDrawerContent('columns')
            setDrawerOpen(true)
          }}
          title={SHOW_HIDE_COLUMNS}
        >
          <ViewColumnIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setDrawerContent('sort')
            setDrawerOpen(true)
          }}
          title={SORTING_OPTIONS}
        >
          <SortIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setDrawerContent('group')
            setDrawerOpen(true)
          }}
          title={CREATE_GROUPS}
        >
          <GroupIcon />
        </IconButton>
      </Box>
    ),
    state: {
      columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
      grouping,
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <MaterialReactTable table={table} />

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: 350,
              padding: 2,
              paddingRight: '16px',
              margin: '0 10px',
              boxSizing: 'border-box',
            }}
          >
            {drawerContent === 'filter' && (
              <FilterPanel
                columns={columns}
                onFilterChange={setColumnFilters}
                setDrawerOpen={setDrawerOpen}
                columnFilters={columnFilters}
                data={table.options.data}
              />
            )}
            {drawerContent === 'columns' && (
              <ColumnVisibilityPanel
                columns={columns}
                visibility={columnVisibility}
                onVisibilityChange={setColumnVisibility}
                setDrawerOpen={setDrawerOpen}
              />
            )}
            {drawerContent === 'sort' && (
              <SortPanel
                columns={columns}
                sorting={sorting}
                onSortingChange={setSorting}
                setDrawerOpen={setDrawerOpen}
              />
            )}
            {drawerContent === 'group' && (
              <GroupPanel
                columns={columns}
                grouping={grouping}
                onGroupingChange={setGrouping}
                setDrawerOpen={setDrawerOpen}
              />
            )}
          </Box>
        </Drawer>
      </Box>
    </LocalizationProvider>
  )
}

export default AdvancedDataTable
