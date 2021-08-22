import React, { useContext } from 'react'
import { Icon, Menu } from "semantic-ui-react";
import { ServerRequestContext } from "./ServerRequestContext"

function Header({ styleValue }) {
  
  const { dispatch: serverDispatch } = useContext(ServerRequestContext);

  return (
      <Menu pointing secondary size="massive" className={styleValue}>
        <Menu.Item>
          <div
            className="headerTitleStyle">
            <Icon name="food" size="small" />
            TastyBoi
          </div>
        </Menu.Item>
        <Menu.Item position='right'
          onClick={() => serverDispatch({ type: 'LOGOUT_SUCCESS' })}>
          <div
            className="logoutTitleStyle">
            Logout
          </div>
          </Menu.Item>
      </Menu>

  )
}

export default Header;
