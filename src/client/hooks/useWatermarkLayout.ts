import { useCallback, useEffect, useState } from 'react';
import { readLayout, writeLayout } from '@/client/services/settingsStorage';
import type { WatermarkLayout } from '@/shared/types/watermark';

export function useWatermarkLayout() {
  const [layout, setLayout] = useState<WatermarkLayout>(readLayout);

  useEffect(() => {
    writeLayout(layout);
  }, [layout]);

  const updateLayout = useCallback((patch: Partial<WatermarkLayout>) => {
    setLayout((current) => ({ ...current, ...patch }));
  }, []);

  return { layout, updateLayout };
}
