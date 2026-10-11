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
import { menuItems, mprcDisplay } from "../data/constants/headerConstants";

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useDispatch();

  // The brand block doubles as the way home, which is what visitors expect of
  // a site's logo. Closing the menu matters on mobile, where the brand stays
  // visible above the open sheet.
  const brand = (
    <RouterLink
      to="/"
      className="nav-brand"
      aria-label="JMCole Group, home"
      onClick={() => setIsMenuOpen(false)}
    >
      <img src="/jmcole-logo-only.webp" alt="" className="nav-brand-logo" />
      <span className="nav-brand-text">
        <span className="nav-brand-name">JMCole&nbsp;Group</span>
        {/* Both lengths are rendered; CSS shows the one that fits. */}
        <span className="nav-brand-tagline nav-brand-tagline-full">
          {mprcDisplay.full}
        </span>
        <span className="nav-brand-tagline nav-brand-tagline-abbrev">
          {mprcDisplay.abbrev}
        </span>
      </span>
    </RouterLink>
  );

  return (
    <Navbar
      disableAnimation
      isBordered
      className="bg-brand"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile: left toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Mobile: centered brand */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>{brand}</NavbarBrand>
      </NavbarContent>

      {/* Desktop nav */}
      <NavbarContent
        className="hidden sm:flex gap-8 flex-1 justify-center items-center"
        justify="center"
      >
        <NavbarBrand>{brand}</NavbarBrand>

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
