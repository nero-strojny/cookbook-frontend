import EditHouseholdState, {defaultHouseholdState} from "./EditHouseholdState";
import {EditHouseholdAction} from "./EditHouseholdAction";

export const editHouseholdReducer = (state: EditHouseholdState, action: EditHouseholdAction): EditHouseholdState => {
    const {payload} = action;
    switch (action.type) {
        case "EDIT_NAME": {
            return {
                ...state,
                name: payload.householdName || defaultHouseholdState.name
            }
        }

        default:
            return state;
    }
}