/**
 * Sentral historie-struktur for den scriptede Inven2 Connect-demoen.
 * Én fiktiv DOFI – «Nytt legemiddel mot benskjørhet» – følges fra utkast til
 * akseptert, sett fra forskeren i Connect og (forenklet) fra Inven2 internt.
 */

export type SceneId =
  | "title"
  | "home"
  | "login"
  | "dofi"
  | "inventors"
  | "submit"
  | "mydofis"
  | "internal"
  | "accepted"
  | "outro";

export type BeatKey =
  | "title.in"
  | "home.in"
  | "home.cards"
  | "home.submit"
  | "login.typing"
  | "dofi.new"
  | "dofi.title"
  | "dofi.leader"
  | "dofi.disclosure"
  | "dofi.description"
  | "dofi.product"
  | "dofi.files"
  | "dofi.toInventors"
  | "inv.list"
  | "inv.add"
  | "inv.email"
  | "inv.registered"
  | "inv.employment"
  | "inv.ownership"
  | "submit.ready"
  | "submit.click"
  | "submit.done"
  | "submit.email"
  | "my.list"
  | "int.in"
  | "int.review"
  | "int.receipt"
  | "int.chatter"
  | "int.accept"
  | "acc.email"
  | "acc.portal"
  | "outro.summary"
  | "outro.thanks";

export type Beat = {
  key: BeatKey;
  /** Kort forklaring nederst (undertekst for presentatøren/publikum). */
  caption?: string;
  /** CSS-selector som den simulerte pekeren skal bevege seg til og «klikke». */
  cursorTarget?: string;
  /**
   * CSS-selector pekeren hviler over; selve klikket (ring/ripple) og
   * overgangen til neste steg utløses av presentatørens eget trykk.
   */
  clickOnAdvance?: string;
  /** Utløser clickOnAdvance-klikket automatisk så snart pekeren er framme. */
  autoAdvanceOnArrive?: boolean;
  /** Ekstra forsinkelse før sceneskiftet etter et clickOnAdvance-klikk (ms). */
  advanceDelayMs?: number;
  /** Flere scriptede klikk i samme beat. delayMs måles fra starten av beatet. */
  clickSequence?: Array<{ target: string; delayMs?: number }>;
  /** Hvor lenge Auto-modus står på dette steget (ms). */
  autoMs?: number;
};

export type Scene = {
  id: SceneId;
  label: string;
  beats: Beat[];
};

