import { describe, it, expect } from "vitest";
import { renderUI, screen } from "../../test/utils";
import EmployeeCard from "../EmployeeCard";
import { BROKERS } from "../../data/brokers";

const broker = {
  imgSource: "/john-main.jpg",
  broker: "John Coleman",
  phone: "541-554-8382",
  email: "john@mprc.info",
  npn: "18136647",
};

const renderCard = (overrides = {}) =>
  renderUI(<EmployeeCard {...broker} {...overrides} />);

describe("EmployeeCard", () => {
  it("shows the broker's name, email and NPN", () => {
    renderCard();

    expect(screen.getByText("John Coleman")).toBeInTheDocument();
    expect(screen.getByText("john@mprc.info")).toBeInTheDocument();
    expect(screen.getByText("NPN 18136647")).toBeInTheDocument();
  });

  it("renders the photo with the broker's name as alt text", () => {
    renderCard();

    const photo = screen.getByAltText("John Coleman");
    expect(photo).toHaveAttribute("src", "/john-main.jpg");
  });

  it("turns the phone number into a dialable tel: link", () => {
    renderCard();

    const link = screen.getByRole("link", { name: "541-554-8382" });
    expect(link).toHaveAttribute("href", "tel:+15415548382");
  });

  it("strips punctuation of any formatting style out of the tel: href", () => {
    renderCard({ phone: "(541) 554-8382" });

    expect(screen.getByRole("link", { name: "(541) 554-8382" })).toHaveAttribute(
      "href",
      "tel:+15415548382",
    );
  });

  it("renders an empty NPN as a bare label, which is how a pending NPN shows", () => {
    renderCard({ npn: "" });

    expect(screen.getByText("NPN")).toBeInTheDocument();
  });

  it.each(BROKERS.map((entry) => [entry.broker, entry]))(
    "renders the real record for %s",
    (name, entry) => {
      renderUI(<EmployeeCard {...entry} />);

      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByAltText(name)).toHaveAttribute("src", entry.imgSource);
      expect(
        screen.getByRole("link", { name: entry.phone }),
      ).toHaveAttribute("href", `tel:+1${entry.phone.replace(/\D/g, "")}`);
    },
  );
});
