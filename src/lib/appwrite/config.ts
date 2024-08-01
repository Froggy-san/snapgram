import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,

  // projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  projectId: "65a320e3d25d9c19b4b9",

  // databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  databaseId: "65a388733ae762d6ed5b",

  // storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  storageId: "65a3882fd7b977625fff",

  // userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,

  userCollectionId: "65aca4be39c8d27c3ab4",

  // postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  postCollectionId: "65aca49b6d88ee63795e",

  savesCollectionId: "65aca4d2c2c613ec235c",
};

export const client = new Client();
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
