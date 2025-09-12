import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
} from "@heroui/react";
import ButtonComponent from "./ButtonComponent";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../features/modal/ShowContactFormSlice";

const NavbarComponent = () => {
  const menuItems = [
    { label: "Explore plan options", to: "/explore" },
    { label: "Home", to: "/" },
    { label: "Compare Plans", to: "/compare" },
  ];
  const dispatch = useDispatch();

  return (
    <Navbar
      disableAnimation
      isBordered
      className="bg-main border-b-2 !border-black"
    >
      <NavbarContent className="sm:hidden text-black" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3 text-black" justify="center">
        <NavbarBrand>
          <span>MPRC</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-10 flex-1 justify-center"
        justify="center"
      >
        <NavbarBrand></NavbarBrand>
        <NavbarItem>
          <NavLink
            color="foreground"
            as={RouterLink}
            to="/explore"
            className={({ isActive }) =>
              isActive ? `text-red-500` : `text-black`
            }
          >
            Explore <br /> Plan Options
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            aria-current="page"
            as={RouterLink}
            to={"/"}
            className={({ isActive }) =>
              isActive ? `text-red-500` : `text-black`
            }
          >
            Home
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            color="foreground"
            as={RouterLink}
            to={"/compare"}
            className={({ isActive }) =>
              isActive ? `text-red-500` : `text-black`
            }
          >
            Compare <br /> Plans
          </NavLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="max-w-[35%]">
        <NavbarItem>
          <ButtonComponent
            text="Request a call!"
            onPress={() => dispatch(openModal())}
          />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.to}>
            <NavLink
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block w-full py-2 text-red-500"
                  : "block w-full py-2 text-black"
              }
            >
              {item.label}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarComponent;
