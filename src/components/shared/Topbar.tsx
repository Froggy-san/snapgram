import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
  const navigate = useNavigate();

  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [navigate, isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4  px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="image"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link className="flex-center gap-3" to={`/profile/${user.id}`}>
            <img
              src={user.imageUrl || "/assets/images/default/avatar.png"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
