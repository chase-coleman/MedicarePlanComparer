import {
  Button,
} from "@heroui/react";

// onPress/props are forwarded so that the Redux state can be set 
const ButtonComponent = ({ text, onPress, children, styling,  ...props }) => {
  return (
    <>
      <Button className={styling} variant="light" onPress={onPress} {...props}>
        {children ?? text}
      </Button>
    </>
  )
};

export default ButtonComponent;