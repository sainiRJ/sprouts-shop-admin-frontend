import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/store";
import { setCredentials, setRestoreAttempted } from "@/store/authSlice";
import { useRefreshTokenMutation } from "@/store/api";

/**
 * On app load, try to restore session using the refresh token cookie.
 * If successful, sets the access token and user in memory.
 */
export function AuthRestore() {
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  const hasTried = useRef(false);

  useEffect(() => {
    if (hasTried.current) return;
    hasTried.current = true;

    refreshToken()
      .unwrap()
      .then((response) => {
        const payload =
          response?.data ?? response?.responseBody?.data ?? response;
        if (payload?.accessToken) {
          dispatch(
            setCredentials({
              fullName: payload.fullName,
              email: payload.email,
              accessToken: payload.accessToken,
            })
          );
        }
        dispatch(setRestoreAttempted());
      })
      .catch(() => {
        dispatch(setRestoreAttempted());
      });
  }, [dispatch, refreshToken]);

  return null;
}
