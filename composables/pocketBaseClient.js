import PocketBase from 'pocketbase'

const config = useRuntimeConfig()
const host = config.public.apiBaseUrl+":"+config.public.apiPort
const pb = new PocketBase(config.public.apiBaseUrl)

export const usePocketBaseClient = () => {
  return pb
}