export const scenes: Scene[] = [
  {
    id: "title",
    label: "Forside",
    beats: [{ key: "title.in", autoMs: 5000 }],
  },
  {
    id: "home",
    label: "Forsiden",
    beats: [
      {
        key: "home.in",
        caption:
          "Inven2 Connect er forskerens inngang for å melde inn en oppfinnelse (DOFI) – ett sted for innsending, oppfølging og dialog med Inven2.",
        autoMs: 8000,
      },
      {
        key: "home.cards",
        caption:
          "Forsiden gir også snarveier til Inven2 Marketplace, nyheter og kontakt – og forklarer hva en DOFI er.",
        autoMs: 7000,
      },
      {
        key: "home.submit",
        caption: "«Create a new DOFI» starter innmeldingen. Innsending krever innlogging.",
        clickOnAdvance: "#home-create-dofi",
        autoMs: 5000,
      },
    ],
  },
  {
    id: "login",
    label: "Innlogging",
    beats: [
      {
        key: "login.typing",
        caption:
          "Forskeren logger inn med egen bruker. Nye brukere registrerer seg selv – eller via invitasjon fra en medoppfinner.",
        clickOnAdvance: "#login-submit",
        autoMs: 7500,
      },
    ],
  },
  {
    id: "dofi",
    label: "Ny DOFI",
    beats: [
      {
        key: "dofi.new",
        caption:
          "En ny DOFI opprettes som utkast (I2-0318). Skjemaet er delt i tydelige seksjoner, med veiledning til hvert spørsmål.",
        autoMs: 8000,
      },
      {
        key: "dofi.title",
        caption: "Først et kort, gjenkjennelig navn på oppfinnelsen.",
        clickSequence: [{ target: "#field-title", delayMs: 700 }],
        autoMs: 6500,
      },
      {
        key: "dofi.leader",
        caption:
          "Institusjonsleder velges fra en kuratert liste – slik at riktig institusjon blir involvert fra start.",
        clickSequence: [
          { target: "#field-leader", delayMs: 700 },
          { target: "#leader-option-ous", delayMs: 2600 },
        ],
        autoMs: 8000,
      },
      {
        key: "dofi.disclosure",
        caption:
          "Ja/nei-valg åpner bare relevante oppfølgingsspørsmål – her: er publisering planlagt? Viktig for patentering.",
        clickSequence: [{ target: "#toggle-disclosure-yes", delayMs: 800 }],
        autoMs: 8000,
      },
      {
        key: "dofi.description",
        caption:
          "Beskrivelsen av oppfinnelsen og forskningen bak – med hint som hjelper forskeren å skrive det Inven2 trenger.",
        autoMs: 9000,
      },
      {
        key: "dofi.product",
        caption:
          "Hvilket produkt kan dette bli, hvilket problem løser det, og hvem er kundene? Spørsmålene leder fra forskning til marked.",
        autoMs: 9000,
      },
      {
        key: "dofi.files",
        caption:
          "Støttedokumenter – manuskript, data, figurer – lastes opp direkte på DOFIen. Utkastet lagres fortløpende.",
        clickSequence: [{ target: "#btn-upload", delayMs: 800 }],
        autoMs: 7000,
      },
      {
        key: "dofi.toInventors",
        caption: "Neste: teamet bak oppfinnelsen.",
        clickOnAdvance: "#tab-inventors",
        autoAdvanceOnArrive: true,
        autoMs: 3500,
      },
    ],
  },
  {
    id: "inventors",
    label: "Medoppfinnere",
    beats: [
      {
        key: "inv.list",
        caption:
          "Oppfinneren som opprettet DOFIen står som Submitter. Medoppfinnere legges til med e-postadresse.",
        autoMs: 6500,
      },
      {
        key: "inv.add",
        caption:
          "Amir (UiO) og Marte (OUS) inviteres. De får e-post med lenke, registrerer seg og får tilgang til utkastet.",
        clickSequence: [{ target: "#btn-add-inventor", delayMs: 700 }],
        autoMs: 7500,
      },
      {
        key: "inv.email",
        caption:
          "Invitasjonen: «Invitation to contribute to DOFI draft» – med sikker registreringslenke som er gyldig i 30 dager.",
        autoMs: 7500,
      },
      {
        key: "inv.registered",
        caption:
          "Når medoppfinnerne har registrert seg, ser alle det samme utkastet – og kan bidra. Submitter varsles og kan avvise ukjente.",
        autoMs: 7500,
      },
      {
        key: "inv.employment",
        caption:
          "Hver oppfinner bekrefter sin ansettelse. Ingrid har 80 % ved OUS og 20 % ved UiO – ansettelsen på oppfinnelsestidspunktet avgjør eierskap.",
        autoMs: 9000,
      },
      {
        key: "inv.ownership",
        caption:
          "Connect beregner institusjonelt eierskap automatisk ut fra oppfinnernes ansettelser – ingen manuell utregning, ingen tvil senere.",
        autoMs: 8000,
      },
    ],
  },
  {
    id: "submit",
    label: "Innsending",
    beats: [
      {
        key: "submit.ready",
        caption:
          "Når alle obligatoriske felt er utfylt og alle oppfinnere har bekreftet ansettelse, blir «Submit DOFI» aktiv.",
        autoMs: 7000,
      },
      {
        key: "submit.click",
        caption: "Submitter sender inn på vegne av teamet.",
        clickOnAdvance: "#btn-submit",
        advanceDelayMs: 900,
        autoMs: 4000,
      },
      {
        key: "submit.done",
        caption:
          "«DOFI Submitted!» – DOFIen får status Submitted, og alle oppfinnere får en PDF-oppsummering på e-post.",
        autoMs: 7500,
      },
      {
        key: "submit.email",
        caption:
          "Kvitteringen: «Your DOFI has been submitted for approval – I2-0318», med hele DOFIen som PDF vedlagt.",
        autoMs: 7500,
      },
    ],
  },
  {
    id: "mydofis",
    label: "Mine DOFIer",
    beats: [
      {
        key: "my.list",
        caption:
          "Under «My DOFIs» følger forskeren alle sine DOFIer – rolle, status og hvem som opprettet dem. Ingen behov for å spørre «hvor er saken min?».",
        autoMs: 8500,
      },
    ],
  },
  {
    id: "internal",
    label: "Hos Inven2",
    beats: [
      {
        key: "int.in",
        caption:
          "Samtidig hos Inven2: DOFIen dukker opp i saksbehandlernes kø i Salesforce – komplett, strukturert og klar for vurdering.",
        autoMs: 8500,
      },
      {
        key: "int.review",
        caption:
          "«Review Submission»: Inven2 godkjenner for evaluering. DOFIen får DOFI-nummer 26042, og en prosjektleder tildeles.",
        clickSequence: [{ target: "#qa-review", delayMs: 400 }],
        autoMs: 9000,
      },
      {
        key: "int.receipt",
        caption:
          "Oppfinnerne får kvittering med DOFI-nummer – og vet hvem hos Inven2 som følger opp saken.",
        autoMs: 7500,
      },
      {
        key: "int.chatter",
        caption:
          "Spørsmål underveis stilles i Chatter på DOFIen. Forskeren varsles på e-post, og svaret ligger på saken – ikke i en innboks.",
        autoMs: 9500,
      },
      {
        key: "int.accept",
        caption:
          "Etter evaluering: «Accept DOFI». Beslutningen logges på DOFIen, og prosjektet kan starte.",
        clickSequence: [{ target: "#qa-accept", delayMs: 400 }],
        autoMs: 7500,
      },
    ],
  },
  {
    id: "accepted",
    label: "Beslutning",
    beats: [
      {
        key: "acc.email",
        caption:
          "Oppfinnerne får den gode nyheten: «Your DOFI has been accepted». Neste steg er avtaler om oppfinnerandeler og rettigheter.",
        autoMs: 8500,
      },
      {
        key: "acc.portal",
        caption:
          "I Connect ser teamet status Accepted – og hele historikken fra utkast til beslutning, samlet på ett sted.",
        autoMs: 8500,
      },
    ],
  },
  {
    id: "outro",
    label: "Avslutning",
    beats: [
      { key: "outro.summary", autoMs: 12000 },
      { key: "outro.thanks", autoMs: 7000 },
    ],
  },
];

export type FlatBeat = Beat & {
  sceneIndex: number;
  sceneId: SceneId;
  beatIndex: number;
  globalIndex: number;
};

export const flatBeats: FlatBeat[] = scenes
  .flatMap((scene, sceneIndex) =>
    scene.beats.map((beat, beatIndex) => ({
      ...beat,
      sceneIndex,
      sceneId: scene.id,
      beatIndex,
      globalIndex: 0,
    })),
  )
  .map((beat, globalIndex) => ({ ...beat, globalIndex }));

export const totalBeats = flatBeats.length;

const indexByKey = new Map(flatBeats.map((b) => [b.key, b.globalIndex]));

/** Sant når `current` er på eller etter `target` i historien (kumulativ tilstand). */
export function reached(current: BeatKey, target: BeatKey) {
  return (indexByKey.get(current) ?? 0) >= (indexByKey.get(target) ?? 0);
}
