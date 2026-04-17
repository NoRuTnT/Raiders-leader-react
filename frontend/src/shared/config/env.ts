const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const neopleImageBaseUrl = import.meta.env.VITE_NEOPLE_IMAGE_BASE_URL ?? "https://img-api.neople.co.kr/df";

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not defined.");
}

const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, "");
const appBaseUrl = normalizedApiBaseUrl.replace(/\/api$/, "");
const springHealthUrl = import.meta.env.VITE_SPRING_HEALTH_URL ?? `${appBaseUrl}/actuator/health`;
const lalabotHealthUrl = import.meta.env.VITE_LALABOT_HEALTH_URL ?? `${appBaseUrl}/lalabot/actuator/health`;

export const env = {
  apiBaseUrl: normalizedApiBaseUrl,
  neopleImageBaseUrl: neopleImageBaseUrl.replace(/\/+$/, ""),
  springHealthUrl: springHealthUrl.replace(/\/+$/, ""),
  lalabotHealthUrl: lalabotHealthUrl.replace(/\/+$/, ""),
};

export function getCharacterImageUrl(serverId: string, characterId: string, zoom: number) {
  return `${env.neopleImageBaseUrl}/servers/${serverId}/characters/${characterId}?zoom=${zoom}`;
}
