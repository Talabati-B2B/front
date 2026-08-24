import { storeProfile } from "./storeProfile.mock";

export const STORE_PENDING_STATUS_KEY = "talabaty-store-account-status";

export const storePendingProfile = {
  fullName:
    `${storeProfile.firstName ?? ""} ${storeProfile.lastName ?? ""}`.trim() ||
    storeProfile.ownerName ||
    "أحمد محمد",

  initial:
    storeProfile.firstName?.trim()?.charAt(0) ||
    storeProfile.ownerName?.trim()?.charAt(0) ||
    "أ",

  email: storeProfile.email || "ahmad.store@example.com",

  status: "pending",
  statusLabel: "قيد المراجعة",

  submissionDate: "20 يونيو 2026",

  storeType: "مول",

  location: "غزة، فلسطين",

  phone: "0590000000",

  whatsapp: "590000000",

  documents: [
    {
      id: "commercial-register",
      title: "سجل تجاري",
      fileName: "CommercialRegister.pdf",
      uploaded: true,
      verified: true,
    },
    {
      id: "proof-of-ownership",
      title: "إثبات ملكية",
      fileName: "Proof of ownership.pdf",
      uploaded: true,
      verified: true,
    },
    {
      id: "personal-identity",
      title: "الهوية الشخصية",
      fileName: "",
      uploaded: false,
      verified: false,
    },
  ],
};

export function getMockStoreAccountStatus() {
  try {
    return (
      window.localStorage.getItem(STORE_PENDING_STATUS_KEY) ||
      "pending"
    );
  } catch {
    return "pending";
  }
}

export function savePendingContactMock(contact) {
  try {
    window.localStorage.setItem(
      "talabaty-store-pending-contact",
      JSON.stringify(contact),
    );
  } catch {
    // Local persistence is optional;
    // the page state still remains functional.
  }

  return contact;
}

export function savePendingNotesMock(notes) {
  try {
    window.localStorage.setItem(
      "talabaty-store-pending-notes",
      notes,
    );
  } catch {
    // Local persistence is optional;
    // the page state still remains functional.
  }

  return notes;
}