//authentication service using amplify cognito
import { signIn, signUp, signOut, confirmSignUp, getCurrentUser } from 'aws-amplify/auth'

export const AuthService = {
  register: (email, password) =>
    signUp({ username: email, password, options: { userAttributes: { email } } }),

  confirm: (email, code) =>
    confirmSignUp({ username: email, confirmationCode: code }),

  login: (email, password) =>
    signIn({ username: email, password }),

  logout: () => signOut(),

  getUser: () => getCurrentUser()
}
