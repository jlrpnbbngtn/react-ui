import { useSystems } from 'hooks/useSystems'
import { ExecuteButton } from 'pages/CommandIndex'
import {
  ChangeEvent as ReactChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { Command, System } from 'types/backend-types'
import {
  CommandIndexTableData,
  ObjectWithStringKeys,
  SystemCommandPair,
} from 'types/custom-types'

interface IParam extends ObjectWithStringKeys {
  namespace: string
  systemName: string
  version: string
}

export type CommandFormatter<T> = (
  systems: System[],
  includeHidden?: boolean,
  namespace?: string,
  systemName?: string,
  version?: string,
) => T[]

const useCommands = <T,>(formatter: CommandFormatter<T>) => {
  const [commands, setCommands] = useState<T[]>([])
  const [systemId, setSystemId] = useState('')
  const [includeHidden, setIncludeHidden] = useState(false)
  const { namespace, systemName, version } = useParams() as IParam
  const { getSystems } = useSystems()

  useEffect(() => {
    getSystems().then((response) => {
      setCommands(
        formatter(response.data, includeHidden, namespace, systemName, version),
      )
      const foundSystem = response.data.find(
        (system: System) => system.name === systemName,
      )
      if (foundSystem) setSystemId(foundSystem.id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, version, systemName, includeHidden])

  const hiddenOnChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setIncludeHidden(event.target.checked)
    },
    [],
  )

  return {
    commands,
    namespace,
    systemName,
    systemId,
    version,
    includeHidden,
    hiddenOnChange,
  }
}

const commandMapper = (pair: SystemCommandPair): CommandIndexTableData => {
  const { system, command } = pair

  return {
    namespace: command.namespace,
    system: command.systemName,
    version: command.systemVersion,
    command: command.name,
    description: command.description ?? 'No description',
    executeButton: <ExecuteButton system={system} command={command} />,
    isHidden: command.hidden
  }
}

/**
 * Consolidate an array of filters into a single filter
 *
 * @param filters - An array of filters that each take an item and return true
 * or false
 * @returns A function that takes an argument and returns true only if every
 * filter in filters returns true for that argument
 */
const filtersToFilter = <T,>(
  filters: ((arg: T) => boolean)[],
): ((arg: T) => boolean) => {
  return (arg) => {
    return filters.every((fn) => fn(arg))
  }
}

/**
 *
 * @param system - A System object
 * @returns - An array of pairs of the system without its commands and a command
 * augmented with the system details.
 */
const commandsPairer = (system: System): Array<SystemCommandPair> => {
  return system.commands.map((cmd: Command): SystemCommandPair => {
    const { commands, ...withoutCommands } = system
    return {
      system: withoutCommands,
      command: {
        ...cmd,
        namespace: system.namespace,
        systemName: system.name,
        systemVersion: system.version,
        systemId: system.id,
      },
    }
  })
}

/**
 *
 * @param systems
 * @param includeHidden
 * @param namespace
 * @param systemName
 * @param version
 * @returns
 */
const commandsFromSystems = (
  systems: System[],
  includeHidden?: boolean,
  namespace?: string,
  systemName?: string,
  version?: string,
) => {
  /* we only care about systems that have commands */
  const hasCommands = (x: System) => !!x.commands && x.commands.length > 0
  /* we only provide hidden commands if told to */
  const filterHidden = (x: SystemCommandPair) =>
    !x.command.hidden || includeHidden

  /* 
    this array holds the filters that will essentially be ANDed together
    -- is pre-populated with an identity filter so the array can't be empty 
  */
  const systemMatcher = [(x: System) => true]
  if (version) {
    systemMatcher.push((x: System) => x.version === version)
  }
  if (systemName) {
    systemMatcher.push((x: System) => x.name === systemName)
  }
  if (namespace) {
    systemMatcher.push((x: System) => x.namespace === namespace)
  }

  const goodSystems = systems
    .filter(filtersToFilter(systemMatcher))
    .filter(hasCommands)

  let systemCommandPairs = goodSystems
    .map(commandsPairer)
    .flat()
    .filter(filterHidden)

  if (includeHidden) {
    /* make the hidden appear at the top of the list */
    systemCommandPairs = systemCommandPairs
      .slice()
      .sort((a: SystemCommandPair, b: SystemCommandPair) =>
        a.command.hidden && !b.command.hidden
          ? -1
          : !a.command.hidden && b.command.hidden
          ? 1
          : 0,
      )
  }

  return systemCommandPairs.map(commandMapper)
}

export { commandsFromSystems, commandsPairer, useCommands }
