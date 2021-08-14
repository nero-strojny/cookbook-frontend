import React, {useState} from "react";
import { Input, Icon } from "semantic-ui-react";
import { defaultTags } from "../edit/Tags";
import { searchRecipe } from "../serviceCalls";

function SearchSection({
  token,
  setAccessToken,
  setErrorState,
  setRecipes,
  setNumberOfRecipes,
  setIsLoading,
  setDisablePagination,
  setShouldRefresh,
}) {
  
  const [searchField, setSearchField] = useState("");

  async function submitSearch() {
    setIsLoading(true);

    if (searchField !== ""){
      const queryParameters = defaultTags.includes(searchField) ?
        {tags: [searchField]} :
        {recipeName: searchField};
      const response = await searchRecipe(queryParameters, token);
      if (response.status !== 200) {
        if (response.status === 401 || response.status === 403) {
          setAccessToken("");
        } else {
          setErrorState("Error Retrieving Recipes");
          setRecipes([]);
          setNumberOfRecipes(1);
        }
      } else if (!response.data.length) {
        setErrorState("No Matching Recipes Found");
        setNumberOfRecipes(1);
        setRecipes(response.data);
      } else {
        setErrorState("");
        setRecipes(response.data);
      }
      setNumberOfRecipes(1)
      setIsLoading(false);
      setDisablePagination(true);
    } else {
      setShouldRefresh(true);
    }
  }

  async function onInputChange(event) {
    if (event.key === 'Enter') {
      await submitSearch();
    }
  }



  return (
    <Input
      fluid
      placeholder="Search Recipe By Name or By Tag..."
      icon={<Icon name="search" color='orange' inverted circular link onClick={() => submitSearch()} />}
      onChange={(event) => setSearchField(event.target.value)}
      onKeyPress={async (event) => await onInputChange(event)}
    />
  );
}

export default SearchSection;