import {Household} from "../types/household";

export interface EditHouseholdState {
    name: string;
    members?: string[];
    inviteMember?: string;
}

export const defaultHousehold : Household = {
    name: "Your Household"
};

export const defaultHouseholdState : EditHouseholdState = {
    ...defaultHousehold
};

export default EditHouseholdState;