import { FormDataType } from "./NewRecipe"

type StepFormProps = {
  formData: FormDataType
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
}

export const StepForm = (props:StepFormProps) => {
  const {formData, setFormData} = props

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg text-gray-500 font-semibold mb-2">Enter steps:</h3>
        <textarea
          value={formData.steps}
          onChange={(e)=>setFormData({...formData, steps: e.target.value})}
          rows={12}
          className="w-full border border-gray-300 p-2 rounded-lg"
          placeholder={"(e.g. 1. Do something) Steps are assumed to be in the format of:\r\n\r\n1. Step 1 \r\n2. Step 2 \r\netc..."}
        />
      </div>
    </div>
  );
};

