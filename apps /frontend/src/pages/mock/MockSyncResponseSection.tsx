import { SyncResponseSection } from "../../components"
import { useMock } from "../../utils/hooks"


export const MockSyncResponseSection = () => {
  const {syncResponse} = useMock()
  return (
    <SyncResponseSection syncResponse={syncResponse}/>
  )
}
