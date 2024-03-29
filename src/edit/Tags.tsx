import React, {useContext} from "react";
import {Header, Icon, Label} from "semantic-ui-react";
import {RecipeContext} from "../context/RecipeContext";

export const defaultTags = ["dinner", "lunch", "breakfast", "snack", "side dish", "main dish"];

const Tags = (): JSX.Element => {
  const {state, dispatch} = useContext(RecipeContext);

  const currentTags = state.tags || [];

  return <>
    <Header as='h3'>Tags</Header>
    {defaultTags.map(tag => {
      const isSelected = currentTags.includes(tag);
      const iconName = isSelected ? 'minus' : 'plus';
      const labelColor = isSelected ? 'orange' : 'grey';
      return (
        <Label
          key={`tag-${tag}`}
          style={{margin: '5px 10px 5px 10px', cursor: "pointer"}}
          color={labelColor}
          onClick={() => isSelected ?
            dispatch({type: 'DELETE_TAG', payload: {tag}}) :
            dispatch({type: 'ADD_TAG', payload: {tag}})}
        >
          <Icon name={iconName}/>
          {tag}
        </Label>
      );
    })}
  </>;
}

export default Tags;