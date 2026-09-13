import { useState } from "#imports"

export const useServerDay = () => {
  let today = useState('today', () => null)
  const serverTime = new Date()
  const options = {
    dateStyle: "long",
  };
  today = new Intl.DateTimeFormat('id-ID', options).format(serverTime)
  return today
}
