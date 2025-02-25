import { Link, useNavigate, useParams } from 'react-router-dom';
import { Recipe, Step } from '../types/Recipe';
import { isMobileOnly } from 'react-device-detect';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { FiDelete, FiEdit } from 'react-icons/fi';
import { Tag } from '../shared/Tag';
import { Button } from '../shared/Button';
import { PageHeader } from '../shared/PageHeader';
import { Spinner } from '../shared/Spinner';
import { useGetRecipe } from '../hooks/useGetRecipe';
import { useDeleteRecipe } from '../hooks/useDeleteRecipe';
import { useSnackbar } from '../context/SnackbarContext';

export const RecipeDetail = () => {
  const {user} = useUser()
  const {showSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const [checkedSteps, setCheckedSteps] = useState<Step[]>([]);
  const { id } = useParams<{ id: string }>();
  const { data } = useGetRecipe(id);
  const deleteMutation = useDeleteRecipe()
  const recipe = data as Recipe;

  const [activeTab, setActiveTab] = useState('basic');

  const handleDelete = async() => {
    await deleteMutation.mutateAsync({_id:recipe._id})
    showSnackbar('Recipe deleted')
    navigate('/')
  }

  const toggleStep = (step: Step) => {
    if (checkedSteps.findIndex(currentStep => step.text === currentStep.text) === -1) {
      setCheckedSteps([...checkedSteps, step]);
    } else {
      setCheckedSteps(checkedSteps.filter(currentStep => currentStep.text !== step.text));
    }
  }

  const stepChecked = (step:Step) => {
    return checkedSteps.findIndex(currentStep => currentStep.text === step.text) !== -1
  }

  const returnStats = () => {
    return isMobileOnly ? 
    <div className='grid grid-cols-2 my-8'>
      <div className='flex flex-col items-center border-r-1 border-b-1 pb-4 pr-4'>
        <p className="mb-2 text-md">Cook time:</p>
        <p className="mb-2 text-3xl">{recipe.cookTime} min</p>
      </div>
      <div className='flex flex-col items-center border-b-1 pb-4 pl-4'>
        <p className="mb-2 text-md">Prep time:</p>
        <p className="mb-2 text-3xl">{recipe.prepTime} min</p>
      </div>
       <div className='flex flex-col items-center border-r-1 pt-4 pr-4'>
       <p className="mb-2 text-md">Calories:</p>
        <p className="mb-2 text-3xl">{recipe.calories} kCal</p>
        {/* <input type='number' className="mb-2 text-3xl max-w-20 text-center border-1 rounded" defaultValue={recipe.servings}></input>kCal */}
      </div>
      <div className='flex flex-col items-center pt-4 pl-4'>
        <p className="mb-2 text-md">Servings:</p>
        <p className="mb-2 text-3xl">{recipe.servings}</p>
        {/* <input type='number' className="mb-2 text-3xl max-w-14 text-center border-1 rounded" defaultValue={recipe.servings}></input> */}
      </div>
    </div> :
    <div className='flex flex-wrap justify-between gap-4 mx-5 lg:mx-10 my-8'>
      <div className='flex flex-col items-center'>
        <p className="mb-2 text-3xl">{recipe.calories} kCal</p>
        <p className="mb-2 text-lg">Calories</p>
      </div>
      <div className='flex flex-col items-center'>
        <p className="mb-2 text-3xl">{recipe.servings}</p>
        <p className="mb-2 text-lg">Servings</p>
      </div>
      <div className='flex flex-col items-center'>
        <p className="mb-2 text-3xl">{recipe.prepTime} min</p>
        <p className="mb-2 text-lg">Prep time</p>
      </div>
      <div className='flex flex-col items-center'>
        <p className="mb-2 text-3xl">{recipe.cookTime} min</p>
        <p className="mb-2 text-lg">Cook time</p>
      </div>
    </div>
  }

  return (
    <div className={isMobileOnly ? 'p-4 my-14 mb-16' : 'p-4 mt-14 ml-42 mb-16'}>
      {recipe ? (<>
        <PageHeader title={recipe.recipeName} />
        <div className="mx-auto shadow-lg bg-white px-8 py-3">
          <div className="flex mb-4">
            <button
              className={`px-4 py-2 cursor-pointer ${activeTab === 'basic' ? 'text-rust border-b-2 border-rust font-bold' : 'text-black'}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic
            </button>
            <button
              className={`px-4 py-2 cursor-pointer ${activeTab === 'ingredients' ? 'text-rust border-b-2 border-rust font-bold' : 'text-black'}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button
              className={`px-4 py-2 cursor-pointer ${activeTab === 'steps' ? 'text-rust border-b-2 border-rust font-bold' : 'text-black'}`}
              onClick={() => setActiveTab('steps')}
            >
              Steps
            </button>
          </div>
          {activeTab === 'ingredients' && (
            <>
              <ul className="list-disc list-inside mb-4 text-lg">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient._id}>
                    {ingredient.amount} {ingredient.measurement} {ingredient.name}
                  </li>
                ))}
              </ul>
            </>
          )}
          {activeTab === 'steps' && (
            <>
              {(recipe.steps.length === 1 && !recipe.steps[0].text) ? 
                <div className="text-gray-500">No steps</div> :
                recipe.steps.map((step, index) => (
                  <div key={`step-${index}`}>
                    <button
                      type="button"
                      className={`rounded-full bg-gray-400 text-white w-7 h-7 cursor-pointer mt-2 ${stepChecked(step) ? 'bg-gray-400' : 'bg-rust'}`}
                      onClick={() => toggleStep(step)}
                    > <span>{`${step.number}`}</span>
                    </button> 
                    <span 
                      className={`text-lg mt-2 ml-1 ${stepChecked(step) && 'line-through '}`}>
                      {`${step.text}`}
                    </span>
                </div>
                ))
              }
            </>
          )}
          {activeTab === 'basic' && (
            <>
              {returnStats()}
              <p className="mb-2 mt-4 text-lg">Author: {recipe.author}</p>
              <p className="text-lg">Submitted by: {recipe.userName}</p>
              <div className="flex items-baseline flex-wrap gap-2">
                {recipe.tags && recipe.tags.length &&<h2 className="text-lg mt-4 mb-2">Tags:</h2>}
                {recipe.tags && recipe.tags.map((tag) => (
                  <Tag editable={false} selected={true} tag={tag} />
                ))}
              </div>
              {(user === recipe.userName) &&
                <div className='flex gap-1 justify-between mb-2 mt-4'>
                  <Button buttonType='secondary' className='flex-grow flex justify-center items-center gap-1' onClick={handleDelete}><FiDelete />Delete</Button>
                  <Link 
                    className={`flex-grow px-4 py-2 rounded-lg border-2 hover:border-rust hover:text-white hover:bg-rust border-sandy text-sandy cursor-pointer flex items-center justify-center gap-1`}
                    to={`/editRecipe/${recipe._id}`}>
                    <FiEdit />Edit
                  </Link>
                </div>}
            </>
          )}
        </div>
        </>) : (
        <Spinner />
      )}
    </div>
  );
};