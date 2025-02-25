import { useCallback, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Recipe } from '../types/Recipe';
import { debounce } from 'lodash';
import { useObserveElementWidth } from '../hooks/useObserveElementWidth';
import { FiSearch } from 'react-icons/fi';
import { PAGE_SIZE } from '../hooks/utility';
import { useGetRecipes } from '../hooks/useGetRecipes';
import { RecipeCard } from './RecipeCard';
import { Spinner } from '../shared/Spinner';

export const RecipeGrid = () => {
  const [recipeName, setRecipeName] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [pageCount, setPageCount] = useState<number>(0)
  const { width, ref } = useObserveElementWidth<HTMLDivElement>()
  const [totalRecipes, setTotalRecipes] = useState<number>(PAGE_SIZE + 1)//start by assuming there is 2 pages worth
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { data, error, isLoading } = useGetRecipes(pageCount, recipeName)

  useEffect(() => {
    if (data && data.recipes) {
      //blow away the whole current save recipes if we are refetching
      const newRecipes = pageCount > 0 ? [...recipes, ...data.recipes] : data.recipes;
      const uniqueRecipes = Array.from(new Set(newRecipes.map(recipe => recipe._id)))
        .map(id => newRecipes.find(recipe => recipe._id === id))
        .filter(recipe => recipe !== undefined);
      setRecipes(uniqueRecipes)
      setTotalRecipes(data.numberOfRecipes);
    } else if (data && data.pageSize) {
      //blow away the whole current save recipes if we have no recipes
      setTotalRecipes(0);
      setRecipes([])
    }
  }, [data]);

  const handleScroll = useCallback(
    debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      if (recipes.length < totalRecipes) {
        setRecipeName(searchTerm)
        setPageCount(prevPageCount => prevPageCount + 1);
      }
    }, 500),
    [recipes, totalRecipes]
  );

  const kickOffSearch = () => {
    setRecipeName(searchTerm)
    setPageCount(0)
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [recipes, totalRecipes]);

  return (
    <div className={`mt-16 mb-16 p-4 ${!isMobileOnly && 'ml-42'}`}>
      <div 
        style={{width}}
        className={`fixed z-10 flex gap-1`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          onKeyDown={(e) => {if(e.key === 'Enter') {kickOffSearch()}}}
          placeholder="Search recipes..."
          className="w-full p-2 rounded-full bg-white border border-sandy shadow-md"
        />
        <button 
          onClick={()=>kickOffSearch()}
          className='flex justify-center items-center rounded-full w-10 h-10 cursor-pointer bg-rust text-white hover:bg-sandy align-center'>
            <FiSearch />
        </button>
      </div>
      <div ref={ref} className={`mt-16 mb-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4`}>
        {recipes.length ?
          recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
          )) :  
          <div className="text-gray-500">No recipes found</div>
        }
      </div>
      {isLoading && <Spinner/>}
      {error && <div className="text-red-500">Error loading recipes</div>}
      <div className="h-10"></div>
    </div>
  );
}