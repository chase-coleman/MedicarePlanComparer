import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import ButtonComponent from "./ButtonComponent";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal/ShowContactFormSlice";

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useDispatch();

  const menuItems = [
    { label: "Explore plan options", to: "/explore" },
    { label: "Home", to: "/" },
    { label: "Compare Plans", to: "/compare" },
    { label: "Find A Meeting", to: "/find-meeting" },
  ];

  return (
    <Navbar
      disableAnimation
      isBordered
      className="bg-brand"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile: left toggle */}
      <NavbarContent className="sm:hidden text-white" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Mobile: centered brand */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <span className="nav-brand">MPRC</span>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop nav */}
      <NavbarContent
        className="hidden sm:flex gap-8 flex-1 justify-center items-center"
        justify="center"
      >
        <NavbarBrand>
          <span className="nav-brand">MPRC</span>
        </NavbarBrand>

        <NavbarItem>
          <NavLink
            color="foreground"
            as={RouterLink}
            to="/find-meeting"
            className={({ isActive }) =>
              isActive ? `nav-link nav-link-active` : `nav-link`
            }
          >
            Find A Meeting
          </NavLink>
        </NavbarItem>

        <NavbarItem>
          <NavLink
            color="foreground"
            as={RouterLink}
            to="/explore"
            className={({ isActive }) =>
              isActive ? `nav-link nav-link-active` : `nav-link`
            }
          >
            Explore Plan Options
          </NavLink>
        </NavbarItem>

        <NavbarItem>
          <NavLink
            aria-current="page"
            as={RouterLink}
            to="/"
            className={({ isActive }) =>
              isActive ? `nav-link nav-link-active` : `nav-link`
            }
          >
            Home
          </NavLink>
        </NavbarItem>

        <NavbarItem>
          <NavLink
            color="foreground"
            as={RouterLink}
            to="/compare"
            className={({ isActive }) =>
              isActive ? `nav-link nav-link-active` : `nav-link`
            }
          >
            Compare Plans
          </NavLink>
        </NavbarItem>
      </NavbarContent>

      {/* Right-side actions */}
      <NavbarContent justify="end" className="max-w-[35%]">
        <NavbarItem>
          <ButtonComponent
            styling="bg-accent"
            text="Request a call"
            onPress={() => dispatch(openModal())}
          />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="nav-menu-sheet">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.to}>
            <NavLink
              as={RouterLink}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "nav-link-mobile nav-link-mobile-active"
                  : "nav-link-mobile"
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
