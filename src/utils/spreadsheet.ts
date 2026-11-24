import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Linking, Platform } from "react-native";

const API = "http://localhost:8080"; 
export type ImportResult = {
  imported: number;
  errors: string[];
  createdCategories: string[];
};


export async function importExpenses(userId: string | number): Promise<ImportResult | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*", 
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  const formData = new FormData();

  if (Platform.OS === "web") {
    formData.append("file", asset.file as Blob, asset.name);
  } else {
    formData.append("file", {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType ?? "application/octet-stream",
    } as any);
  }


  const response = await fetch(`${API}/expense/import?userId=${userId}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}


export async function exportExpenses(userId: string | number, format: "xlsx" | "csv" = "xlsx") {
  const url = `${API}/expense/user/${userId}/export?format=${format}`;

  if (Platform.OS === "web") {
    await Linking.openURL(url); 
  }

  const { uri, status } = await FileSystem.downloadAsync(
    url,
    FileSystem.cacheDirectory + `despesas.${format}`,
  );
  if (status !== 200) throw new Error("Não foi possível exportar.");

  await Sharing.shareAsync(uri);
}