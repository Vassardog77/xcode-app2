import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if(!context) {
    console.error('useAuthContext must be used inside an AuthContextProvider')
    return null; // Or return a default context value if suitable
  }

  return context
}
