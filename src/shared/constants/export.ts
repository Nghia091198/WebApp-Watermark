export const SAVE_METHOD = {
  shareSheet: 'share-sheet',
  download: 'download',
} as const;

export type SaveMethod = (typeof SAVE_METHOD)[keyof typeof SAVE_METHOD];

export const SAVE_METHOD_HINT: Record<SaveMethod, string> = {
  [SAVE_METHOD.shareSheet]: 'Bấm “Lưu tất cả” rồi chọn “Lưu hình ảnh” để lưu thẳng vào app Ảnh.',
  [SAVE_METHOD.download]:
    'Ảnh được lưu vào thư mục Tải xuống (Downloads). Nếu trình duyệt hỏi “Cho phép tải nhiều file”, hãy chọn Cho phép.',
};

export const SEQUENTIAL_DOWNLOAD_GAP_MS = 300;
