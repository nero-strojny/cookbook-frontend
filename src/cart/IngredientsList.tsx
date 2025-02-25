import { useRef, useState } from 'react';
import { Ingredient, Recipe } from '../types/Recipe';
import { combineIngredients, groupIngredientsByCategory, IngredientString } from './utility';
import { capitalize } from 'lodash';
import { parseIngredient } from '../editRecipe/utility';
import { useSearchIngredient } from '../hooks/useSearchIngredient';
import AddIngredientModal from '../editRecipe/AddIngredientModal';
import { FiMail, FiPlus } from 'react-icons/fi';
import { useEmailBasket } from '../hooks/useEmailCart';

const IngredientsList = ({cart}:{cart:Recipe[]}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const ingredients = combineIngredients(cart)
  const [newName, setNewName] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalIngredient, setModalIngredient] = useState<Ingredient>({_id:'',name:'', category: ''})
  const [groupedIngredients, setGroupedIngredients] = useState<Map<string, IngredientString[]>>(groupIngredientsByCategory(ingredients))
  const searchIngredientMutation = useSearchIngredient()
  const emailIngredientMutation = useEmailBasket()

  const categories = ['produce', 'protein', 'pantry', 'dairy', 'alcohol', 'other'];

  const toggleIngredient = (ingredient: IngredientString) => {
    const tempMap = new Map(groupedIngredients)
    const categorySelection = tempMap.get(ingredient.category) 
    if (categorySelection) {
      const matchedIngredientIndex = categorySelection.findIndex(stateIngredient=>ingredient._id===stateIngredient._id)
      if (matchedIngredientIndex !== -1) {
        const tempArray = [...categorySelection]
        tempArray[matchedIngredientIndex] = {
          ...ingredient,
          checked: !ingredient.checked
        }
        tempMap.set(ingredient.category, tempArray)
        setGroupedIngredients(tempMap)
      }
    }
  }

  const applyStrikethrough= (ingredient: IngredientString): string => {
    return ingredient.checked ? 'text-lg line-through' : 'text-lg';
  }

  const insertIngredientIntoMap = (newIngredient: Ingredient) => {
    const newString = newIngredient.amount || newIngredient.measurement ?
      `${newIngredient.amount || ''} ${newIngredient.measurement || ''} ${newIngredient.name}`
      : ''
    const categorySelection = groupedIngredients.get(newIngredient.category)
    if (categorySelection) {
      groupedIngredients.set(newIngredient.category, [...categorySelection, {
        ...newIngredient,
        combinedString: newString,
        checked: false,
        recipes: []
      }])
      setGroupedIngredients(groupedIngredients)
    }
  }

  const handleNewIngredientFromModal = (newIngredient: Ingredient) => {
    insertIngredientIntoMap(newIngredient)
    setNewName('')
  }
  
  const handleNewIngredient = async () => {
    const partialIngredient = parseIngredient(newName)
    if (partialIngredient.name) {
      setModalIngredient({_id:'',name:'', category: ''})
        const foundIngredients = await searchIngredientMutation.mutateAsync({prefix: partialIngredient.name})
        const matchedIngredient = foundIngredients.find(foundIngredient => foundIngredient.name === partialIngredient.name)
        if (foundIngredients.length > 0 && matchedIngredient) {
          insertIngredientIntoMap(matchedIngredient)
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

  const handleEmailIngredients = async () => {
    const convertedMap: {[category: string]: string[]} = {}
    groupedIngredients.forEach((ingredientStrings, key) => {
      const filteredCombinedStrings = ingredientStrings
        .filter((ingredient) => !ingredient.checked)
        .map((ingredient) => {
          const fullString = `${ingredient.name} ${ingredient.combinedString && `(${ingredient.combinedString})`}`
          return fullString.trim()
        });
      convertedMap[key] = filteredCombinedStrings
    })
    await emailIngredientMutation.mutateAsync(convertedMap)
  }

  return (
    <>
    <div ref={modalRef}>
      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        modalIngredient={modalIngredient}
        setModalIngredient={setModalIngredient}
        onSuccess={handleNewIngredientFromModal}
      />
    </div>
    <div className='flex gap-1 my-6'>
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
      {categories.map((category) => (
      <div key={category} className="mb-4">
        <h3 className="text-lg font-medium text-gray-800">{capitalize(category)}</h3>
        <ul className="list-disc pl-5">
          {groupedIngredients.get(category)?.map((ingredient, index) => (
            <div key={`${ingredient._id}-${index}`}>
              <button
                type="button"
                className='cursor-pointer'
                onClick={() => toggleIngredient(ingredient)}
              >
              <li className={applyStrikethrough(ingredient)}>
              {`${ingredient.name} ${ingredient.combinedString && `(${ingredient.combinedString})`}`}
              </li>
              </button>
            </div>
          )) || <li className="text-gray-500">No ingredients in this category</li>}
        </ul>
      </div>))}
      <button
        onClick={()=>handleEmailIngredients()}
        className="w-full bg-sandy text-white hover:bg-rust p-3 rounded-md mb-4">
        <div className="flex items-center justify-center gap-2">
          <FiMail size={20} />
          <span>Send to email</span>
        </div>
      </button>
  </>
  );
};

export default IngredientsList;
