export const ROLES = {
  RESIDENT: "resident",
  BUSINESS_OWNER: "business_owner",
  COMMUNITY_ORGANIZER: "community_organizer",
};

export function getRoleName(role) {
  switch (role) {
    case ROLES.RESIDENT:
      return "Resident";
    case ROLES.BUSINESS_OWNER:
      return "Business Owner";
    case ROLES.COMMUNITY_ORGANIZER:
      return "Community Organizer";
    default:
      return "User";
  }
}

export function canManageBusiness(user) {
  return user && user.role === ROLES.BUSINESS_OWNER;
}

export function canManageEvents(user) {
  return user && user.role === ROLES.COMMUNITY_ORGANIZER;
}

export function canCreatePost(user) {
  return !!user;
}

export function canCreateEmergencyAlert(user) {
  return !!user;
}

export function canCreateHelpRequest(user) {
  return !!user;
}

export function canVolunteerForHelp(user, helpRequest) {
  if (!user) return false;

  const isVolunteer = helpRequest.matchedVolunteers?.some(
    (v) => v.id === user.id
  );

  const isOpen = helpRequest.status === "OPEN";

  const isNotRequester = user.id !== helpRequest.requester?.id;

  return isNotRequester && isOpen && !isVolunteer;
}

export function canVolunteerForEvent(user, event) {
  if (!user) return false;

  const isVolunteer = event.volunteers?.some((v) => v.id === user.id);

  const isInFuture = new Date(event.date) > new Date();

  const isNotOrganizer = user.id !== event.organizer?.id;

  return isNotOrganizer && isInFuture && !isVolunteer;
}
