import { Card, CardHeader, CardBody, Image } from "@heroui/react";

const EmployeeCard = ({ imgSource, broker, phone, email, npn }) => {
  const phoneHref = `tel:+1${phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <Card className="broker-card pt-4 pb-3 px-3 flex items-center">
        <Image
          alt={broker}
          className="broker-photo object-cover"
          src={imgSource}
        />
        <CardHeader className="pb-0 pt-3 px-2 flex-col items-center gap-1">
          <p className="broker-name">{broker}</p>
          <a href={phoneHref} className="broker-phone">
            {phone}
          </a>
          <p className="broker-email">{email}</p>
        </CardHeader>
        <small className="broker-npn mt-2">NPN {npn}</small>
        <CardBody className="overflow-visible py-0"></CardBody>
      </Card>
    </>
  );
};

export default EmployeeCard;
