import {Card, CardHeader, CardBody, Image} from "@heroui/react";

const EmployeeCard = ({ imgSource, broker, phone, email, npn }) => {
  return (
    <>
        <Card className="py-1 px-1 w-42 flex items-center">
        <Image
          alt="Card background"
          className="object-cover rounded-xl w-24"
          src={imgSource}
        />
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center gap-1">
        <p className="text-small uppercase font-bold">{broker}</p>
        <p className="text-tiny uppercase font-bold">{phone}</p>
        <p className="text-tiny uppercase font-bold">{email}</p>
      </CardHeader>
        <small className="text-default-500 mb-0">NPN: {npn}</small>
      <CardBody className="overflow-visible py-2">
      </CardBody>
    </Card>
    </>
  )
};

export default EmployeeCard;