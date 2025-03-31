export interface UserPersona {
  email: string;
  name?: string;
  [key: string]: string | undefined; // Allow additional attributes
}

export const parseUserPersona = (user: { attributes: Record<string, string> }): UserPersona => {
  return {
    email: user.attributes.email,
    name: user.attributes.name || "Unknown",
    ...user.attributes, // Include other attributes if needed
  };
};
