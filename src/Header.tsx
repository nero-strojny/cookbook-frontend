import { has } from 'lodash';
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { Icon, Menu } from "semantic-ui-react";
import { ServerRequestContext } from "./context/ServerRequestContext";

const Header = (): JSX.Element => {
  const { dispatch: serverDispatch, state } = useContext(ServerRequestContext);
  const history = useHistory();
  let activeItem;
  if(has(history, 'location.pathname')) {
    const currentPath = history.location.pathname;
    activeItem = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  }

  return (
  <Menu inverted color="orange" icon='labeled' stackable>
    <Menu.Item
      onClick={() => {
        serverDispatch({ type: 'REFRESH_RECIPES', payload: {} });
        history.push("/viewRecipes");
      }}
    >
      <h1 style={{fontFamily:'Marck Script'}}><Icon name="food" size="small" />TastyBoi</h1>
    </Menu.Item>
    <Menu.Menu position='right' icon='labeled'>
      <Menu.Item
        name='editRecipes'
        active={activeItem === 'editRecipes'}
        onClick={() => {
          history.push("/editRecipes");
        }}
      >
        <Icon name="book" size="small" />
        New Recipe 
      </Menu.Item>
      <Menu.Item
        name='basket'
        active={activeItem === 'basket'}
        onClick={() => history.push('/basket')}
      >
        <Icon name="shopping basket" size="small" />
        Basket
        { state.basket && state.basket.length > 0 && ` (${state.basket.length})`}   
      </Menu.Item>
      <Menu.Item
        name='calendar'
        active={activeItem === 'calendar'}
        onClick={() => history.push('/calendar')}
      >
        <Icon name="calendar alternate outline" size="small" />
        Calendar
      </Menu.Item>
      <Menu.Item
        name='logout'
        active={activeItem === 'logout'}
        onClick={() => {
          localStorage.setItem('accessToken', "");
          localStorage.setItem('userName', "");
          history.push('/login');
        }}
      >
        <Icon name="log out" size="small" />
        Logout
      </Menu.Item>
    </Menu.Menu>
  </Menu>
  )
}

export default Header;
