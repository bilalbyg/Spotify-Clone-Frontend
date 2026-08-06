type JwtPayload = {
  exp?: number;
};

export const isJwtTokenValid = (token: string | null | undefined): boolean => {
  if (!token) {
    return false;
  }

  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    return false;
  }

  try {
    const normalizedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      '=',
    );
    const payload = JSON.parse(window.atob(paddedPayload)) as JwtPayload;

    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
