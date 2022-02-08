import React, { FC } from 'react'
import ReactJson from 'react-json-view'
import Box from '@material-ui/core/Box'
// import { match as Match, RouteComponentProps } from "react-router-dom";
import { useParams } from 'react-router-dom'

import Divider from '../components/divider'
import Breadcrumbs from '../components/breadcrumbs'
import PageHeader from '../components/page_header'
import CommandViewForm from '../components/command_view_form'
import SystemsService from '../services/system_service'
// import { CommandParams, System } from "../custom_types/custom_types";
import { System } from '../custom_types/custom_types'
import { formBuilder } from '../builderForm/form_builder'

// interface MyProps extends RouteComponentProps<CommandParams> {
//   systems: System[];
//   match: Match<CommandParams>;
// }
interface MyProps {
  systems: System[]
}

// const CommandViewApp: FC<MyProps> = ({ systems, match }: MyProps) => {
const CommandViewApp: FC<MyProps> = (systems: MyProps) => {
  // const { command_name, namespace, system_name, version } = match.params;
  // const { namespace, system_name, version, command_name} = useParams()
  const params = useParams()
  const theSystems = systems.systems

  const [namespace, system_name, version, command_name] = [
    params.namespace || '',
    params.system_name || '',
    params.version || '',
    params.command_name || '',
  ]
  const breadcrumbs = [namespace, system_name, version, command_name]
  const title = command_name
  let description = ''
  let formElement: JSX.Element = <div />

  const { system, command } = SystemsService.getSystemAndComand(
    theSystems,
    namespace,
    system_name,
    command_name,
    version
  )

  if (system && command) {
    const build = formBuilder(system, command)
    description = command.description
    formElement = (
      <Box>
        <CommandViewForm
          schema={build.schema}
          uiSchema={build.uiSchema}
          initialModel={build.model}
          command={command}
        />
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box width={1 / 3}>
            <h3>Command</h3>
            <ReactJson src={command} />
          </Box>
          <Box width={1 / 3}>
            <h3>Schema</h3>
            <ReactJson src={build.schema} />
          </Box>
          <Box width={1 / 3}>
            <h3>UI Schema</h3>
            <ReactJson src={build.uiSchema} />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader title={title} description={description} />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {formElement}
    </Box>
  )
}

export default CommandViewApp
