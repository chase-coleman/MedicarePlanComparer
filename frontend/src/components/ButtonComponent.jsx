import {
  Button,
} from "@heroui/react";


const ButtonComponent = ({ text }) => {
  return (
    <>
      <Button color="primary" variant="ghost">
        {text}
      </Button>
    </>
  )
};

export default ButtonComponent;