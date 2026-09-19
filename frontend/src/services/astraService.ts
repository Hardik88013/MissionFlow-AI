export type AstraHistoryMessage = {
  role: "user" | "astra";
  message: string;
};

type AstraMapAction = {
  type: "focus_vehicle";
  vehicle_id: number;
};

export type AstraResponse = {
  message: string;
  tool: string | null;
  data: Record<string, unknown> | null;
  action?: AstraMapAction;
};

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export async function askAstra(
  message: string,
  _history: AstraHistoryMessage[] = []
): Promise<AstraResponse> {

  const response = await fetch(
    `${API_BASE}/ai/astra/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Astra backend returned HTTP ${response.status}`
    );
  }

  const data =
    (await response.json()) as AstraResponse;

  if (!data.message) {
    throw new Error(
      "Astra returned an empty response."
    );
  }

  return data;
}

