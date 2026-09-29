/** Fiktive demodata – ingen ekte personer eller saker. */

export const dofi = {
  id: "I2-0318",
  number: "26042",
  title: "Nytt legemiddel mot benskjørhet",
  submitter: "Ingrid Solheim",
  submitterEmail: "ingrid.solheim@ous-hf.no",
  created: "12.03.2026",
  submitted: "19.03.2026",
  receipt: "20.03.2026",
  accepted: "28.04.2026",
  leader: {
    name: "Gunnhild Vesterålen",
    role: "Klinikkleder, Medisinsk klinikk",
    org: "Oslo universitetssykehus HF",
  },
  additionalLeader: {
    name: "Torfinn Skagemo",
    role: "Instituttleder, Institutt for klinisk medisin",
    org: "Universitetet i Oslo",
  },
  disclosurePlan:
    "Abstract til ASBMR Annual Meeting 2027 planlegges innsendt i mars 2027. Manuskript under utarbeidelse.",
  description:
    "Vi har identifisert en ny småmolekylær forbindelse (ON-114) som selektivt aktiverer osteoblaster og stimulerer benoppbygging uten å øke benresorpsjon. I prekliniske modeller gir ON-114 en økning i bentetthet på 18–24 % over 12 uker, med lav toksisitet.",
  product:
    "Et peroralt legemiddel for behandling av osteoporose, som alternativ til dagens injeksjonsbaserte anabole behandlinger.",
  problem:
    "Over 300 000 nordmenn har osteoporose. Dagens anabole legemidler krever daglige injeksjoner og er begrenset til 12–24 måneders bruk.",
  today:
    "Bisfosfonater bremser bentap men bygger ikke nytt ben. Anabole alternativer (teriparatid, romosozumab) er dyre, injeksjonsbaserte og tidsbegrensede.",
  better:
    "ON-114 tas som tablett, kan brukes over lengre tid, og kombinerer benoppbygging med lav bivirkningsprofil.",
  customers:
    "Pasienter med etablert osteoporose og høy bruddrisiko; legemiddelselskaper innen bein- og endokrinologi som lisenstakere.",
  data:
    "In vitro-data på humane osteoblaster, to dyremodeller (ovariektomerte rotter, 12 uker), foreløpig toksikologi. Neste steg: dose–respons og formulering.",
  file: { name: "ON-114_preklinisk_datapakke.pdf", size: "4,2 MB" },
};

export type Inventor = {
  name: string;
  email: string;
  role: "Submitter" | "Co-inventor";
  org: string;
  initials: string;
  color: string;
};

export const inventors: Inventor[] = [
  {
    name: "Ingrid Solheim",
    email: "ingrid.solheim@ous-hf.no",
    role: "Submitter",
    org: "OUS / UiO",
    initials: "IS",
    color: "bg-primary",
  },
  {
    name: "Amir Haddad",
    email: "amir.haddad@farmasi.uio.no",
    role: "Co-inventor",
    org: "UiO",
    initials: "AH",
    color: "bg-teal",
  },
  {
    name: "Marte Lien",
    email: "marte.lien@ous-hf.no",
    role: "Co-inventor",
    org: "OUS",
    initials: "ML",
    color: "bg-secondary",
  },
];

export const employments = [
  {
    employer: "Oslo universitetssykehus HF",
    unit: "Avdeling for endokrinologi",
    fraction: "80 %",
    start: "01.09.2018",
    role: "Overlege",
  },
  {
    employer: "Universitetet i Oslo",
    unit: "Institutt for klinisk medisin",
    fraction: "20 %",
    start: "01.01.2021",
    role: "Professor II",
  },
];

export const ownership = [
  { institution: "Oslo universitetssykehus HF", share: 60, color: "bg-primary" },
  { institution: "Universitetet i Oslo", share: 40, color: "bg-secondary" },
];

export const inven2 = {
  evaluationManager: "Sigrid Vollan-Moe",
  projectManager: "Jonas Bekkevold",
};

export const myDofis = [
  {
    id: "I2-0318",
    name: "Nytt legemiddel mot benskjørhet",
    createdBy: "Ingrid Solheim",
    stage: "Submitted",
    role: "Creator",
  },
  {
    id: "I2-0291",
    name: "Biomarkørpanel for tidlig påvisning av vitamin D-mangel",
    createdBy: "Amir Haddad",
    stage: "Under Evaluation",
    role: "Co-inventor (Registered)",
  },
  {
    id: "I2-0244",
    name: "App for oppfølging av bruddpasienter",
    createdBy: "Ingrid Solheim",
    stage: "Accepted",
    role: "Creator",
  },
];

export const stages = ["Draft", "Submitted", "Under Evaluation", "Accepted"] as const;
export type Stage = (typeof stages)[number] | "Declined";
