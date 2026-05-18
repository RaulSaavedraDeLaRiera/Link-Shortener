//wraps amplify session to provide the current cognito id token
import { fetchAuthSession } from 'aws-amplify/auth'

export const authStore = {
  getToken: async () => {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.idToken?.toString() || null
    } catch {
      return null
    }
  }
}
