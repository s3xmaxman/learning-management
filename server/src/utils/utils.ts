import path from "path";

/**
 * コースのビデオ情報を更新します。
 *
 * @param {any} course コースオブジェクト
 * @param {string} sectionId セクションID
 * @param {string} chapterId チャプターID
 * @param {string} videoUrl ビデオURL
 * @throws {Error} セクションまたはチャプターが見つからない場合にエラーをスローします。
 */
export const updateCourseVideoInfo = (
  course: any,
  sectionId: string,
  chapterId: string,
  videoUrl: string
) => {
  const section = course.sections?.find((s: any) => s.sectionId === sectionId);
  if (!section) {
    throw new Error(`Section not found: ${sectionId}`);
  }

  const chapter = section.chapters?.find((c: any) => c.chapterId === chapterId);
  if (!chapter) {
    throw new Error(`Chapter not found: ${chapterId}`);
  }

  chapter.video = videoUrl;
  chapter.type = "Video";
};

/**
 * アップロードされたファイルの拡張子を検証します。
 *
 * @param {any[]} files アップロードされたファイルオブジェクトの配列
 * @throws {Error} サポートされていないファイルタイプの場合にエラーをスローします。
 */
export const validateUploadedFiles = (files: any) => {
  const allowedExtensions = [".mp4", ".m3u8", ".mpd", ".ts", ".m4s"];
  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  }
};

/**
 * ファイル名からContent-Typeを取得します。
 *
 * @param {string} filename ファイル名
 * @returns {string} Content-Type
 */
export const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".m3u8":
      return "application/vnd.apple.mpegurl";
    case ".mpd":
      return "application/dash+xml";
    case ".ts":
      return "video/MP2T";
    case ".m4s":
      return "video/iso.segment";
    default:
      return "application/octet-stream";
  }
};

/**
 * HLSまたはMPEG-DASH形式のビデオをアップロードします。
 *
 * @param {any} s3 S3クライアント
 * @param {any[]} files アップロードするファイルオブジェクトの配列
 * @param {string} uniqueId ユニークID
 * @param {string} bucketName S3バケット名
 * @returns {Promise<{videoUrl: string, videoType: string} | null>} ビデオURLとタイプ、またはHLS/DASHでない場合はnullを返します。
 */
export const handleAdvancedVideoUpload = async (
  s3: any,
  files: any,
  uniqueId: string,
  bucketName: string
) => {
  const isHLSOrDASH = files.some(
    (file: any) =>
      file.originalname.endsWith(".m3u8") || file.originalname.endsWith(".mpd")
  );

  if (isHLSOrDASH) {
    // HLS/MPEG-DASH アップロード処理
    const uploadPromises = files.map((file: any) => {
      const s3Key = `videos/${uniqueId}/${file.originalname}`;
      return s3
        .upload({
          Bucket: bucketName,
          Key: s3Key,
          Body: file.buffer,
          ContentType: getContentType(file.originalname),
        })
        .promise();
    });
    await Promise.all(uploadPromises);

    // マニフェストファイルのURLを決定
    const manifestFile = files.find(
      (file: any) =>
        file.originalname.endsWith(".m3u8") ||
        file.originalname.endsWith(".mpd")
    );
    const manifestFileName = manifestFile?.originalname || "";
    const videoType = manifestFileName.endsWith(".m3u8") ? "hls" : "dash";

    return {
      videoUrl: `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${manifestFileName}`,
      videoType,
    };
  }

  return null; // HLS/DASHでない場合はnullを返す
};

/**
 * セクションをマージします。
 *
 * @param {any[]} existingSections 既存のセクションの配列
 * @param {any[]} newSections 新しいセクションの配列
 * @returns {any[]} マージされたセクションの配列
 */
export const mergeSections = (
  existingSections: any[],
  newSections: any[]
): any[] => {
  const existingSectionsMap = new Map<string, any>();
  for (const existingSection of existingSections) {
    existingSectionsMap.set(existingSection.sectionId, existingSection);
  }

  for (const newSection of newSections) {
    const section = existingSectionsMap.get(newSection.sectionId);
    if (!section) {
      // 新しいセクションを追加
      existingSectionsMap.set(newSection.sectionId, newSection);
    } else {
      // 既存のセクション内のチャプターをマージ
      section.chapters = mergeChapters(section.chapters, newSection.chapters);
      existingSectionsMap.set(newSection.sectionId, section);
    }
  }

  return Array.from(existingSectionsMap.values());
};

/**
 * チャプターをマージします。
 *
 * @param {any[]} existingChapters 既存のチャプターの配列
 * @param {any[]} newChapters 新しいチャプターの配列
 * @returns {any[]} マージされたチャプターの配列
 */
export const mergeChapters = (
  existingChapters: any[],
  newChapters: any[]
): any[] => {
  const existingChaptersMap = new Map<string, any>();
  for (const existingChapter of existingChapters) {
    existingChaptersMap.set(existingChapter.chapterId, existingChapter);
  }

  for (const newChapter of newChapters) {
    existingChaptersMap.set(newChapter.chapterId, {
      ...(existingChaptersMap.get(newChapter.chapterId) || {}),
      ...newChapter,
    });
  }

  return Array.from(existingChaptersMap.values());
};

/**
 * コースの全体的な進捗率を計算します。
 *
 * @param {any[]} sections セクションの配列
 * @returns {number} 全体的な進捗率（パーセント）
 */
export const calculateOverallProgress = (sections: any[]): number => {
  const totalChapters = sections.reduce(
    (acc: number, section: any) => acc + section.chapters.length,
    0
  );

  const completedChapters = sections.reduce(
    (acc: number, section: any) =>
      acc + section.chapters.filter((chapter: any) => chapter.completed).length,
    0
  );

  return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
};
