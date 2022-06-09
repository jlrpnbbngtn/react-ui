import { Table } from 'components/Table'
import { useSystemIndexTableColumns, useSystemIndexTableData } from './data'

const SystemIndexTable = () => {
  const data = useSystemIndexTableData()
  const columns = useSystemIndexTableColumns()

  return <Table tableName="Systems" data={data} columns={columns} />
}

export { SystemIndexTable }
