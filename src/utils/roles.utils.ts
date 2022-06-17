export function isAdmin(user: User) {
  return user.user_type_id === 1;
}
