import { useRef, useState } from "react"
import { Ingredient } from "../types/Recipe"
import { FiDelete, FiEdit, FiPlus } from "react-icons/fi"
import { parseIngredient } from "./utility"
import { useSearchIngredient } from "../hooks/useSearchIngredient"
import AddIngredientModal from "./AddIngredientModal"
import { FormDataType } from "./NewRecipe"
import { isMobileOnly } from "react-device-detect"

type IngredientFormProps = {
  formData: FormDataType
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
}

export const IngredientForm = (props:IngredientFormProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIngredient, setModalIngredient] = useState<Ingredient>({_id:'',name:'', category: ''})
  const [newName, setNewName] = useState<string>('')
  const searchIngredientMutation = useSearchIngredient()
  const { ingredients } = props.formData

  const setIngredients = (overriddenIngredients: Ingredient[]) => {
    props.setFormData({...props.formData, ingredients: overriddenIngredients})
  }

  const handleNewIngredientFromModal = (newIngredient: Ingredient) => {
    setIngredients([...ingredients, newIngredient])
    setNewName('')
  }

  const handleEditIngredient = async (ingredientToEdit: Ingredient) => {
    setIngredients(ingredients.filter(ingredient => ingredient._id !== ingredientToEdit._id))
    const newString = `${ingredientToEdit.amount || ''} ${ingredientToEdit.measurement || ''} ${ingredientToEdit.name}`
    setNewName(newString.trim())
  }

  const handleRemoveIngredient = async (ingredientToDelete: Ingredient) => {
    setIngredients(ingredients.filter(ingredient => 
      ingredient._id !== ingredientToDelete._id || ingredient.measurement !== ingredientToDelete.measurement)
    )
  }

  const handleNewIngredient = async () => {
    const partialIngredient = parseIngredient(newName)
    setModalIngredient({_id:'',name:'', category: ''})
    if (partialIngredient.name) {
      //Try to see if we already have the ingredient in our list
      const currentIngredientIndex = ingredients.findIndex(ingredient => 
        ingredient.name === partialIngredient.name &&
        ingredient.measurement === partialIngredient.measurement
      )
      if (currentIngredientIndex !== -1 ) {
        const tempIngredientArray = [...ingredients]
        tempIngredientArray[currentIngredientIndex] = {
          ...tempIngredientArray[currentIngredientIndex],
          amount: (tempIngredientArray[currentIngredientIndex].amount || 0) + (partialIngredient.amount || 0)
        }
        setIngredients(tempIngredientArray)
        setNewName('')
        return
      }
      //Now look in the database
      const foundIngredients = await searchIngredientMutation.mutateAsync({prefix: partialIngredient.name})
      const matchedIngredient = foundIngredients.find(foundIngredient => foundIngredient.name === partialIngredient.name)
      if (foundIngredients.length > 0 && matchedIngredient) {
        setIngredients([...ingredients, 
          {
            _id: foundIngredients[0]._id,
            name: partialIngredient.name,
            amount: partialIngredient.amount,
            measurement: partialIngredient.measurement,
            category: foundIngredients[0].category
          }])
        setNewName('')
      } else {
        setModalIngredient({
          _id: '',
          name: partialIngredient.name,
          amount: partialIngredient.amount,
          measurement: partialIngredient.measurement,
          category: 'pantry'
        })
        setIsModalOpen(true)
      }
    }
  }

  return <div>
    <div ref={modalRef}>
      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        modalIngredient={modalIngredient}
        setModalIngredient={setModalIngredient}
        onSuccess={handleNewIngredientFromModal}
      />
    </div>
    <div className={`mb-6 text-xl ${!isMobileOnly && 'w-1/2'} ${ingredients.length !== 0 && 'mx-auto'}`}>
      {ingredients.length === 0 ? 
        <div className="text-gray-500">No ingredients</div> :
        ingredients.map((ingredient) => (
          <div className="flex justify-between mx-auto gap-2 w-full border-b border-gray-300">
            <span key={ingredient._id}>
              {ingredient.amount} {ingredient.measurement} {ingredient.name}
            </span>
            <div className="flex gap-3">
              <button 
                onClick={()=>handleEditIngredient(ingredient)}
                className="hover:text-sandy text-rust cursor-pointer" type='button'>
                <FiEdit size={28} />
              </button>
              <button
                onClick={()=>handleRemoveIngredient(ingredient)}
                className="hover:text-sandy text-rust cursor-pointer" type='button'>
                <FiDelete size={28} />
              </button>
            </div>
          </div>
        ))
      }
    </div>
    <div className={`flex gap-1`}>
      <input
        type="text"
        value={newName}
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
            e.preventDefault()
            handleNewIngredient()
          }
        }}
        onChange={(e)=> setNewName(e.target.value)}
          className="w-full p-2 rounded-full bg-white border border-sandy"
        placeholder="Add an ingredient..."
      />
      <button 
        type='button'
        onClick={()=>handleNewIngredient()}
        className='flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-rust text-white hover:bg-sandy align-center'>
          <FiPlus />
      </button>
    </div>
</div>
}