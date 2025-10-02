import { Card, CardHeader, CardBody, Image } from "@heroui/react";

const EmployeeCard = ({ imgSource, broker, phone, email, npn }) => {
  const phoneHref = `tel:+1${phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <Card className="bg-main py-1 px-1 w-42 flex items-center">
        <Image
          alt="Card background"
          className="object-cover rounded-xl w-24"
          src={imgSource}
        />
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center gap-1">
          <p className="text-small text-[#FFFFFF] uppercase font-bold">
            {broker}
          </p>
          <a
            href={phoneHref}
            className="text-tiny text-blue-500 underline uppercase font-bold"
          >
            {phone}
          </a>
          <p className="text-tiny text-[#FFFFFF] uppercase font-bold">
            {email}
          </p>
        </CardHeader>
        <small className="text-[#FFFFFF] mb-0">NPN: {npn}</small>
        <CardBody className="overflow-visible py-2"></CardBody>
      </Card>
    </>
  );
};

export default EmployeeCard;
