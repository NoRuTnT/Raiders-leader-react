const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const neopleImageBaseUrl =
  import.meta.env.VITE_NEOPLE_IMAGE_BASE_URL ?? "https://img-api.neople.co.kr/df";

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not defined.");
}

export const env = {
  apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
  neopleImageBaseUrl: neopleImageBaseUrl.replace(/\/+$/, ""),
};

export function getCharacterImageUrl(serverId: string, characterId: string, zoom: number) {
  return `${env.neopleImageBaseUrl}/servers/${serverId}/characters/${characterId}?zoom=${zoom}`;
}
