import { useEffect, useRef, useState } from "react";
import { Api, AuthUserDto } from "../../client/Api";

export interface UseInitialRefreshProps {
  apiInstance: typeof Api.prototype.auth;
  updateAccessToken: (newToken: string | null) => void;
  setUser: (user: AuthUserDto | null) => void;
}

/**
 * Attempts to performs an initial refresh of the access token when the
 * component mounts
 * @param props the hook props
 */
export const useInitialRefresh = (props: UseInitialRefreshProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const hasAttemptedInitialRefresh = useRef(false);

  useEffect(() => {
    if (hasAttemptedInitialRefresh.current) return;
    hasAttemptedInitialRefresh.current = true;

    const refresh = async () => {
      try {
        const response = await props.apiInstance.authControllerRefresh({
          credentials: "include",
        });

        if (response.ok) {
          props.updateAccessToken(response.data.accessToken);
          props.setUser(response.data);
        }
      } catch {
        props.updateAccessToken(null);
        props.setUser(null);
      }
    };

    refresh().finally(() => setIsInitialized(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isInitialized;
};
