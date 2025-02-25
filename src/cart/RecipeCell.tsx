import { useState } from "react"
import { Recipe } from "../types/Recipe"
import { FiArrowUp } from "react-icons/fi"

export const RecipeCell = ({recipes, checked}:{recipes: Recipe[], checked:boolean}) => {
  const [expanded, setExpanded] = useState<boolean>()
  const cellText = recipes.length > 0 ? recipes[0].recipeName : ''

  return (
    <>
    <div className="flex items-start gap-1">
      {expanded ? 
        <ul>{
        recipes.map(recipe=><li className={`${checked && 'line-through'}`}>{recipe.recipeName}</li>)
        }</ul> :
        <div className={`${checked && 'line-through'}`}>{cellText}</div>
      }
      {(recipes.length > 1 && !expanded) &&
        <button className="cursor-pointer" onClick={()=>setExpanded(true)}>
          ...
        </button>}
    </div>
    {(recipes.length > 1 && expanded) &&
      <button className="cursor-pointer" onClick={()=>setExpanded(false)}>
        <FiArrowUp />
      </button>}
    </>
  )
}