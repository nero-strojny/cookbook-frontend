
import { isMobileOnly } from "react-device-detect";
import { Tag } from "../shared/Tag";
import { FormDataType } from "./NewRecipe";

type BasicProps = {
  formData: FormDataType
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
}

export const BasicForm = (props:BasicProps) => {
  const {setFormData, formData} = props
  const allTags = ['breakfast', 'lunch', 'dinner', 'main dish', 'side dish', 'snack'];

  const handleChange = (e: React.FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prevData) => {
      const updatedTags = prevData.tags.includes(tag)
        ? prevData.tags.filter((t) => t !== tag)
        : [...prevData.tags, tag];
      return {
        ...prevData,
        tags: updatedTags,
      };
    });
  };

  const labelClass = isMobileOnly ? 'text-gray-700 p-1 text-sm whitespace-nowrap' : 'w-40 text-gray-700 p-1'
  const inputClass = isMobileOnly ?  'border border-gray-300 p-1 rounded-lg w-full' : 'border border-gray-300 p-1 rounded-lg'

  return (
    <div className="flex flex-col items-start space-y-4 text-end">
      <div className="flex items-center gap-2 w-full">
        <label htmlFor="recipeName" className={labelClass}>Name:</label>
        <input
          type="text"
          id="recipeName"
          name="recipeName"
          value={formData.recipeName}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div> 
      <div className="flex items-center gap-2 w-full">
        <label htmlFor="author" className={labelClass}>Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div> 
      <hr className='w-full text-rust opacity-50 my-4' />
      <div className="flex items-center gap-2 w-full">
        <label htmlFor="prepTime" className={labelClass}>Prep time (min):</label>
        <input
          type="number"
          id="prepTime"
          name="prepTime"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          value={formData.prepTime}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2 w-full">
        <label htmlFor="cookTime" className={labelClass}>Cook time (min):</label>
        <input
          type="number"
          id="cookTime"
          name="cookTime"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          value={formData.cookTime}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2 w-full">
        <label htmlFor="cookTime" className={labelClass}>Total time (min):</label>
        {Number(formData.cookTime) + Number(formData.prepTime)}
      </div>
      <hr className='w-full text-rust opacity-50 my-4' />
      <div className="flex items-center gap-2 w-full">
        <label htmlFor="servings" className={labelClass}>Servings:</label>
        <input
          type="number"
          id="servings"
          name="servings"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          value={formData.servings}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2 w-full">
        <label htmlFor="calories" className={labelClass}>
          Calories per serving:
        </label>
        <input
          type="number"
          id="calories"
          name="calories"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          value={formData.calories}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <hr className='w-full text-rust opacity-50 my-4' />
      <div className="flex flex-wrap items-center gap-2 w-full">
        <label className="block text-gray-700">Tags:</label>
        {allTags.map((tag) => (
          <Tag
            key={tag}
            editable={true} 
            selected={formData.tags.includes(tag)}
            tag={tag}
            handleTagToggle={handleTagToggle}
          />
        ))}
      </div>
    </div>
  );
};