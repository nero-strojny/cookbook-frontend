import React, { useContext } from 'react'
import { Icon, Button, Grid } from "semantic-ui-react";
import { ServerRequestContext } from "./ServerRequestContext"

function Header({ styleValue }) {
  
  const { dispatch: serverDispatch, state } = useContext(ServerRequestContext);

  return (
      <Grid className={styleValue} style={{marginBottom:'15px', padding: '10px'}} stackable>
        <Grid.Row>
          <Grid.Column width={8}>
          <div
            className="headerTitleStyle">
            <Icon name="food" size="small" />
            TastyBoi
          </div>
          </Grid.Column>
          <Grid.Column width={8} textAlign='right'>
            <Button inverted onClick={() => serverDispatch({ type: 'LOGOUT_SUCCESS' })}>
                <Icon name="log out" />
                Log-out
            </Button>
            {
              state.currentPage === "basket" ?
              (
                <Button inverted onClick={() => serverDispatch({ type: 'SWITCH_TO_RECIPES' })}>
                  <Icon name="list alternate outline" />
                  View Recipes
                </Button>
              ) :
              (
                <Button inverted onClick={() => serverDispatch({ type: 'SWITCH_TO_BASKET' })}>
                  <Icon name="shopping basket" />
                  Basket
                  { state.basket && state.basket.length > 0 && ` (${state.basket.length})`}
                </Button>
              )
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>

  )
}

export default Header;
