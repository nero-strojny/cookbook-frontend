export const AddToCartButton = ({added, onClick, altAddText, altRemoveText}:{added:boolean, onClick: ()=>void, altAddText?: string, altRemoveText?:string}) => {
  return (
    <>
      {added ? 
        (<button className="bg-rust text-white p-1 mt-3 w-full rounded-md cursor-pointer" onClick={() => onClick()}>
          {altRemoveText || 'Remove from cart'}
          </button>) :
        (<button className="bg-sandy text-white p-1 mt-3 w-full rounded-md cursor-pointer" onClick={() => onClick()}>
          {altAddText || 'Add to cart'}
        </button>) 
      }
    </>
  );
}