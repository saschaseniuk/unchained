export default [/* GraphQL */`
"""
Type returned when the user logs in
"""
type LoginMethodResponse {
  """
  Id of the user logged in user
  """
  id: String!

  """
  Token of the connection
  """
  token: String!

  """
  Expiration date for the token
  """
  tokenExpires: Float!

  """
  The logged in user
  """
  user: User
}

type UserProfile {
  displayName: String
  phoneMobile: String
  gender: String
  birthday: Date
  address: Address
}

type UserEmail {
  address: String!
  verified: Boolean!
}

type User {
  _id: ID!
  email: String
  username: String
  isEmailVerified: Boolean!
  isGuest: Boolean!
  name: String!
  avatar: Media
  profile: UserProfile
  language: Language
  country: Country
  lastBillingAddress: Address
  lastDeliveryAddress: Address
  emails: [UserEmail!]
  roles: [String!]
  tags: [String!]
  cart: Order
  orders(includeDrafts: Boolean = false): [Order!]!
  logs(offset: Int, limit: Int): [Log!]!
}
`];