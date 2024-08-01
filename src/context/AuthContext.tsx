import { IContextType, IUser } from "@/Types";
import { getCurrentUser } from "@/lib/appwrite/api";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

/*export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}; */

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean, // check this line of code in the video again .
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  /// here if you are confused why he used state, the reason is that he didn't use reducer , that is why the code looks a little weird .

  const [user, setUser] = useState<IUser>(INITIAL_USER);

  const [isLoading, setIsloading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser();

      if (currentAccount)
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });

      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (
      // || localStorage.getItem("cookieFallback") === null
      localStorage.getItem("cookieFallback") === "[]"
    )
      navigate("/sign-in");
    else checkAuthUser();
  }, []);

  // we used to pass the values right away into the provider , but he sperated them .
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
