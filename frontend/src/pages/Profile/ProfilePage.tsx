import { useEffect } from "react";
import { useAuth } from "../../store"
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {

    const {tokens} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (tokens === null) {
          navigate("/");
        }
      }, [navigate, tokens]);

    return (
        <></>
    )
}

export default ProfilePage