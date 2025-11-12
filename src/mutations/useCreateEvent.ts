import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "../lib/api";

export type CreateEventRequest = {
  name: string;
  eventLocaction: string; // Note: typo in API field name
  description: string;
  free: boolean;
  requireApproval: boolean;
  capacity: number; // 0 for unlimited, or a positive number for limited
  imageUrl: string;
  // Additional fields from form (not in current API spec - will be sent but may be ignored)
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  timezone?: string; // IANA timezone
  visibility?: "Public" | "Private" | "Unlisted";
};

export type CreateEventResponse = {
  id: string;
  // Add other response fields once API is working
  [key: string]: unknown;
};

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateEventRequest
    ): Promise<CreateEventResponse> => {
      return apiPost<CreateEventResponse>("/event", data);
    },
    onSuccess: () => {
      // Invalidate events list query if it exists
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
