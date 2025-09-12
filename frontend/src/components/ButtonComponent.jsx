import {
  Button,
} from "@heroui/react";

// onPress/props are forwarded so that the Redux state can be set 
const ButtonComponent = ({ text, onPress, children,  ...props }) => {
  return (
    <>
      <Button color="primary" variant="ghost" onPress={onPress} {...props}>
        {children ?? text}
      </Button>
    </>
  )
};

export default ButtonComponent;