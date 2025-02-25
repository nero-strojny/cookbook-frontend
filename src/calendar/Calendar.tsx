import { useState } from "react";
import { getDaysOfWeek, getLongDayOfWeek} from "./utility";
import { calendarToRecipeMap } from "../types/Calendar";
import { useCart  } from "../context/CartContext";
import { AddToCartButton } from "../shared/AddToCartButton";
import { capitalize } from "lodash";
import { isMobileOnly } from "react-device-detect";
import { Recipe } from "../types/Recipe";
import { DesktopDatePicker } from "./DesktopDatePicker";
import { MobileDatePicker } from "./MobileDatePicker";
import { GrPowerCycle } from "react-icons/gr";
import { CalendarPayload, usePutCalendar } from "../hooks/usePutCalendar";
import { useGetCalendar } from "../hooks/useGetCalendar";
import { useGetRandomRecipe } from "../hooks/useGetRandomRecipe";
import { Button } from "../shared/Button";
import { PageHeader } from "../shared/PageHeader";
import { RecipeCard } from "../recipes/RecipeCard";
import { SearchableDropdown } from "./SearchableDropdown";
import { RiProhibited2Line } from "react-icons/ri";

export const Calendar = () => {
  const { cart, addAllToCart, removeAllFromCart } = useCart()

  //Set up date variables:
  const currentDate = new Date();
  const startOfWeek = currentDate.getDate() - currentDate.getDay()
  const daysOfWeek = getDaysOfWeek(currentDate, startOfWeek)

  //Query data
  const { data, refetch, isFetching } = useGetCalendar(daysOfWeek[0].fullDate)
  const randomRecipeMutation = useGetRandomRecipe( 1)
  const recipeMap = calendarToRecipeMap(data)
  const calendarMutation = usePutCalendar()

  //Component states + derived values
  const [added, setAdded] = useState<boolean>(cart.some(recipe => Object.values(recipeMap).map(calRecipe => calRecipe._id).includes(recipe._id)));
  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(daysOfWeek[0].fullDate);
  const longDayOfWeek: string = getLongDayOfWeek(selectedDate, daysOfWeek)
  const selectedRecipe = recipeMap[longDayOfWeek] || null;

  const handleAddAllToCart = () => {
    if (!added) {
      addAllToCart(Object.values(recipeMap))
      setAdded(true)
    } else {
      removeAllFromCart(Object.values(recipeMap).map(recipe => recipe._id))
      setAdded(false)
    }
  }

  const handleSetRecipe = async (newRecipe: Recipe | null) => {
    if (data?._id) {
      const payload: CalendarPayload = {...recipeMap, _id: data._id, startDate: data.startDate}
      if (!newRecipe) {
        delete payload[longDayOfWeek]
      } else {
        payload[longDayOfWeek] = newRecipe
      }
      await calendarMutation.mutateAsync({calendar:payload})
      refetch()
    }
  }

  const handleSetSelectedDate = (fullDate:string) => {
    setSelectedDate(fullDate)
    setQuery('')
  }

  const handleRandomizeRecipe = async () => {
    const randomRecipes = await randomRecipeMutation.mutateAsync()
    if (randomRecipes[0] && data?._id) {
      const payload: CalendarPayload = {...recipeMap, _id: data._id, startDate: data.startDate}
      payload[longDayOfWeek] = randomRecipes[0]
      await calendarMutation.mutateAsync({calendar:payload})
      refetch()
    }
  }

  return (
    <div className={`${isMobileOnly ?'p-4 mb-20 my-14': 'p-4 mt-10 ml-42'}` }>
      <PageHeader title="Calendar">
        {isMobileOnly && <div className="ml-auto w-24">
          <AddToCartButton added={added} onClick={()=>handleAddAllToCart()} altAddText="Add all" altRemoveText="Remove all" />
        </div>}
      </PageHeader>
      <div className={`container mx-auto mt-4 ${!isMobileOnly && 'flex'}`}>
        {isMobileOnly ?
          <MobileDatePicker selectedDate={selectedDate} daysOfWeek={daysOfWeek} handleSetSelectedDate={handleSetSelectedDate}/> :
          <DesktopDatePicker selectedDate={selectedDate} recipeMap={recipeMap} daysOfWeek={daysOfWeek} handleSetSelectedDate={handleSetSelectedDate}>
            <AddToCartButton added={added} onClick={()=>handleAddAllToCart()} altAddText='Add all to Cart' altRemoveText='Remove all from cart' />
          </DesktopDatePicker>
        }
        <div className={isMobileOnly ? 'w-full':`w-1/2 ml-8`}>
        {selectedRecipe ? (
          <>
            <RecipeCard recipe={selectedRecipe} isLoading={isFetching}>
              <div className='flex justify-between mb-4'>
                <div className="font-bold text-lg text-gray-500">{
                  capitalize(longDayOfWeek)}
                </div>
                <div className="flex gap-1">
                  <Button onClick={()=>handleSetRecipe(null)} className="ml-auto cursor-pointer">
                    <RiProhibited2Line />
                  </Button>
                  <Button onClick={()=>handleRandomizeRecipe()} className="ml-auto cursor-pointer">
                    <GrPowerCycle />
                  </Button>
                </div>
              </div>
              <SearchableDropdown handleSetRecipe={handleSetRecipe} query={query} setQuery={setQuery} />
            </RecipeCard>
          </>
        ) : (
          <div className="text-center text-gray-500">Select a date to view the recipe</div>
        )}
      </div>
    </div>
    </div>
  );
};

