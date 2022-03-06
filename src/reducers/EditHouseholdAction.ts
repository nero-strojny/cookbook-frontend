export type EditHouseholdAction = {
  type: string,
  payload: {
    householdName?: string,
    householdMember?: string
    memberInvite?: string
  }
}