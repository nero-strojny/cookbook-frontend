import { Ingredient } from '../types/Recipe';
import { useCreateIngredient } from '../hooks/useCreateIngredient';
import { LoadingButton } from '../shared/LoadingButton';
import { FiX } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

type AddIngredientModalType = {
  modalIngredient: Ingredient
  setModalIngredient: React.Dispatch<React.SetStateAction<Ingredient>>
  isOpen: boolean
  onSuccess: (newIngredient: Ingredient) => void
  onClose: () => void 
}

const AddIngredientModal = (props: AddIngredientModalType) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {isOpen, modalIngredient, onClose, onSuccess, setModalIngredient} = props
  const newIngredientMutation = useCreateIngredient()

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    const response = await newIngredientMutation.mutateAsync({ingredient:modalIngredient})
    setModalIngredient({...modalIngredient, ...response})
    onSuccess({...modalIngredient, ...response})
    onClose()
  };

  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500/75 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6" ref={modalRef}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Add ingredient</h2>
          <button onClick={onClose} className="text-gray-600 cursor-pointer"><FiX/></button>
        </div>

        <div className="text-sandy mb-4">
          <p className="font-medium">Ingredient not present, add it?</p>
        </div>
          <div className="mb-4">
            <label htmlFor="ingredientName" className="block text-sm font-medium text-gray-700">Ingredient Name</label>
            <input
              id="ingredientName"
              type="text"
              value={modalIngredient.name}
              onChange={(e) => setModalIngredient({...modalIngredient, name: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rust focus:border-rust"
              placeholder="Enter ingredient name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={modalIngredient.category}
              onChange={(e) => setModalIngredient({...modalIngredient, category: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rust focus:border-rust"
            >
              <option value="pantry">Pantry</option>
              <option value="produce">Produce</option>
              <option value="diary">Diary</option>
              <option value="alcohol">Alcohol</option>
              <option value="protein">Protein</option>
              <option value="other">Other</option>
            </select>
          </div>
          <LoadingButton text={'Add ingredient'} onClick={()=>handleSubmit()} isLoading={newIngredientMutation.isPending}/>
      </div>
    </div>
  );
};

export default AddIngredientModal;
