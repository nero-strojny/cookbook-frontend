import { ReactNode } from "react";
import { isMobileOnly } from "react-device-detect";
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom";

export const PageHeader = ({title, children}:{title:string, children?: ReactNode}) => {
  const navigate = useNavigate();
  const headerClass = isMobileOnly ? 'text-2xl m-3' : 'text-4xl m-6';
  return (
    <div className="flex items-center">
      <button type="button" className="bg-seasalt text-rust rounded-full px-2 py-1 w-12 h-12 border-2 cursor-pointer hover:text-sandy" onClick={() => navigate(-1)}>
        <FiArrowLeft size={32} />
      </button>
      <h2 className={headerClass}>{title}</h2>
      {children}
    </div>
  )
}