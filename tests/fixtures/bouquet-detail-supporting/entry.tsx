import { createRoot } from "react-dom/client";
import {
  BouquetDetailInformation,
  BouquetDetailRelated,
  BouquetDetailCustom,
} from "../../../src/components/widgets/BouquetDetail/BouquetDetailSupporting/BouquetDetailSupporting";

const data = JSON.parse(document.getElementById("data")!.textContent!);
const disabled = (label: string, reason: string) => (
  <div>
    <button type="button" disabled>
      {label} →
    </button>
    <p className="reason">{reason}</p>
  </div>
);
createRoot(document.getElementById("root")!).render(
  <>
    <div className="info">
      <BouquetDetailInformation items={data.items} />
    </div>
    <BouquetDetailRelated
      eyebrow={data.eyebrow}
      heading={data.relatedHeading}
      cards={data.cards.map(
        (card: { id: string; title: string; image: { src: string; alt: string } }) => ({
          ...card,
          action: disabled(data.enquire, data.reason),
        }),
      )}
    />
    <BouquetDetailCustom
      eyebrow={data.customEyebrow}
      heading={data.customHeading}
      description={data.description}
      signature={data.signature}
      image={data.customImage}
      action={disabled(data.customAction, data.reason)}
    />
  </>,
);
