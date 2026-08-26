import { storeProfile } from "./storeProfile.mock";
import {
  ACCOUNT_STATUS,
  getAccountStatusForUser,
} from "../accountApproval.mock";

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

export function getMockStoreAccountStatus(user) {
  if (user) {
    return (
      getAccountStatusForUser(user) ||
      ACCOUNT_STATUS.PENDING
    );
  }

  try {
    const savedUser =
      window.localStorage.getItem("user");

    const parsedUser =
      savedUser
        ? JSON.parse(savedUser)
        : null;

    return (
      getAccountStatusForUser(parsedUser) ||
      ACCOUNT_STATUS.PENDING
    );
  } catch {
    return ACCOUNT_STATUS.PENDING;
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