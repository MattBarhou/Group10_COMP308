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
  // All authenticated users can create posts
  return !!user;
}

export function canCreateEmergencyAlert(user) {
  // All authenticated users can create emergency alerts
  return !!user;
}

export function canCreateHelpRequest(user) {
  // All authenticated users can create help requests
  return !!user;
}

export function canVolunteerForHelp(user, helpRequest) {
  // Users can volunteer for help requests that they didn't create
  if (!user) return false;

  // Check if user is already a volunteer
  const isVolunteer = helpRequest.matchedVolunteers?.some(
    (v) => v.id === user.id
  );

  // Check if request is still open
  const isOpen = helpRequest.status === "OPEN";

  // Check if user is not the requester
  const isNotRequester = user.id !== helpRequest.requester?.id;

  return isNotRequester && isOpen && !isVolunteer;
}

export function canVolunteerForEvent(user, event) {
  // Users can volunteer for events they didn't create
  if (!user) return false;

  // Check if user is already a volunteer
  const isVolunteer = event.volunteers?.some((v) => v.id === user.id);

  // Check if event is in the future
  const isInFuture = new Date(event.date) > new Date();

  // Check if user is not the organizer
  const isNotOrganizer = user.id !== event.organizer?.id;

  return isNotOrganizer && isInFuture && !isVolunteer;
}
