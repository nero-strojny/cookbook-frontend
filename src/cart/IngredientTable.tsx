import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { combineIngredients, ingredientsToTable, IngredientString } from './utility'
import { capitalize } from 'lodash'
import { RecipeCell } from './RecipeCell'
import { Ingredient, Recipe } from '../types/Recipe'
import { IngredientCheckbox } from './IngredientCheckbox'
import { isMobileOnly } from 'react-device-detect'
import { FiMail, FiPlus } from 'react-icons/fi'
import { useMemo, useRef, useState } from 'react'
import AddIngredientModal from '../editRecipe/AddIngredientModal'
import { useSearchIngredient } from '../hooks/useSearchIngredient'
import { parseIngredient } from '../editRecipe/utility'
import { useEmailBasket } from '../hooks/useEmailCart'

export const IngredientTable = ({cart}:{cart:Recipe[]}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const ingredients = combineIngredients(cart)
  const [newName, setNewName] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalIngredient, setModalIngredient] = useState<Ingredient>({_id:'',name:'', category: ''})
  const [groupedIngredients, setGroupedIngredients] = useState<IngredientString[]>(ingredientsToTable(ingredients))
  const searchIngredientMutation = useSearchIngredient()
  const emailIngredientMutation = useEmailBasket()
  
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'checked', desc: false },
    { id: 'category', desc: false },
    { id: 'name', desc: false },
  ])

  const toggleIngredient = (_id: string) => {
    const tempArray = [...groupedIngredients]
    const ingredientIndex = tempArray.findIndex(ingredient => ingredient._id === _id)
    if (ingredientIndex !== -1){
      tempArray[ingredientIndex].checked = !tempArray[ingredientIndex].checked
      setGroupedIngredients(tempArray)
    }
  }

  const applyStrikethrough = (checked: boolean): string => {
      return checked ? 'line-through' : '';
  }

  const handleNewIngredientFromModal = (newIngredient: Ingredient) => {
    const newString = `${newIngredient.amount || ''} ${newIngredient.measurement || ''} ${newIngredient.name}`
    setGroupedIngredients([...groupedIngredients, {
      ...newIngredient, 
      checked: false,
      combinedString: newString.trim(),
      recipes: []
    }])
    setNewName('')
  }

  const handleNewIngredient = async () => {
    const partialIngredient = parseIngredient(newName)
    if (partialIngredient.name) {
      const newString = `${partialIngredient.amount || ''} ${partialIngredient.measurement || ''} ${partialIngredient.name}`
      setModalIngredient({_id:'',name:'', category: ''})
        const foundIngredients = await searchIngredientMutation.mutateAsync({prefix: partialIngredient.name})
        const matchedIngredient = foundIngredients.find(foundIngredient => foundIngredient.name === partialIngredient.name)
        if (foundIngredients.length > 0 && matchedIngredient) {
          setGroupedIngredients([...groupedIngredients, 
            {
              _id: foundIngredients[0]._id,
              name: partialIngredient.name,
              amount: partialIngredient.amount,
              measurement: partialIngredient.measurement,
              category: foundIngredients[0].category,
              recipes:[],
              checked: false,
              combinedString: newString.trim(),
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

  const handleEmailIngredients = async () => {
    const categoryMap: { [category: string]: string[] } = {};
    groupedIngredients.forEach((ingredient) => {
      if (!ingredient.checked) {
        if (!categoryMap[ingredient.category]) {
          categoryMap[ingredient.category] = [];
        }
        const fullString = `${ingredient.name} ${ingredient.combinedString && `(${ingredient.combinedString})`}`
        categoryMap[ingredient.category].push(fullString.trim());
      }
    });
    await emailIngredientMutation.mutateAsync(categoryMap)
  }

  const columns = useMemo<ColumnDef<IngredientString>[]>(
    () => [
      {
        accessorKey: 'checked',
        header: () => '',
        cell: ({row}) => 
          <IngredientCheckbox
            checked={row.original.checked}
            toggleChecked={()=>toggleIngredient(row.original._id)}
          />,
        enableSorting: true
      },
      {
        accessorKey: 'name',
        header: () => 'Name',
        cell: ({row}) => <span
          className={`${applyStrikethrough(row.original.checked)}`}>
            {row.original.name}</span>,
        enableSorting: true
      },
      {
        accessorKey: 'combinedString',
        cell: ({row}) => <span
          className={`italic ${applyStrikethrough(row.original.checked)}`}>
            {row.original.combinedString}
          </span>,
        header: () => 'Amount',
      },
      {
        accessorKey: 'category',
        header: () => 'Category',
        cell: ({row}) => <span
          className={`${applyStrikethrough(row.original.checked)}`}>
            {capitalize(row.original.category)}</span>,
        enableSorting: true
      },
      {
        accessorKey: 'recipes',
        header: () => 'Recipes',
        cell: ({row}) => <RecipeCell recipes={row.original.recipes} checked={row.original.checked} />,
        enableSorting: true
      }
    ],
    []
  )


  const table = useReactTable({
    data: groupedIngredients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), 
    state: { sorting },
    onSortingChange: setSorting,
  })

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
      <>
        <div className='flex justify-between items-center'>
          <h3 className="text-xl">Ingredients</h3>
          <button
            onClick={()=>handleEmailIngredients()}
            className="bg-sandy text-white hover:bg-rust p-3 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <FiMail size={20} />
              {isMobileOnly ? "Email":"Send to email"}
            </div>
          </button>
        </div>
        <div className='flex gap-1 my-4'>
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
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-sandy text-white">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 border text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 border border-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
  </>)
}
