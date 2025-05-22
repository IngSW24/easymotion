import { PatientProfileDto } from "../dto/patient/patient-profile.dto";
import { PhysiotherapistProfileDto } from "../dto/physiotherapist/physiotherapist-profile.dto";

export type FindProfilesArgsMap<T extends "physiotherapist" | "patient"> =
  T extends "physiotherapist"
    ? {
        type: T;
        searchText: string;
        dto: new () => PhysiotherapistProfileDto;
      }
    : {
        type: T;
        searchText: string;
        dto: new () => PatientProfileDto;
      };

export type FindProfileArgs<T extends "physiotherapist" | "patient"> =
  T extends "physiotherapist"
    ? {
        type: T;
        dto: new () => PhysiotherapistProfileDto;
      }
    : {
        type: T;
        dto: new () => PatientProfileDto;
      };
