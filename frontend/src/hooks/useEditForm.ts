import { useState, useCallback } from 'react';
import type { Partnership, PartnershipUpdate } from '@/api/types';

export interface EditFormData {
  parkName: string;
  land: string;
  stadt: string;
  gruendungsjahr: string;
  bisherigeKooperation: string;
  datum: string;
  themen: string[];
  bemerkungen: string;
  parkAnsprechpartner: string;
  kontaktdetails: string;
  webpraesenz: string;
  universitaetName: string;
  standort: string;
  forschungsschwerpunkte: string[];
  uniAnsprechpartner: string;
  website: string;
}

function partnershipToFormData(p: Partnership): EditFormData {
  return {
    parkName: p.parkName,
    land: p.land,
    stadt: p.stadt,
    gruendungsjahr: p.gruendungsjahr?.toString() ?? '',
    bisherigeKooperation: p.bisherigeKooperation ?? 'Keine',
    datum: p.datum ?? '',
    themen: [...p.themen],
    bemerkungen: p.bemerkungen ?? '',
    parkAnsprechpartner: p.parkAnsprechpartner ?? '',
    kontaktdetails: p.kontaktdetails ?? '',
    webpraesenz: p.webpraesenz ?? '',
    universitaetName: p.universitaetName,
    standort: p.standort ?? '',
    forschungsschwerpunkte: [...p.forschungsschwerpunkte],
    uniAnsprechpartner: p.uniAnsprechpartner ?? '',
    website: p.website ?? '',
  };
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export function getChangedFields(
  original: EditFormData,
  current: EditFormData,
): PartnershipUpdate {
  const changes: PartnershipUpdate = {};

  if (current.parkName !== original.parkName) changes.parkName = current.parkName;
  if (current.land !== original.land) changes.land = current.land;
  if (current.stadt !== original.stadt) changes.stadt = current.stadt;
  if (current.gruendungsjahr !== original.gruendungsjahr) {
    changes.gruendungsjahr = current.gruendungsjahr ? parseInt(current.gruendungsjahr, 10) : null;
  }
  if (current.bisherigeKooperation !== original.bisherigeKooperation) {
    changes.bisherigeKooperation = current.bisherigeKooperation as PartnershipUpdate['bisherigeKooperation'];
  }
  if (current.datum !== original.datum) changes.datum = current.datum || null;
  if (!arraysEqual(current.themen, original.themen)) changes.themen = current.themen;
  if (current.bemerkungen !== original.bemerkungen) changes.bemerkungen = current.bemerkungen || null;
  if (current.parkAnsprechpartner !== original.parkAnsprechpartner) changes.parkAnsprechpartner = current.parkAnsprechpartner || null;
  if (current.kontaktdetails !== original.kontaktdetails) changes.kontaktdetails = current.kontaktdetails || null;
  if (current.webpraesenz !== original.webpraesenz) changes.webpraesenz = current.webpraesenz || null;
  if (current.universitaetName !== original.universitaetName) changes.universitaetName = current.universitaetName;
  if (current.standort !== original.standort) changes.standort = current.standort || null;
  if (!arraysEqual(current.forschungsschwerpunkte, original.forschungsschwerpunkte)) changes.forschungsschwerpunkte = current.forschungsschwerpunkte;
  if (current.uniAnsprechpartner !== original.uniAnsprechpartner) changes.uniAnsprechpartner = current.uniAnsprechpartner || null;
  if (current.website !== original.website) changes.website = current.website || null;

  return changes;
}

export function useEditForm(partnership: Partnership) {
  const initial = partnershipToFormData(partnership);
  const [formData, setFormData] = useState<EditFormData>(initial);
  const [originalData] = useState<EditFormData>(initial);

  const setField = useCallback(<K extends keyof EditFormData>(key: K, value: EditFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const isDirty = Object.keys(getChangedFields(originalData, formData)).length > 0;

  const reset = useCallback(() => {
    setFormData(partnershipToFormData(partnership));
  }, [partnership]);

  return { formData, setField, isDirty, reset, getChanges: () => getChangedFields(originalData, formData) };
}
