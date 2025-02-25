import { ReactNode } from "react"

type ButtonProps = {
  onClick: Function
  buttonType?: string
  disabled?: boolean
  children?: ReactNode
  key?: string
  className?: string
}

export const Button = (props: ButtonProps) => {
  const { onClick, disabled, children, key, className, buttonType } = props
  return (<>
    {buttonType === 'secondary' ?
        <button
        role="button"
        key={key}
        onClick={()=>onClick()}
        className={`${className} px-4 py-2 rounded-lg border-2 ${disabled ? 'cursor-not-allowed border-gray-500 bg-white': 'hover:border-rust hover:text-white hover:bg-rust border-sandy text-sandy cursor-pointer'}`}
      >
      {children}
    </button> :
    <button
        role="button"
        key={key}
        onClick={()=>onClick()}
        className={`${className} px-4 py-2 text-white rounded-lg ${disabled ? 'cursor-not-allowed bg-gray-500': 'hover:bg-rust bg-sandy cursor-pointer'}`}
      >
      {children}
    </button>
  }
  </>)
}