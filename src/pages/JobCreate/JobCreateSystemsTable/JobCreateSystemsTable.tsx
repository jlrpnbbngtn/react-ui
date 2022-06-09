import { PropsWithChildren } from 'react'
import { Table } from 'components/Table'
import { System } from 'types/custom_types'
import { useSystemColumns, useSystemsData } from './jobCreateSystemsTableData'

interface JobCreateSystemTableProps {
  systemSetter: (system: System) => void
}
const JobCreateSystemsTable = ({
  systemSetter,
  children,
}: PropsWithChildren<JobCreateSystemTableProps>) => {
  return (
    <Table
      tableName="Choose System"
      data={useSystemsData(systemSetter)}
      columns={useSystemColumns()}
      showGlobalFilter
    >
      {children}
    </Table>
  )
}

export { JobCreateSystemsTable }
