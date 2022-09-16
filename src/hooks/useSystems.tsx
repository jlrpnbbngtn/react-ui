import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useEffect, useState } from 'react'
import { System } from 'types/backend-types'

const useSystems = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [systems, setSystems] = useState<System[]>([])
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'get',
    withCredentials: authEnabled,
  })

  useEffect(() => {
    if (data && !error) {
      setSystems(data)
    }
  }, [data, error])

  const getSystems = () => {
    return systems
  }

  return {
    getSystems,
    systems,
  }
}

const useManipulateSystem = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const reloadSystem = (systemId: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/systems/${systemId}`,
      method: 'patch',
      withCredentials: authEnabled,
      data: { operation: 'reload' },
    }

    execute(config)
  }

  const deleteSystem = (systemId: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/systems/${systemId}`,
      method: 'delete',
      withCredentials: authEnabled,
    }

    execute(config)
  }

  return { reloadSystem, deleteSystem }
}

export { useManipulateSystem, useSystems }
