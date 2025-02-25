import { FiPlus, FiX } from "react-icons/fi"

type TagProps = {
  editable: boolean
  selected: boolean
  tag: string
  handleTagToggle?: Function
}

export const Tag = (props: TagProps) => {
  const { tag, handleTagToggle, editable, selected } = props
  return (
    <button 
      onClick={()=>{(editable && handleTagToggle) && handleTagToggle(tag)}}
      type='button'
      className={`flex gap-1 justify-center items-center bg-rust text-white px-2 py-1 rounded-full ${selected ? 'bg-rust' : 'bg-sandy'} ${editable && 'cursor-pointer'}`}>
        {tag}
      {editable && ((selected) ? <FiX/> : <FiPlus />) }
    </button>
  )
}