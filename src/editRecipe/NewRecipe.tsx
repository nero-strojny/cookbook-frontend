import { useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Ingredient } from '../types/Recipe';
import { useObserveElementWidth } from '../hooks/useObserveElementWidth';
import { Button } from '../shared/Button';
import { PageHeader } from '../shared/PageHeader';
import { LoadingFormButton } from '../shared/LoadingFormButton';
import { StepForm } from './StepForm';
import { parseStep } from './utility';
import { IngredientForm } from './IngredientForm';
import { BasicForm} from './BasicForm';
import { RecipePayload, useCreateRecipe } from '../hooks/useCreateRecipe';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';

interface NewRecipeProps {
  overrideAPICall?: (payload:RecipePayload)=>Promise<void>
  defaultFormData?: FormDataType
}

export type FormDataType = {
  recipeName: string
  author: string
  prepTime: number
  cookTime: number
  calories: number
  servings: number
  tags: string[]
  ingredients: Ingredient[]
  steps: string
}

export const NewRecipe = (props:NewRecipeProps) => {
  const {showSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const { width, ref } = useObserveElementWidth<HTMLDivElement>()
  const createRecipeMutation = useCreateRecipe()
  const [formData, setFormData] = useState<FormDataType>(props.defaultFormData || {
    recipeName: '',
    author: '',
    prepTime: 0,
    cookTime: 0,
    calories: 0,
    servings: 0,
    tags: [],
    ingredients: [],
    steps: ""
  });

  const steps = [
    'Basic',
    'Ingredients',
    'Steps'
  ];

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const createRecipeFunction = async (payload:RecipePayload) => {
    const response = await createRecipeMutation.mutateAsync({recipe:payload})
    showSnackbar('Recipe created')
    navigate(`/recipe/${response._id}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!formData.recipeName) {
      setCurrentStep(1)
      showSnackbar('Name is required', 'error')
    } else if(!formData.author) {
      setCurrentStep(1)
      showSnackbar('Author is required', 'error')
    } else if(formData.ingredients.length === 0) {
      setCurrentStep(2)
      showSnackbar('At least 1 ingredient is required', 'error')
    } else {
      const payloadSteps = formData.steps.split('\n').map(stepString => parseStep(stepString))
      const payload: RecipePayload = {...formData,
        steps: payloadSteps || [],
        calories: Number(formData.calories),
        prepTime: Number(formData.prepTime),
        cookTime: Number(formData.cookTime),
        servings: Number(formData.servings)
      }
      if (!props.overrideAPICall) { 
        await createRecipeFunction(payload)
      } else { 
        await props.overrideAPICall(payload)
      }
    }
  }

  return (
    <div className={`p-4 ${isMobileOnly ? 'my-14' : 'ml-42 mt-10'}` }>
      <PageHeader title="New recipe" />
    <div className="p-6 bg-white rounded-lg shadow-md" ref={ref}>
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <button role="button" className='cursor-pointer' onClick={()=>setCurrentStep(index+1)}>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                index + 1 <= currentStep ? 'bg-rust text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </div>
            </button>
            <span className='text-sm font-bold'>{step}</span>
            {index === 0 && (
              <div style={{width: (width-48)}}
               className={`absolute top-3/8 transform -translate-y-1/2 left-full h-0.5 border-dashed border border-rust`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div>
        <form id='newRecipe' onSubmit={handleSubmit}>
          {currentStep === 1 &&(<BasicForm formData={formData} setFormData={setFormData} />)}
          {currentStep === 2 &&(<IngredientForm formData={formData} setFormData={setFormData} />)}
          {currentStep === 3 &&(<StepForm formData={formData} setFormData={setFormData} />)}
        </form>
        
        <div className="flex justify-between mt-6">
          <Button onClick={handlePrev} disabled={currentStep === 1}>Prev</Button>
          {currentStep !== steps.length ?
            <Button onClick={handleNext} disabled={false}>Next</Button> :
            <div className='ml-auto'>
              <LoadingFormButton form={'newRecipe'} text={'Submit'} isLoading={false} />     
            </div>    
          }
        </div>
      </div>
    </div>
    </div>
  );
};
