import { createContext, ReactNode, useContext, useState } from "react";

type Props = {
  children: ReactNode;
};

type Usuario = {
  id: string;
  nome: string;
  email: string;
  foto: string;
};

type AuthContextType = {
  user: Usuario | null;
  saveUser: (data: Usuario) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<Usuario | null>(null);

  function saveUser(data: Usuario) {
    setUser(data);
  }

  return (
    <AuthContext.Provider value={{ user, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa estar dentro do AuthProvider");
  }

  return context;
}
