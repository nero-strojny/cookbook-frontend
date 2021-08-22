import React, { useState, useContext } from "react";
import { Input, Icon } from "semantic-ui-react";
import { defaultTags } from "../edit/Tags";
import { ServerRequestContext } from "../ServerRequestContext"

function SearchSection({
  setIsLoading,
  setCurrentPage
}) {
  
  const [searchField, setSearchField] = useState("");
  const { dispatch: serverDispatch } = useContext(ServerRequestContext);

  async function submitSearch() {
    setIsLoading(true);

    if (searchField !== ""){
      const queryParameters = defaultTags.includes(searchField) ?
        {tags: [searchField]} :
        {recipeName: searchField};
      setCurrentPage(1);
      serverDispatch({ type: 'QUERY_RECIPES_PENDING', payload: { paginatedRequest: { pageSize: 5, pageCount: 0, queryRecipe: queryParameters } } });
    } else {
      setCurrentPage(1);
      serverDispatch({ type: 'QUERY_RECIPES_PENDING', payload: { paginatedRequest: { pageSize: 5, pageCount: 0 } } });
    }
    setIsLoading(false);
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