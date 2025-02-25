import { FiX } from "react-icons/fi"

interface IngredientCheckboxProps {
  checked: boolean
  toggleChecked: () => void
}
export const IngredientCheckbox = (props:IngredientCheckboxProps) => {
  const {checked, toggleChecked} = props
  return <div className="border-2 border-sandy text-sandy w-6 h-6 flex items-center justify-center"><button
    type='button'
    onClick={()=>toggleChecked()}
    className="cursor-pointer">
    {checked ? <FiX size={24} /> : <div className="w-6 h-6" />}
  </button></div>
}