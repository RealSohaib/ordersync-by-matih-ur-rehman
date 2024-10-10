import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CookieValidation = ({ cookiesfor }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  useEffect(() => {
    const validate = async () => {
      if (!cookies.get(cookiesfor)) {
        navigate("/login");
      }
    };
    validate();
  }, [cookiesfor, navigate, cookies]);

  return null;
};

export default CookieValidation;