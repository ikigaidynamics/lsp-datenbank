import { useState } from 'react';
import { OverviewScreen } from './components/OverviewScreen';
import { DetailScreen } from './components/DetailScreen';
import { PermissionsScreen } from './components/PermissionsScreen';

export type Partnership = {
  id: string;
  // Science Park Daten
  parkName: string;
  land: string;
  stadt: string;
  gruendungsjahr: number;
  bisherigeKooperation: 'Keine' | 'Geplant' | 'Aktiv' | 'Abgeschlossen';
  datum: string;
  themen: string[];
  bemerkungen: string;
  parkAnsprechpartner: string;
  kontaktdetails: string;
  webpraesenz: string;
  // Universität Daten
  universitaetName: string;
  standort: string;
  fakultaeten: string[];
  forschungsschwerpunkte: string[];
  uniAnsprechpartner: string;
  website: string;
};

export const mockData: Partnership[] = [
  {
    id: '1',
    parkName: 'BioCity Leipzig',
    land: 'Deutschland',
    stadt: 'Leipzig',
    gruendungsjahr: 2003,
    bisherigeKooperation: 'Aktiv',
    datum: '2024-03-15',
    themen: ['Biotechnologie', 'Life Sciences', 'Medizintechnik'],
    bemerkungen: 'Langfristige Zusammenarbeit im Bereich Biotechnologie',
    parkAnsprechpartner: 'Dr. Petra Meyer',
    kontaktdetails: 'p.meyer@biocity-leipzig.de | +49 341 9876543',
    webpraesenz: 'https://www.biocity-leipzig.de',
    universitaetName: 'Universität Leipzig',
    standort: 'Leipzig, Sachsen, Deutschland',
    fakultaeten: ['Medizin', 'Biowissenschaften', 'Chemie', 'Physik'],
    forschungsschwerpunkte: ['Biotechnologie', 'Medizin', 'Life Sciences', 'Molekularbiologie'],
    uniAnsprechpartner: 'Prof. Michael Weber',
    website: 'https://www.uni-leipzig.de'
  },
  {
    id: '2',
    parkName: 'Wrocław Technology Park',
    land: 'Polen',
    stadt: 'Wrocław',
    gruendungsjahr: 2005,
    bisherigeKooperation: 'Geplant',
    datum: '2025-01-10',
    themen: ['Informatik', 'KI', 'Maschinenbau'],
    bemerkungen: 'Vorbereitung eines gemeinsamen Forschungsprojekts',
    parkAnsprechpartner: 'Prof. Andrzej Kowalski',
    kontaktdetails: 'a.kowalski@techpark.pl | +48 71 1234567',
    webpraesenz: 'https://www.techpark.pl',
    universitaetName: 'Politechnika Wrocławska',
    standort: 'Wrocław, Niederschlesien, Polen',
    fakultaeten: ['Informatik', 'Elektrotechnik', 'Maschinenbau', 'Architektur'],
    forschungsschwerpunkte: ['Informatik', 'Maschinenbau', 'Elektrotechnik', 'Smart Cities'],
    uniAnsprechpartner: 'Dr. Katarzyna Nowak',
    website: 'https://pwr.edu.pl'
  },
  {
    id: '3',
    parkName: 'Science Park Graz',
    land: 'Österreich',
    stadt: 'Graz',
    gruendungsjahr: 2002,
    bisherigeKooperation: 'Aktiv',
    datum: '2023-09-20',
    themen: ['Mobilität', 'Nachhaltigkeit', 'Energie'],
    bemerkungen: 'Regelmäßiger Wissensaustausch, jährliche Treffen',
    parkAnsprechpartner: 'Mag. Christina Huber',
    kontaktdetails: 'c.huber@sciencepark-graz.at | +43 316 987654',
    webpraesenz: 'https://www.sciencepark-graz.at',
    universitaetName: 'TU Graz',
    standort: 'Graz, Steiermark, Österreich',
    fakultaeten: ['Maschinenbau', 'Elektrotechnik', 'Informatik', 'Bauingenieurwesen'],
    forschungsschwerpunkte: ['Mobilität', 'Künstliche Intelligenz', 'Nachhaltigkeit', 'Digitalisierung'],
    uniAnsprechpartner: 'Ing. Thomas Müller',
    website: 'https://www.tugraz.at'
  },
  {
    id: '4',
    parkName: 'Brno Technology Park',
    land: 'Tschechien',
    stadt: 'Brno',
    gruendungsjahr: 2007,
    bisherigeKooperation: 'Abgeschlossen',
    datum: '2022-11-30',
    themen: ['Photonik', 'Nanotechnologie', 'Quantentechnologie'],
    bemerkungen: 'Erfolgreiches Projekt 2020-2022 abgeschlossen',
    parkAnsprechpartner: 'Dr. Pavel Novák',
    kontaktdetails: 'p.novak@brnotp.cz | +420 541 123456',
    webpraesenz: 'https://www.brnotp.cz',
    universitaetName: 'Masaryk University',
    standort: 'Brno, Südmähren, Tschechien',
    fakultaeten: ['Naturwissenschaften', 'Informatik', 'Medizin', 'Sozialwissenschaften'],
    forschungsschwerpunkte: ['Photonik', 'Nanotechnologie', 'Quantenphysik', 'Bioinformatik'],
    uniAnsprechpartner: 'Dr. Jan Dvořák',
    website: 'https://www.muni.cz'
  },
  {
    id: '5',
    parkName: 'Lausitz Science Park',
    land: 'Deutschland',
    stadt: 'Cottbus',
    gruendungsjahr: 2020,
    bisherigeKooperation: 'Aktiv',
    datum: '2020-06-01',
    themen: ['Energie', 'Strukturwandel', 'Innovation'],
    bemerkungen: 'Hauptstandort und Heimatbasis',
    parkAnsprechpartner: 'Sandra Wagner',
    kontaktdetails: 's.wagner@lausitz-sp.de | +49 355 123456',
    webpraesenz: 'https://www.lausitz-sciencepark.de',
    universitaetName: 'BTU Cottbus-Senftenberg',
    standort: 'Cottbus, Brandenburg, Deutschland',
    fakultaeten: ['Architektur', 'Maschinenbau', 'Umweltwissenschaften', 'Informatik'],
    forschungsschwerpunkte: ['Energie', 'Umwelt', 'Materialwissenschaften', 'Informations- und Kommunikationstechnologie'],
    uniAnsprechpartner: 'Dr. Anna Schmidt',
    website: 'https://www.b-tu.de'
  }
];

export type Screen = 'overview' | 'detail' | 'permissions';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('overview');
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);

  const handleViewDetail = (partnership: Partnership) => {
    setSelectedPartnership(partnership);
    setCurrentScreen('detail');
  };

  const handleBack = () => {
    setCurrentScreen('overview');
    setSelectedPartnership(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'overview' && (
        <OverviewScreen
          data={mockData}
          onViewDetail={handleViewDetail}
          onNavigateToPermissions={() => setCurrentScreen('permissions')}
        />
      )}
      {currentScreen === 'detail' && selectedPartnership && (
        <DetailScreen
          partnership={selectedPartnership}
          onBack={handleBack}
          onNavigateToPermissions={() => setCurrentScreen('permissions')}
        />
      )}
      {currentScreen === 'permissions' && (
        <PermissionsScreen
          onBack={handleBack}
          onNavigateToOverview={() => setCurrentScreen('overview')}
        />
      )}
    </div>
  );
}
