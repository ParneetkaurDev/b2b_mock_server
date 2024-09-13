import { SyncResponseSection } from "../../components"
import { useSandbox } from "../../utils/hooks"


export const SandboxSyncResponseSection = () => {
  const {syncResponse} = useSandbox()
  return (
    <SyncResponseSection syncResponse={syncResponse}/>
  )
}
