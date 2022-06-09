import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelIcon from '@mui/icons-material/Cancel'
import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Command, System } from 'types/custom_types'
import { JobCreateCommandsTable } from './JobCreateCommandsTable'
import { JobCreateSystemsTable } from './JobCreateSystemsTable'

const JobCreate = () => {
  const [system, _setSystem] = useState<System | undefined>(undefined)
  const [command, _setCommand] = useState<Command | undefined>(undefined)
  const navigate = useNavigate()

  const setSystem = (system: System) => {
    console.log('Setting system:', system)
    _setSystem(system)
  }
  const setCommand = (command: Command) => {
    console.log('Setting command:', command)
    _setCommand(command)
  }
  const cancelJob = () => {
    _setSystem(undefined)
    _setCommand(undefined)
    navigate('/jobs')
  }
  const backToSystem = () => {
    _setSystem(undefined)
    _setCommand(undefined)
  }

  const cancelButton = (
    <Button size="small" onClick={cancelJob} startIcon={<CancelIcon />}>
      Cancel
    </Button>
  )

  return !system ? (
    <JobCreateSystemsTable systemSetter={setSystem}>
      {cancelButton}
    </JobCreateSystemsTable>
  ) : !command ? (
    <JobCreateCommandsTable
      system={system as System}
      commandSetter={setCommand}
    >
      <Button size="small" onClick={backToSystem} startIcon={<ArrowBackIcon />}>
        Back
      </Button>
      {cancelButton}
    </JobCreateCommandsTable>
  ) : (
    <Typography variant="h5">Happy</Typography>
  )
}

export { JobCreate }
