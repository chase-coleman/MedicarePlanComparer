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

const NavbarComponent = () => {
  const menuItems = [
    "Explore plan options",
    "Home",
    "Compare Plans",
  ];

  return (
    <Navbar disableAnimation isBordered className="bg-main border-b-2 !border-black">
      <NavbarContent className="sm:hidden text-black" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3 text-black" justify="center">
        <NavbarBrand>
          <span>MPRC</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-10 flex-1 justify-center" justify="center">
        <NavbarBrand>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" to="/explore" className="text-black">
            Explore <br /> Plan Options
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#" className="text-black">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#" className="text-black">
            Compare <br /> Plans
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="max-w-[35%]">
        <NavbarItem>
        <ButtonComponent text="Request a call!"/>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarComponent;
