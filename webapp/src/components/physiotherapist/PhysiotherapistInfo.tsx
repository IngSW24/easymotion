export interface PhysiotherapistInfoProps {
  physiotherapist: string;
}

export default function PhysiotherapistInfo(props: PhysiotherapistInfoProps) {
  return <div>{props.physiotherapist}</div>;
}
