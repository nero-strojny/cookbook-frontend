import React, { useContext } from 'react'
import { Icon, Menu } from "semantic-ui-react";
import { ServerRequestContext } from "./ServerRequestContext"

function Header(): JSX.Element {
  const { dispatch: serverDispatch, state } = useContext(ServerRequestContext);
  const activeItem = state.currentPage;

  return (
  <Menu inverted color="orange" icon='labeled' stackable>
    <Menu.Item
      onClick={() => serverDispatch({ type: 'SWITCH_TO_PAGE', payload: { currentPage: "viewRecipes" } })}
    >
      <h1 style={{fontFamily:'Marck Script'}}><Icon name="food" size="small" />TastyBoi</h1>
    </Menu.Item>
    <Menu.Menu position='right' icon='labeled'>
      <Menu.Item
        name='basket'
        active={activeItem === 'basket'}
        onClick={() => serverDispatch({ type: 'SWITCH_TO_PAGE', payload: { currentPage: "basket" } })}
      >
        <Icon name="shopping basket" size="small" />
        Basket
        { state.basket && state.basket.length > 0 && ` (${state.basket.length})`}   
      </Menu.Item>
      <Menu.Item
        name='calendar'
        active={activeItem === 'calendar'}
        onClick={() => serverDispatch({ type: 'SWITCH_TO_PAGE', payload: { currentPage: "calendar" } })}
      >
        <Icon name="calendar alternate outline" size="small" />
        Calendar
      </Menu.Item>
      <Menu.Item
        name='logout'
        active={activeItem === 'logout'}
        onClick={() => serverDispatch({ type: 'SWITCH_TO_PAGE', payload: { currentPage: "viewRecipes" } })}
      >
        <Icon name="log out" size="small" />
        Logout
      </Menu.Item>
    </Menu.Menu>
  </Menu>
  )
}

export default Header;
