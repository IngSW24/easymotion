import { useParams } from "react-router";
import PhysiotherapistInfo from "../components/physiotherapist/PhysiotherapistInfo";

export default function PhysiotherapistProfilePage() {
  const { id } = useParams();
  return (
    <div>
      <PhysiotherapistInfo physiotherapist={id ?? ""} />
    </div>
  );
}
