import { Button } from '@mui/material'
import { useMemo } from 'react'
import { Column } from 'react-table'
import useSystems from 'hooks/useSystems'
import { System } from 'types/custom_types'

type JobCreateSystemsTableData = {
  namespace: string
  name: string
  version: string
  choose: JSX.Element
}

const ChooseButton = (
  system: System,
  systemSetter: (system: System) => void,
): JSX.Element => {
  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      onClick={() => systemSetter(system)}
    >
      Select
    </Button>
  )
}

const useSystemsData = (systemSetter: (system: System) => void) => {
  return useSystems((system: System): JobCreateSystemsTableData => {
    const { namespace, name, version } = system
    return {
      namespace,
      name,
      version,
      choose: ChooseButton(system, systemSetter),
    }
  })
}
const useSystemColumns = () => {
  return useMemo<Column<JobCreateSystemsTableData>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        width: 125,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: 'System Name',
        accessor: 'name',
        width: 150,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: 'System Version',
        accessor: 'version',
        width: 150,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: '',
        accessor: 'choose',
      },
    ],
    [],
  )
}

export { useSystemsData, useSystemColumns }
