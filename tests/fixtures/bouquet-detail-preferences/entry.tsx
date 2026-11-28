import { createRoot } from "react-dom/client";
import {
  BouquetDetailPreferences,
  type PreferencesProps,
} from "../../../src/components/widgets/BouquetDetail/BouquetDetailPreferences/BouquetDetailPreferences";

const props = JSON.parse(document.getElementById("data")!.textContent!) as PreferencesProps;
createRoot(document.getElementById("root")!).render(<BouquetDetailPreferences {...props} />);
