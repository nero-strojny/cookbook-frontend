import React, { useState, useContext } from "react";
import { Input, Icon } from "semantic-ui-react";
import { defaultTags } from "../edit/Tags";
import { ServerRequestContext } from "../context/ServerRequestContext"

type SearchSectionProps = {
  setIsLoading: Function,
  setCurrentPage: Function
}

const SearchSection = ({ setIsLoading, setCurrentPage}: SearchSectionProps): JSX.Element => {
  
  const [searchField, setSearchField] = useState<string>("");
  const { dispatch: serverDispatch } = useContext(ServerRequestContext);

  const submitSearch = async () => {
    setIsLoading(true);

    if (searchField !== ""){
      const queryParameters = defaultTags.includes(searchField) ?
        {tags: [searchField]} :
        {recipeName: searchField};
      setCurrentPage(1);
      serverDispatch({ type: 'QUERY_RECIPES_PENDING', payload: { paginatedRequest: { pageSize: 6, pageCount: 0, queryRecipe: queryParameters } } });
    } else {
      setCurrentPage(1);
      serverDispatch({ type: 'QUERY_RECIPES_PENDING', payload: { paginatedRequest: { pageSize: 6, pageCount: 0 } } });
    }
    setIsLoading(false);
  }

  const onInputChange = async (event: React.KeyboardEvent<Input>) => {
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
      onKeyPress={async (event: React.KeyboardEvent<Input>) => await onInputChange(event)}
    />
  );
}

export default SearchSection;