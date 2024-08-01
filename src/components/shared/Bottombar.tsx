import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Link
            to={link.route}
            className={`flex-center flex-col  rounded-[10px]  gap-1 p-2 transition  ${
              isActive && "bg-primary-500"
            }`}
            key={link.label}
          >
            <img
              src={link.imgURL}
              alt="link img"
              width={16}
              height={16}
              className={` ${isActive && "invert-white"}`}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
