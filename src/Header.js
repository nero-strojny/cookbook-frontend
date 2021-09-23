import React, { useContext } from 'react'
import { Icon, Menu, Button } from "semantic-ui-react";
import { ServerRequestContext } from "./ServerRequestContext"

function Header({ styleValue }) {
  
  const { dispatch: serverDispatch, state } = useContext(ServerRequestContext);

  return (
      <Menu pointing secondary className={styleValue}>
        <Menu.Item>
          <div
            className="headerTitleStyle">
            <Icon name="food" size="small" />
            TastyBoi
          </div>
        </Menu.Item>
        <Menu.Item position='right'>
          <Button.Group color='orange'>
          <Button onClick={() => serverDispatch({ type: 'LOGOUT_SUCCESS' })}>
              <Icon name="log out" />
              Log-out
          </Button>
          {
            state.currentPage === "basket" ?
            (
              <Button onClick={() => serverDispatch({ type: 'SWITCH_TO_RECIPES' })}>
                <Icon name="list alternate outline" />
                View Recipes
              </Button>
            ) :
            (
              <Button onClick={() => serverDispatch({ type: 'SWITCH_TO_BASKET' })}>
                <Icon name="shopping basket" />
                Basket
                { state.basket && state.basket.length > 0 && ` (${state.basket.length})`}
              </Button>
            )
          }
          </Button.Group>
        </Menu.Item>
      </Menu>

  )
}

export default Header;
