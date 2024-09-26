'use client'
import AdvancedDataTable from './components/AdvanceDataTable'
import { ADVANCED_DATA_TABLE } from './constants/constants'

export default function Home() {
  return (
    <div style={{ backgroundColor: 'f5f5f5' }}>
      <h1
        style={{
          textAlign: 'center',
          color: '#333',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          padding: '0',
        }}
      >
        {ADVANCED_DATA_TABLE}
      </h1>
      <div
        style={{
          maxWidth: '80%',
          margin: '0 auto',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <AdvancedDataTable />
      </div>
    </div>
  )
}
