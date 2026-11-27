import { createRoot } from "react-dom/client";
import {
  BouquetDetailGallery,
  type GalleryImage,
} from "../../../src/components/widgets/BouquetDetail/BouquetDetailGallery/BouquetDetailGallery";

const props = JSON.parse(document.getElementById("data")!.textContent!) as {
  images: [GalleryImage, ...GalleryImage[]];
  groupLabel: string;
};
createRoot(document.getElementById("root")!).render(<BouquetDetailGallery {...props} />);
