import { CustomDrawer } from '../components'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
  return (
    <>
			<CustomDrawer>
        <Outlet />
      </CustomDrawer>
    </>
  )
}
