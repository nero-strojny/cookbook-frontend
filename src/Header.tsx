import React, { useContext } from 'react'
import { Icon, Button, Grid } from "semantic-ui-react";
import { ServerRequestContext } from "./ServerRequestContext"

type HeaderProps = {
  styleValue: string;
  width: number;
}

function Header({ styleValue, width }: HeaderProps): JSX.Element {
  
  const { dispatch: serverDispatch, state } = useContext(ServerRequestContext);

  // align different depending on the screen size
  const textAlignSetting = width < 768 ? 'left' : 'right';

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
          <Grid.Column width={8} textAlign={textAlignSetting}>
            <Button inverted onClick={() => serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} })}>
                <Icon name="log out" />
                Log-out
            </Button>
            {
              state.currentPage === "basket" ?
              (
                <Button inverted onClick={() => serverDispatch({ type: 'SWITCH_TO_RECIPES', payload: {} })}>
                  <Icon name="list alternate outline" />
                  View Recipes
                </Button>
              ) :
              (
                <Button inverted onClick={() => serverDispatch({ type: 'SWITCH_TO_BASKET', payload: {} })}>
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
