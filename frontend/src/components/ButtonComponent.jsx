import {
  Button,
} from "@heroui/react";


const ButtonComponent = ({ text, onPress, ...props }) => {
  return (
    <>
      <Button color="primary" variant="ghost" onPress={onPress} {...props}>
        {text}
      </Button>
    </>
  )
};

export default ButtonComponent;