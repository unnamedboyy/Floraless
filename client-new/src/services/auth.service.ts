import api from "@/lib/axios";

export const login = async (data: {
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  
  return res.data;
};
